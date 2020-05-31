import { octokit } from "../octokit";
import { PullInfo } from "../types";

export const addLabels = (
  labels: string[],
  { owner, repo, prNumber }: PullInfo
) => {
  return octokit.issues.addLabels({
    owner,
    repo,
    issue_number: prNumber,
    labels,
  });
};
