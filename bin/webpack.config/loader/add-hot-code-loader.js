module.exports = function (src) {
    const { entry } =  this.query
    Object.keys(entry).map(item=>{
        const __entryItem = entry[item].replace(/.\//,'')
        if(this.resourcePath.includes(__entryItem)) {
            src += `
            if(module.hot) {
                module.hot.accept();
            }`
        }
    })
    return src
}
