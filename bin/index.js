#!/usr/bin/env node

const commander = require("commander");
const packages = require("../package.json");
const chalk = require('chalk');
const printLogo = () => {
  console.log(
    '\n\n\n',
    chalk.hex('5bc2e7').bold([
      '    ████             █████ ',
      '   ░░███            ░░███   ',
      '    ░███  █████ ████ ░███████   ██████   ████████  ',
      '    ░███ ░░███ ░███  ░███░░███ ░░░░░███ ░░███░░███ ',
      '    ░███  ░███ ░███  ░███ ░███  ███████  ░███ ░███ ',
      '    ░███  ░███ ░███  ░███ ░███ ███░░███  ░███ ░███ ',
      '    █████ ░░████████ ████████ ░░████████ ████ █████',
      '   ░░░░░   ░░░░░░░░ ░░░░░░░░   ░░░░░░░░ ░░░░ ░░░░░ ',
    ].join('\n'))
    ,
    '\n\n\n',
  )
}
commander.version(packages.version);

commander
  .command("init")
  .description("创建项目")
  .allowUnknownOption()
  .action(async (options) => {
    await require("./commands/init")(options);
  });

commander
  .command("pack")
  .description("打包💼")
  .option("-p --prod", "打包线上版本")
  .option("-m --min", "压缩优化")
  .option("-n --node", "打包node serve工程")
  .allowUnknownOption()
  .action(async (options) => {
    printLogo()
    await require("./commands/pack")(options);
  });

commander
  .command("server")
  .description("本地开发服务🐆")
  .option("-s --static", "打包线上版本")
  .allowUnknownOption()
  .action(async (options) => {
    try {
      printLogo()
      await require("./commands/server")(options);
    } catch (err) {
      console.log("启动serve失败 \r\n", err);
    }
  });

commander
  .command("dll")
  .description("打包第三方模块🐆")
  .allowUnknownOption()
  .action(async (options) => {
    try {
      printLogo()
      await require("./commands/dll")(options);
    } catch (err) {
      console.log("dll打包失败\r\n", err);
    }
  });

commander.parse(process.argv);
