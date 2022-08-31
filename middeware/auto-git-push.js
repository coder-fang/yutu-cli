const { resolve } = require('path')

const { exec, cd } = require('./sh')

const gitPush = async() => {

    /**
     * @description 打包目录
     * @param {String} path
     */
    const path = 'dist'
    const outPath = resolve('./')
    const time = new Date()
    const { argv } = process

    let branch = 'master'
    let text = time

    for (let i = 0; i < argv.length; i++) {
        const item = argv[i]
        const isBranch = /branch=/.test(item)
        if (isBranch) branch = item.replace(/branch=/i, '')
        if (!isBranch && i > 1) text = item
    }
    await cd(path)
    try {
        /**
         * 推送分支代码
         */
        /**
         * package.json
         * 命令auto-git-pull与auto-git-push中配置分支参数
         * branch=分支
         */
        await exec(`git add .`)
        await exec(`git commit -m "${text}"`)
        await exec(`git push origin ${branch}`)
        console.log('git done')
    } catch (error) {
        console.error(error, 'error')
    }
    await cd(outPath)
}

gitPush()