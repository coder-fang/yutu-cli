"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// lib/Generator.js
var _require = require('./http'),
    getRepoList = _require.getRepoList,
    getTagList = _require.getTagList;

var ora = require('ora');

var inquirer = require('inquirer');

var util = require('util');

var downloadGitRepo = require('download-git-repo'); // 不支持Promise


var path = require('path');

var chalk = require('chalk'); // 添加加载动画 


function wrapLoading(fn, message) {
  var spinner,
      _len,
      args,
      _key,
      result,
      _args = arguments;

  return regeneratorRuntime.async(function wrapLoading$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //  使用ora初始化,传入提示信息message
          spinner = ora(message); // 开始加载动画

          if (message) {
            spinner.start();
          }

          _context.prev = 2;

          for (_len = _args.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = _args[_key];
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(fn.apply(void 0, args));

        case 6:
          result = _context.sent;

          // 状态修改为成功
          if (message) {
            spinner.succeed();
          }

          return _context.abrupt("return", result);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](2);
          // 状态修改为失败
          spinner.fail('Request failed ,refresh ...');

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 11]]);
}

var Generator =
/*#__PURE__*/
function () {
  function Generator(name, targetDir) {
    _classCallCheck(this, Generator);

    // 目录名称
    this.name = name; // 创建位置

    this.targetDir = targetDir; // 对downloadGitRepo 进行promise改造

    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }
  /**
   * 下载远程模板
   * 1. 拼接下载地址
   * 2. 调用下载方法
   */


  _createClass(Generator, [{
    key: "download",
    value: function download(repo, tag) {
      var requestUrl;
      return regeneratorRuntime.async(function download$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // 1. 拼接下载地址
              requestUrl = "yutuz-cli/".concat(repo).concat(tag ? '#' + tag : ''); // 2.调用下载方法

              _context2.next = 3;
              return regeneratorRuntime.awrap(wrapLoading(this.downloadGitRepo, // 远程下载方法
              'waiting download template', // 加载提示信息
              requestUrl, // 参数1：下载地址
              path.resolve(process.cwd(), this.targetDir) // 参数2：创建位置
              ));

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
    /** 获取用户选择的模板
     *  1.从远程拉取模板数据
     *  2.用户选择自己新下载的模板名称
     *  3.return 用户选择的名称 
     */

  }, {
    key: "getRepo",
    value: function getRepo() {
      var repoList, repos, _ref, repo;

      return regeneratorRuntime.async(function getRepo$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(wrapLoading(getRepoList, 'waiting fetch template'));

            case 2:
              repoList = _context3.sent;

              if (repoList) {
                _context3.next = 5;
                break;
              }

              return _context3.abrupt("return");

            case 5:
              // 过滤我们需要的模板名称
              repos = repoList.map(function (item) {
                return item.name;
              }); // 2. 用户选择自己新下载的模板名称

              _context3.next = 8;
              return regeneratorRuntime.awrap(inquirer.prompt({
                name: 'repo',
                type: 'list',
                choices: repos,
                message: 'Please choose a template to create project'
              }));

            case 8:
              _ref = _context3.sent;
              repo = _ref.repo;
              return _context3.abrupt("return", repo);

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
    /**
     * 获取用户选择的版本
     * 1.基于repo结果，远程拉取对应的tag列表
     * 2.用户选择自己需要下载的tag
     * 3.return 用户选择的tag
     */

  }, {
    key: "getTag",
    value: function getTag(repo) {
      var tags, tagsList, _ref2, tag;

      return regeneratorRuntime.async(function getTag$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(wrapLoading(getTagList, 'waiting fetch tag', repo));

            case 2:
              tags = _context4.sent;

              if (tags) {
                _context4.next = 5;
                break;
              }

              return _context4.abrupt("return");

            case 5:
              // 过滤我们需要的 tag 名称
              tagsList = tags.map(function (item) {
                return item.name;
              }); // 2）用户选择自己需要下载的 tag

              _context4.next = 8;
              return regeneratorRuntime.awrap(inquirer.prompt({
                name: 'tag',
                type: 'list',
                choices: tagsList,
                message: 'Place choose a tag to create project'
              }));

            case 8:
              _ref2 = _context4.sent;
              tag = _ref2.tag;
              return _context4.abrupt("return", tag);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
    /**
     * 核心创建逻辑
     * 1. 获取模板名称
     * 2. 获取tag名称
     * 3.下载模板到模板目录
     */

  }, {
    key: "create",
    value: function create() {
      var repo, tag;
      return regeneratorRuntime.async(function create$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(this.getRepo());

            case 2:
              repo = _context5.sent;
              console.log('用户选择了，template:' + repo); // 2.获取tag名称

              _context5.next = 6;
              return regeneratorRuntime.awrap(this.getTag(repo));

            case 6:
              tag = _context5.sent;
              console.log('用户选择了，template:' + repo + ', tag:' + tag); // 3.下载模板到模板目录

              _context5.next = 10;
              return regeneratorRuntime.awrap(this.download(repo, tag));

            case 10:
              // 4. 模板使用提示
              console.log("\r\nSuccessfully created project ".concat(chalk.cyan(this.name)));
              console.log("\r\n  cd ".concat(chalk.cyan(this.name)));
              console.log('  npm run serve\r\n');

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }]);

  return Generator;
}();

module.exports = {
  Generator: Generator,
  wrapLoading: wrapLoading
};