// Strict configuration for authorized environments
const ALLOWED_ORIGINS = [
  "https://whoistob1as.me",
  "http://localhost:4000",
  "http://127.0.0.1:4000"
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Modern Cloudflare Workers pull secrets from the 'env' object
    const OAUTH_CLIENT_ID = env.CLIENT_ID || "";
    const OAUTH_CLIENT_SECRET = env.CLIENT_SECRET || "";

    // Initial auth route
    if (url.pathname === "/auth") {
      const state = crypto.randomUUID();
      const redirectUrl = new URL("https://github.com/login/oauth/authorize");
      redirectUrl.searchParams.set("client_id", OAUTH_CLIENT_ID);
      redirectUrl.searchParams.set("scope", "repo");
      redirectUrl.searchParams.set("state", state);
      
      return new Response(null, {
        status: 302,
        headers: {
          "Location": redirectUrl.href,
          "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; SameSite=Strict; Path=/`
        }
      });
    }

    // Callback route
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const urlState = url.searchParams.get("state");
      
      const cookieHeader = request.headers.get("Cookie") || "";
      const match = cookieHeader.match(/oauth_state=([^;]+)/);
      const cookieState = match ? match[1] : null;

      if (!code) {
        return new Response("Missing code parameter", { status: 400 });
      }

      if (!urlState || !cookieState || urlState !== cookieState) {
        return new Response("Invalid or missing state parameter", { status: 403 });
      }

      // Exchange code for access token
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          client_id: OAUTH_CLIENT_ID,
          client_secret: OAUTH_CLIENT_SECRET,
          code: code,
        }),
      });

      const data = await tokenResponse.json();

      if (data.error) {
        console.error("GitHub OAuth Error:", data);
        return new Response("Authorization failed", { status: 400 });
      }

      const token = data.access_token;
      const provider = "github";

      // Secure payload execution via strict origin verification
      const script = `
        <script>
          const ALLOWED_ORIGINS = ${JSON.stringify(ALLOWED_ORIGINS)};
          
          const receiveMessage = (message) => {
            // Drop any messages that don't originate from our CMS environments
            if (!ALLOWED_ORIGINS.includes(message.origin)) {
              console.warn("Rejected unauthorized message origin:", message.origin);
              return;
            }
            
            if (message.data === "authorizing:github") {
              window.opener.postMessage(
                'authorization:github:success:{"token":"${token}","provider":"${provider}"}',
                message.origin
              );
              window.removeEventListener("message", receiveMessage);
            }
          };
          
          window.addEventListener("message", receiveMessage, false);
          
          // Targeted handshakes instead of broadcasting via wildcard '*'
          ALLOWED_ORIGINS.forEach(origin => {
            try {
              window.opener.postMessage("authorizing:github", origin);
            } catch (e) {
              // Fail silently if the origin window isn't matching the current opener context
            }
          });
        </script>
      `;

      return new Response(script, {
        headers: {
          "Content-Type": "text/html",
          "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "Referrer-Policy": "no-referrer"
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};