const api = require('./api')
const constants = require('./constants')

async function ensureLabelExists(context, labelName) {
    api.getLabel(context, labelName).catch(() => {
        //label not found, create new label
        api.createLabel(context, labelName, constants.AGING_LABEL_COLOR, constants.AGING_LABEL_DESCRIPTION).catch((e) => {})
    })
}

module.exports = {
    ensureLabelExists
}