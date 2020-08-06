const koa = require('koa');
const Webpack = require('webpack');
const path = require('path')
const app = new koa();
const devConfig = require('../webpack.config/development.client.config');

const config = devConfig()
const compiler = Webpack(config);
console.log('config----',compiler)
const devMiddleware = require('./devMiddleware');
const hotMiddleware = require('./hotMiddleware');
//
app.use(devMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

// app.use(hotMiddleware(compiler,{
//     reload:true
// }));


app.listen(3000, () => {
    console.log('Example app listening om port 3000!\n');
});
