const OAUTH_CLIENT_ID = typeof CLIENT_ID !== "undefined" ? CLIENT_ID : "";
const OAUTH_CLIENT_SECRET = typeof CLIENT_SECRET !== "undefined" ? CLIENT_SECRET : "";

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
      const redirectUrl = new URL("https://github.com/login/oauth/authorize");
      redirectUrl.searchParams.set("client_id", OAUTH_CLIENT_ID);
      redirectUrl.searchParams.set("scope", "repo");
      
      return Response.redirect(redirectUrl.href, 302);
    }

    // Callback route
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code parameter", { status: 400 });
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
        return new Response(JSON.stringify(data), { status: 400 });
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
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};