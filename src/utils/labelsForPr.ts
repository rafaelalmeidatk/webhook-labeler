import minimatch from "minimatch";
import { changedFilenames } from "./changedFilenames";
import { fetchConfig } from "./fetchConfig";
import { PullInfo } from "../types";

export const labelsForPr = async ({ owner, repo, prNumber }: PullInfo) => {
  const config = await fetchConfig({ owner, repo });

  const labelNames = Object.keys(config.labels);

  const labels = new Set<string>();
  const filenames = await changedFilenames({ owner, repo, prNumber });

  filenames.forEach((filename) => {
    labelNames.forEach((labelName) => {
      const pattern = config.labels[labelName];
      let matched = false;

      if (Array.isArray(pattern)) {
        matched = pattern.some((p) => minimatch(filename, p));
      } else {
        matched = minimatch(filename, pattern);
      }

      if (matched) {
        labels.add(labelName);
      }
    });
  });

  return labels;
};
