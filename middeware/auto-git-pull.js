const { resolve } = require('path')
const { exec, cd, rm } = require('./sh')


// 调用配置文件
const gitPull = async() => {
    /**
     * @description 打包目录
     * @param {String} path
     */
    const path = 'dist'
    const outPath = resolve('./')
    const item = process.argv.find(el => /branch=/.test(el))
    const branch = item ? item.replace(/branch=/i, '') : 'master'
    await cd(path)
    try {
        /**
         * 切换分支并拉取代码
         */
        /**
         * package.json
         * 命令auto-git-pull与auto-git-push中配置分支参数
         * branch=分支
         */
        await exec(`git checkout .`)
        console.log(`git checkout .`)
        await exec(`git checkout ${branch}`)
        console.log(`git checkout ${branch}`)
        await exec(`git pull origin ${branch}`)
        console.log(`git pull origin ${branch}`)
    } catch (error) {
        console.log(error, 'git error')
    }
    try {
        /**
         * 手动删除dist下面的文件夹或文件
         * 根据需要自行添加
         */
        await rm('css')
        await rm('img')
        await rm('js')
        console.log(`rm css img js`)
    } catch (error) {
        console.log(error, 'rm error')
    }
    await cd(outPath)
}

gitPull()