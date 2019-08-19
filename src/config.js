const yaml = require('js-yaml')

const constants = require('./constants')
const api = require('./api')
const issueUtils = require('./issueUtils')

async function getConfig(context) {
    const resp = await api.getContent(context, `${constants.CONFIG_PATH}/${constants.CONFIG_FILE_NAME}`)
    //decrypt the content
    const content = await issueUtils.getDecryptedContent(resp.url)
    // console.log(content)

    try {
        let doc = yaml.safeLoad(content)
        console.log(`Config:\n${JSON.stringify(doc)}`)
        return doc
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getConfig
}