#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')
const { wrapLoading } = require('./lib/Generator')
const { getRepoList } = require('./lib/http')
const ora = require('ora')

program.name(require('./package.json').commandName);
// 配置提示信息
program
// 监听  --help 执行 
    .on('--help', () => {
            // 使用figlet 绘制 Logo
            const rgb = chalk.rgb(94, 231, 223)
            console.log('\r' + rgb(figlet.textSync('yutu', {
                font: 'speed',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 120,
                whitespaceBreak: true
            })) + chalk.green('欢迎使用 yutuz cli !\n') + chalk.red('                            ♥') + chalk.rgb(238, 0, 238)(` by 杉菜酱~ https://github.com/coder-fang ©${new Date().getFullYear()}`));
            // 新增说明信息
            console.log(`\r\n${chalk.bgBlue("yt")} ${chalk.green(`info`)} ${chalk.cyan(`[Core/cli]`)} @yutuz-cli/core@${require('./package.json').version} `)
            console.log(`\rRun ${chalk.blue(`yt <command> --help`)} for details usage of given command. \r\n`)
})

program
// 定义命令和参数
    .command('create <app-name>')
    .description('create a new project')
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        // 在 create.js 中执行创建任务 
        require('./lib/create.js')(name, options)
    })

program
// 配置版本号信息
    .version(`v${require('./package.json').version}`)
    .usage('<command> [options]')

// 配置config 命令
program
    .command('config [value]')
    .description('inspect and modify the config')
    .option('-g, --get <path>', 'get value from option')
    .option('-s, --set <path> <value>')
    .option('-d, --delete <path>', 'delete option from config')
    .action((value, options) => {
        console.log(value, options);
    })

// 配置ui命令
program
    .command('ui')
    .description('start add open roc-cli ui')
    .option('-p, --port <port>', 'Port used for the UI Server')
    .action((option) => {
        console.log(option);
    })

// 初始化命令行（yt init my_template） 
// program
//     .command('init <template> <app-name>')
//     .description('初始化项目模板')
//     .option('-g, --get <path>', 'get value from option')
//     .option('-s, --set <path> <value>')
//     .option('-d, --delete <path>', 'delete option from config')
//     .action(async(template) => {
//         let message = 'Verifying this templates...'
//         const spinner = ora(message)
//         spinner.start()
//         const repoList = await wrapLoading(getRepoList, null)
//         if (!repoList) return
//         const repos = repoList.map(item => item.name)
//         if(!repos.includes(template)){
//             message = '该项目模板不存在，请输入有效的模板名称！'
//             spinner.fail(chalk.red(message))
//             console.log("\r\nPlease Enter `yt list` to find the names of all valid templates,\r\n\nfrom" + 
//             " which you can select the appropriate project template.\r\n");
//             return;
//         }else {
//             // 下载模板
//             // template
//             message = '项目初始化成功！'
//             spinner.succeed(chalk.blue(message))
//         }
//     })

// 查看所有的可用模板（yt list ）
program
    .command('list')
    .description('查看所有的可用模版')
    .action(async() => {
        let message = 'waiting fetch template...'
        const spinner = ora(message)
        spinner.start()
        const repoList = await wrapLoading(getRepoList,null)
        if (!repoList) return;
        const repos = repoList.map(item => item.name)
        message = '所有的项目模板加载完毕！'
        spinner.succeed(chalk.blue(message))
        for (let key in repos) {
            console.log(repos[key])
        }
    })

    program
    .command('g')
    .description('start add open roc-cli ui')
    .option('-p, --port <port>', 'Port used for the UI Server')
    .action((option) => {
        console.log(option);
    })

program
    .command('*')
    .description('找不到相应的命令')
    .action(() => {
        const message = '找不到相应的命令！'
        const spinner = ora(message)
        spinner.fail(chalk.red(message))
    })

// 解析用户执行命令传入参数
program.parse(process.argv);