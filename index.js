#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

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
    .usage('<command> [option]')

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

// 配置提示信息
program
// 监听  --help 执行 
    .on('--help', () => {

            // 使用figlet 绘制 Logo
            console.log('\r\n' + figlet.textSync('yutu cli', {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 180,
                whitespaceBreak: true
            }));
            // 新增说明信息
            console.log(`\r\nRun ${chalk.blue(`roc <command> --help`)} for details usage of given command. \r\n`)
})

// 解析用户执行命令传入参数
program.parse(process.argv);