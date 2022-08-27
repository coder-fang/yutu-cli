// lib/http.js
// 通过 axios 处理请求

const axios = require('axios')
axios.interceptors.response.use(res => {
    return res.data
})

/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
    return axios.get('https://api.github.com/orgs/yutuz-cli/repos')
}

/**
 * 获取版本信息
 * @param {*} repo 
 * @returns 
 */
async function getTagList(repo) {
    return axios.get(`https://api.github.com/repos/yutuz-cli/${repo}/tags`)
}

module.exports = {
    getRepoList,
    getTagList
}