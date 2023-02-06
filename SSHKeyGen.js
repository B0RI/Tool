const readlineSync = require("readline-sync");
const { spawn } = require("child_process");
const homeDir = require("os").homedir();
const chalk = require("chalk");
const boxen = require("boxen");
const fs = require("fs");

const createMsgBox = (msg) => {
  const targetMsg = chalk.white.bold(msg);

  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "yellowBright",
    backgroundColor: "cyan",
  };
  let msgBox = boxen(targetMsg, boxenOptions);

  return msgBox;
};

const pbcopy = (data) => {
  let proc = spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();

  return data;
};

console.log(createMsgBox("Github SSH Key Generator"));

let email = readlineSync.question("Please input your github email: ");
let savePath = readlineSync.question("Please input SSH key save file name: ");

if (savePath == "") {
  savePath = `${homeDir}/.ssh/id_rsa`;
}

const generator = spawn(
  "ssh-keygen",
  ["-t", "rsa", "-b", "4096", "-C", email, "-f", savePath],
  {
    stdio: "inherit",
  }
);

generator.on("close", (code) => {
  return new Promise((resolve) => {
    if (code == 0) {
      console.log("\nCompleted generate SSH key!");
      resolve(0);
    } else {
      console.log("\nError occurred!");
      resolve(1);
    }
  }).then((code) => {
    if (code == 0) {
      let key = "";

      if (savePath == "") {
        key = fs.readFileSync(`${homeDir}/.ssh/id_rsa.pub`, "utf-8");
      } else {
        key = fs.readFileSync(savePath + ".pub", "utf-8");
      }

      pbcopy(key);

      console.log(
        createMsgBox("Copied SSH public key. Go to GitHub and paste.")
      );
    }
  });
});
