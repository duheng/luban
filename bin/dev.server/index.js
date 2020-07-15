const koa = require('koa');
const webpack = require('webpack');

const app = new koa();
const config = require('../webpack.config/development.client.config');
const compiler = webpack(config);

const devMiddleware = require('./devMiddleware');
const hotMiddleware = require('./hotMiddleware');

app.use(devMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(hotMiddleware(compiler,{
    reload:true
}));

// app.use(serve(__dirname + '/src/', {
//     extensions: ['html']
// }));

app.listen(3000, () => {
    console.log('Example app listening om port 3000!\n');
});