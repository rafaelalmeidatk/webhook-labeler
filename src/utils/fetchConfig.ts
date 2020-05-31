import JSON5 from "json5";
import { octokit } from "../octokit";
import { PullInfo } from "../types";

type Config = {
  labels: { [key: string]: string | string[] };
};

export const fetchConfig = async ({
  owner,
  repo,
}: Omit<PullInfo, "prNumber">) => {
  const { data } = await octokit.repos
    .getContents({
      owner,
      repo,
      path: ".github/labeler.json",
    })
    .catch((err) => {
      if (err?.status === 404) {
        throw new Error(
          "Config file not found! Please create a labeler.json file inside the .github folder of the repository"
        );
      }

      throw err;
    });

  if (data.encoding !== "base64") {
    throw new Error(`Unknown encoding for the config file: ${data.encoding}`);
  }

  const buffer = Buffer.from(data.content, "base64");
  const content = buffer.toString("utf-8");
  const json = JSON5.parse(content);

  return json as Config;
};
