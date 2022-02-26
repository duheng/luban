
module.exports = function (src,link) {
    console.log('src---', link)
    src += `
    if(module.hot) {
        module.hot.accept();
    }`
    return src
}
