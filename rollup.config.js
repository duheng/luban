const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
import copy from 'rollup-plugin-copy'
import multiInput from 'rollup-plugin-multi-input';
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";

const mark = `/**
* 欢迎来到墨子工程
* 邮箱: duheng1100@163.com
* github: https://github.com/duheng/
**/`

export default [
    {
        input: ['src/**/*.js','!src/config','!src/index.js'],
        output:  {
            banner: mark,
            dir: 'bin',
            format:  'cjs',
        },
        plugins: [
            terser({ compress: { drop_console: false } }),
            multiInput(),
            copy({
                targets: [
                  { src: 'src/index.js', dest: 'bin' },
                  { src: 'src/config/*', dest: 'bin/config' }
                ]
            }),
            process.env.ENV === "development" ? serve({
                port: 3000,
                contentBase: ["./"], // 静态资源所在目录
            }) : null
        ],
    }

]
     
