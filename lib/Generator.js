// lib/Generator.js

const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo') // 不支持Promise
const path = require('path')
const chalk = require('chalk')

// 添加加载动画 
async function wrapLoading(fn, message, ...args) {
    //  使用ora初始化,传入提示信息message
    const spinner = ora(message)
        // 开始加载动画
    if (message) {
        spinner.start()
    }
    try {
        // 执行传入方法 fn
        const result = await fn(...args)
            // 状态修改为成功
        if (message) {
            spinner.succeed()
        }
        return result
    } catch (error) {
        // 状态修改为失败
        spinner.fail('Request failed ,refresh ...')
    }
}

class Generator {
    constructor(name, targetDir) {
        // 目录名称
        this.name = name

        // 创建位置
        this.targetDir = targetDir

        // 对downloadGitRepo 进行promise改造
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    /**
     * 下载远程模板
     * 1. 拼接下载地址
     * 2. 调用下载方法
     */
    async download(repo, tag) {
        // 1. 拼接下载地址
        const requestUrl = `yutuz-cli/${repo}${tag?'#'+ tag:''}`
            // 2.调用下载方法
        await wrapLoading(
            this.downloadGitRepo, // 远程下载方法
            'waiting download template', // 加载提示信息
            requestUrl, // 参数1：下载地址
            path.resolve(process.cwd(), this.targetDir) // 参数2：创建位置
        )
    }

    /** 获取用户选择的模板
     *  1.从远程拉取模板数据
     *  2.用户选择自己新下载的模板名称
     *  3.return 用户选择的名称 
     */
    async getRepo() {
        // 1. 从远程拉取模板数据
        const repoList = await wrapLoading(getRepoList, 'waiting fetch template')
        if (!repoList) return
            // 过滤我们需要的模板名称
        const repos = repoList.map(item => item.name)
            // 2. 用户选择自己新下载的模板名称
        const { repo } = await inquirer.prompt({
                name: 'repo',
                type: 'list',
                choices: repos,
                message: 'Please choose a template to create project'
            })
            // 3. return 用户选择的名称
        return repo
    }

    /**
     * 获取用户选择的版本
     * 1.基于repo结果，远程拉取对应的tag列表
     * 2.用户选择自己需要下载的tag
     * 3.return 用户选择的tag
     */
    async getTag(repo) {
        // 1）基于 repo 结果，远程拉取对应的 tag 列表
        const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
        if (!tags) return;

        // 过滤我们需要的 tag 名称
        const tagsList = tags.map(item => item.name);

        // 2）用户选择自己需要下载的 tag
        const { tag } = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagsList,
            message: 'Place choose a tag to create project'
        })

        // 3）return 用户选择的 tag
        return tag
    }

    /**
     * 核心创建逻辑
     * 1. 获取模板名称
     * 2. 获取tag名称
     * 3.下载模板到模板目录
     */
    async create() {
        // 1. 获取模板名称
        const repo = await this.getRepo()
            // console.log('用户选择了: template:' + repo);
            // 2.获取tag名称
        const tag = await this.getTag(repo)
            // console.log('用户选择了: template:' + repo + ', tag:' + tag);
            // 3.下载模板到模板目录
        await this.download(repo, tag)

        // 4. 模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}.\n `)
        console.log('Now run:\r\n')
        console.log(`\rcd ${chalk.cyan(this.name)} `)
        console.log('npm install\r')
        console.log('npm run serve\r\n')
    }
}

module.exports = { Generator, wrapLoading }