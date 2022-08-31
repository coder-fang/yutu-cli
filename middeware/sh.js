const sh = require('shelljs')

/**
 * @description                             执行shell命令
 * @param {String}      params              命令 
 * @returns 
 */
const exec = params => {
    return new Promise((resolve, reject) => {
        const code = sh.exec(params).code
        if (code !== 0) {
            reject()
        } else {
            resolve()
        }
    })
}

/**
 * 
 * @description                             进入文件夹
 * @param {String}      params              地址
 * @returns 
 */
const cd = params => {
    return new Promise((resolve, reject) => {
        const code = sh.cd(params).code
        if (code !== 0) {
            reject()
        } else {
            resolve()
        }
    })
}

/**
 * @description                              删除操作
 * @param {String}      params               文件或文件夹名字
 * @returns 
 */
const rm = params => {
    return new Promise((resolve, reject) => {
        const code = sh.rm('-rf', params).code
        if (code !== 0) {
            reject()
        } else {
            resolve()
        }
    })
}

module.exports = {
    exec,
    cd,
    rm
}