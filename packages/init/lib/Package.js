const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const npminstall = require('npminstall')
const log = require('./log')
const npm = require('./npm')
const formatPath = require('./formatPath')
const { throws } = require('assert')

const useOriginNpm = false;
/**
 * Package 类，用于管理动态下载的库文件
 */
class Package {
    constructor(options) {
        log.verbose('options', options)
        this.targetPath = options.targetPath
        this.storePath = options.storePath
        this.packageName = options.name;
        this.packageVersion = options.versions;
        this.npmFilePathPrefix = this.packageName.replace('/', '_')
    }
    get npmFilePath() {
        return path.resolve(this.storePath, `_${this.npmFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
    }
    async prepare() {
        if (!fs.existsSync(this.targetPath)) {
            fse.mkdirpSync(this.targetPath)
        }
        if (!fs.existsSync(this.storePath)) {
            fse.mkdirSync(this.storePath)
        }
        log.verbose(this.targetPath)
        log.verbose(this.storePath)
        const latestVersion = await npm.getLatestVersion(this.packageName)
        log.verbose('latestVersion', this.packageName, latestVersion)
        if (latestVersion) {
            this.packageVersion = latestVersion
        }
    }
    async install() {
        await this.prepare()
        return npminstall({
            root: this.targetPath,
            storeDir: this.storePath,
            registry: npm.getNpmRegistry(useOriginNpm),
            pkgs: [{
                name: this.packageName,
                version: this.packageVersion
            }]
        })
    }
    async exists() {
        await this.prepare()
        return fs.existsSync(this.npmFilePath)
    }
    getPackage(isOriginal = false) {
        if (!isOriginal) {
            return fse.readJsonSync(path.resolve(this.npmFilePath, 'package.json'))
        }
        return fse.readJsonSync(path.resolve(this.storePath, 'package.json'))
    }
    getRootFilePath(isOriginal = false) {

    }
}