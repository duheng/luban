
const fs = require("fs");
const path = require("path");
const CWD = process.cwd();
const { isChangeDll } = require("../utils/dllPitch");
const { config, useDllPath } = require("../utils/common"); 

//主: webpack4之后需 webpack命令被抽取到webpack-cli中，如果webpack-cli安装在本地则需要用当前node_modules中的webpack才能找到cli

module.exports = async (options) => {
    process.env.NODE_ENV = "development";
    if(!options.static) { 
        try {
            const _useDllPath = useDllPath()
            if (isChangeDll(_useDllPath, config)) {
                await require("./dll")(options);
            }
        } catch (e) {
            console.log("打包dll失败：", e);
        }
        await require("../servers/dev-server")(config);
    } else { // 启动静态服务
        await require("../servers/static-server");
    }

};
