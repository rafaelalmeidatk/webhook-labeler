import { NowRequest } from "@now/node";
import crypto from "crypto";

export const validateWebhookRequest = (req: NowRequest) => {
  if (!req.body) return false;

  const payload = JSON.stringify(req.body);
  const signature =
    "sha1=" +
    crypto
      .createHmac("sha1", process.env.GITHUB_SECRET!)
      .update(payload)
      .digest("hex");

  return req.headers["x-hub-signature"] === signature;
};
