const axios = require('axios')
const utils = require('./utils')

//Get the encrypted content of the issue template and decrypt it
async function getDecryptedContent(contentUrl) {
    const res = await axios.get(contentUrl);
    let content = res.data.content;
    return Buffer.from(content, res.data.encoding).toString('utf-8')
}

async function getIssuesTemplates(issueFilesJSON) {
    let issueFiles = {};

    await utils.asyncForEach(issueFilesJSON, async issueFileJSON => {
        const {
            url,
            name
        } = issueFileJSON;
        issueFiles[name] = await getDecryptedContent(url)
    });
    return issueFiles;
}

//Compare the user issue body to the issue template and returns an array of the missing headers
function compareIssueToTemplate(issueBody, template) {
    //Get all the headers of the template and compare them to the issue that was received
    const templateHeaders = getHeadersFromText(template);
    const userIssueHeaders = getHeadersFromText(issueBody);

    if (templateHeaders.length == 0) {
        //signal that this template is not valid
        return undefined
    }
    const missingHeaders = templateHeaders.filter(value => !userIssueHeaders.includes(value))
    return missingHeaders;
}

function getHeadersFromText(text) {
    //get read of all the break lines
    text = text.replace(/(\r\n|\n|\r)/gm, "\n");
    const headers = [];
    text.split("\n").forEach(row => {
        if (row.startsWith("##")) {
            headers.push(row);
        }
    });
    return headers;
}

function formatMissingHeadersToString(missingHeadersDict) {
    let msg = ""
    for (let templateName in missingHeadersDict) {
        let missingHeadersInTemplate = missingHeadersDict[templateName]
        msg += `\n## **Template: ${templateName}**\n
        Missing:\n`

        msg += "\n- " + missingHeadersInTemplate.join("\n- ")
    }

    return msg
}

module.exports = {
    getIssuesTemplates,
    compareIssueToTemplate,
    formatMissingHeadersToString
}