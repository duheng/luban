const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
import multiInput from 'rollup-plugin-multi-input';
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";

const mark = `/**
* 欢迎来到墨子工程
* 邮箱: duheng1100@163.com
* github: https://github.com/duheng/
**/`

const binMark = `#!/bin/sh 
":" //# comment; exec /usr/bin/env node --max_old_space_size=8000 "$0" "$@"`
export default [
    {
        input: ['src/**/*.js'],
        output:  {
            banner: mark,
            dir: 'bin',
            format:  'cjs',
        },
        plugins: [
            terser({ compress: { drop_console: false } }),
            multiInput(),
            process.env.ENV === "development" ? serve({
                port: 3000,
                contentBase: ["./"], // 静态资源所在目录
            }) : null
        ],
    },
    {
        input: ['src/index.js'],
        output:  {
            banner: binMark,
            dir: 'bin',
            format:  'cjs',
        },
        plugins: [
           // multiInput(),
        ],
    }

]
     
