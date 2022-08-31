'use strict';

const fs = require('fs')
const fse = require('fs-extra')
const { log, inquirer, spinner, Package, sleep, exec, formatName, formatName, ejs } = require('@imooc-cli/utils')

async function init() {
    return "Hello from init";
}
module.exports = init;