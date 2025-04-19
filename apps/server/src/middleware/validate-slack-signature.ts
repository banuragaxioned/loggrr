import type { MiddlewareHandler, Context } from "hono";

export const validateSlackSignature = (getSigningSecret: (c: Context) => string): MiddlewareHandler => {
  return async (c, next) => {
    const timestamp = c.req.header("X-Slack-Request-Timestamp");
    const signature = c.req.header("X-Slack-Signature");

    if (!timestamp || !signature) {
      return c.json({ error: "Missing Slack signature headers" }, 401);
    }

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > 60 * 5) {
      return c.json({ error: "Request too old" }, 401);
    }

    const body = await c.req.text();
    const baseString = `v0:${timestamp}:${body}`;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(getSigningSecret(c));
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);

    const baseStringData = encoder.encode(baseString);
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, baseStringData);
    const expectedSignature =
      "v0=" +
      Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    if (signature !== expectedSignature) {
      return c.json({ error: "Invalid Slack signature" }, 401);
    }

    const params = new URLSearchParams(body);
    const parsedBody = Object.fromEntries(params.entries());
    c.set("parsedBody", parsedBody);

    await next();
  };
};
