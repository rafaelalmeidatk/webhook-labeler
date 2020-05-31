import { octokit } from "../octokit";
import { PullInfo } from "../types";

export const changedFilenames = async ({ owner, repo, prNumber }: PullInfo) => {
  let filenames: string[] = [];
  // From https://developer.github.com/v3/pulls/#list-pull-requests-files
  // "Responses include a maximum of 3000 files."
  const maxIterations = 30;

  for (let i = 1; i <= maxIterations; i++) {
    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
      page: i,
    });

    if (files.length === 0) {
      break;
    }

    files.forEach((f) => filenames.push(f.filename));
  }

  return filenames;
};
