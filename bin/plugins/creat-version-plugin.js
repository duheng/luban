
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const child_process = require('child_process');

const nameReg = /^([^\@]*)\@([^\.]+)(\.(js|css))$/

const crypto = require('crypto')

function toMd5 (str) {
    const md5 = crypto.createHash('md5')
    return md5.update(str).digest('hex')
}

const mapDIr = (verDirs, callback) => {
    console.log('directory-AA---',fs.statSync(verDirs).isDirectory())
  //  const loadVerDir = fs.readdirSync(verDirs);

    // if(!fs.statSync(loadVerDir).isDirectory()) {
    //    typeof(callback) == 'function' && callback(loadVerDir)
    // } else {
    //   console.log('directory----',loadVerDir)
    //     loadVerDir.forEach(item=>{
    //     //  path.join(pageDir, loadPageDir[i])
    //       console.log('im----',item)
    //      //  let isDirectory = fs.statSync(item).isDirectory()
    //      // if(isDirectory) {
    //      //   mapDIr(item)
    //      // }else {
    //      //   typeof(callback) == 'function' && callback(item)
    //      // }
    //     })
    // }

}
class VersionCompilerPlugin {
    apply (compiler) {
        compiler.hooks.done.tapPromise('creatVersion', async (stats) => {

             const fileList = Object.keys(stats.compilation.assets)
               console.log('stats----',fileList)

             await this.writeFilemappingsion(fileList)
        })
    }



    async writeFilemappingsion (fileList) {
        const projectName = path.parse(path.resolve()).name
        fileList.forEach((fileName) => {
            if (/\.(js|css)/.test(fileName)) {
                const matchInfo = fileName.match(nameReg)
                if (matchInfo) {
                     const name = matchInfo[1] + matchInfo[3]
                     const version = matchInfo[2]
                     const __verPath = path.resolve('ver', name + '.ver')
                     const __verDir = path.dirname(__verPath)
                     if(!fs.existsSync(__verDir)) {
                       shell.mkdir('-p', __verDir)
                     }
                     fs.writeFileSync(__verPath, version, 'utf-8')
                }
            }
        })

        const mappings = []
        const chunks = []
        try {
          //  const fileNames = nodeDir.files(path.resolve('ver'), { sync: true })
            const verDirs = path.resolve('ver')

            mapDIr(verDirs,item=>{
              console.log('item-----', item)
            })
            // loadVerDir.forEach(item=>{
            //     console.log('item------',   item)
            // })

          //  fileNames.forEach(fileName => {
            //     const baseFileName = path.basename(fileName)
            //     if (baseFileName === 'chunk.json.ver' || baseFileName === 'versions.mapping' || !baseFileName.endsWith('.ver')) {
            //         return
            //     }
            //     const version = fs.readFileSync(fileName, { encoding: 'UTF-8' })
            //     const name = baseFileName.replace(/\.ver$/, '')
            //
            //     const ext = '.' + name.split('.').pop()
            //     const baseName = name.split('.').slice(0, -1).join('.')
            //
            //     mappings.push(`${fileName.slice(path.resolve('ver').length + 1)}#${version}`)
            //     chunks.push(`//q.qunarzz.com/${projectName}/prd/${baseName}@${version}${ext}`)
            // })
        } catch (e) {
            console.log(e)
        }
        //
        // const chunkMd5 = toMd5(mappings.join('\n'))
        // fs.outputFile(path.resolve('ver', 'chunk.json.ver'), chunkMd5, 'utf-8')
        // mappings.push(`chunk.json#${chunkMd5}`)
        // fs.outputFile(path.resolve('ver', 'versions.mapping'), mappings.join('\n'), 'utf-8')
        // fs.outputFile(path.resolve(`prd/chunk@${chunkMd5}.json`), JSON.stringify(chunks), 'utf-8')
    }
}

module.exports = VersionCompilerPlugin
