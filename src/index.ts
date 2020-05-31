import { NowRequest, NowResponse } from "@now/node";
import webhooks from "@octokit/webhooks";
import { labelsForPr } from "./utils/labelsForPr";
import { addLabels } from "./utils/addLabel";
import { PullInfo } from "./types";
import { validateWebhookRequest } from "./utils/validateWebhookRequest";

const validActions = ["opened", "synchronize"];

export default async (req: NowRequest, res: NowResponse) => {
  if (!process.env.GITHUB_TOKEN) {
    res.status(500).send("GITHUB_TOKEN is not defined");
    return;
  }

  if (!process.env.GITHUB_SECRET) {
    res.status(500).send("GITHUB_SECRET is not defined");
    return;
  }

  if (req.method === "GET") {
    res.status(200).send("OK");
    return;
  }

  if (!validateWebhookRequest(req)) {
    res.status(401).send("https://http.cat/401");
    return;
  }

  const event = req.body as webhooks.WebhookPayloadPullRequest;

  if (!validActions.includes(event.action)) {
    res.status(200).send("OK");
    return;
  }

  const prInfo: PullInfo = {
    owner: event.repository.owner.login,
    repo: event.repository.name,
    prNumber: event.number,
  };

  const labels = await labelsForPr(prInfo);
  await addLabels([...labels], prInfo);

  res.status(200).send("OK");
};
