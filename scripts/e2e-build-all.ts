const { exec } = require("child_process");

const e2eProjects = ["children", "i18n"];

const getPackageDir = (dirName: string) => "./e2e/" + dirName;

for (let packageDir of e2eProjects) {
  process.chdir(getPackageDir(packageDir));

  console.log(`[i] Installing e2e project ${packageDir}...`);
  exec("yarn");

  console.log(`[i] Building e2e project ${packageDir}...`);
  exec("yarn start:prod");

  process.chdir("../../");
}
