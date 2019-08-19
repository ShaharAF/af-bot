async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function compareContent(content, otherContent) {
    content = content.replace(/(\r\n|\n|\r)/gm, "\n");
    otherContent = otherContent.replace(/(\r\n|\n|\r)/gm, "\n");
    return content == otherContent
}

module.exports = {
    asyncForEach,
    compareContent
}