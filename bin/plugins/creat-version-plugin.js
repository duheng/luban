
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const child_process = require('child_process');
const { config } = require('../utils/common')
const nameReg = /^([^\@]*)\@([^\.]+)(\.(js|css))$/

const crypto = require('crypto')

function toMd5 (str) {
    const md5 = crypto.createHash('md5')
    return md5.update(str).digest('hex')
}


class VersionCompilerPlugin {
    apply (compiler) {
        compiler.hooks.done.tapPromise('creatVersion', async (stats) => {
             const fileList = Object.keys(stats.compilation.assets)
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
                     const __verPath = path.resolve(`${config.base}/ver`, name + '.ver')
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
          const repeatVersion = fileName => {
            const baseFileName = path.basename(fileName)
            if (baseFileName === 'chunk.json.ver' || baseFileName === 'versions.mapping' || !baseFileName.endsWith('.ver')) {
                return
            }
            const version = fs.readFileSync(fileName, { encoding: 'UTF-8' })
            const name = baseFileName.replace(/\.ver$/, '')
            const ext = '.' + name.split('.').pop()
            const baseName = name.split('.').slice(0, -1).join('.')
            mappings.push(`${fileName.slice(path.resolve('ver').length + 1)}#${version}`)
            chunks.push(`//q.qunarzz.com/${projectName}/prd/${baseName}@${version}${ext}`)
          }
          
          const verDirs = path.resolve(`${config.base}/ver`)

          const mapDIr = (verDirs, callback) => {
              if(!fs.statSync(verDirs).isDirectory()) {
                repeatVersion(verDirs)
              } else {
                fs.readdirSync(verDirs).forEach(item=>{
                  const __item = path.resolve(verDirs,item)
                   if(fs.statSync(__item).isDirectory()) {
                     mapDIr(__item,_=>{})
                   } else {
                    repeatVersion(__item)
                    typeof(callback) === 'function' && callback(__item)
                   }
                })
              }
          }
            mapDIr(verDirs)

       console.log(mappings)
       console.log(chunks)
          
        } catch (e) {
            console.log(e)
        }
    
        
        const chunkMd5 = toMd5(mappings.join('\n'))
        fs.writeFileSync(path.resolve(`${config.base}/ver`, 'chunk.json.ver'), chunkMd5, 'utf-8')
        mappings.push(`chunk.json#${chunkMd5}`)
        fs.writeFileSync(path.resolve(`${config.base}/ver`, 'versions.mapping'), mappings.join('\n'), 'utf-8')
        fs.writeFileSync(path.resolve(`${config.build}/chunk@${chunkMd5}.json`), JSON.stringify(chunks), 'utf-8')
    }
}

module.exports = VersionCompilerPlugin
