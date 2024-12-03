import ProgressBar from "progress";

export const progressBar = new ProgressBar(":bar :percent", {
  total: 100,
  width: 40,
  complete: "=",
  incomplete: "-",
});
