
module.exports = function (src,link) {
    src += `
    if(module.hot) {
        module.hot.accept();
    }`
    return src
}
