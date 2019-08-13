async function getContent(context, issue, path) {
    try {
        const resp = await context.github.repos.getContents({
            owner: issue.owner,
            repo: issue.repo,
            path: path
        });
        return resp['data'];
    } catch (err) {
        return
    }
}

function getIssue(context) {
    return context.repo({
        issue_number: context.issue().number
    });
}

async function closeIssue(context) {
    const params = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        number: context.payload.issue.number
    }
    await context.github.issues.edit({
        ...params,
        state: 'closed'
    })
}

async function createComment(context, comment) {
    const params = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        number: context.payload.issue.number
    }

    context.log('Adding a comment to the issue')
    context.log(comment)

    await context.github.issues.createComment({
        body: comment,
        ...params
    });
}

module.exports = {
    getContent,
    getIssue,
    closeIssue,
    createComment
}