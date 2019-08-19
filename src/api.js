async function getContent(context, path) {
    try {
        const resp = await context.github.repos.getContents({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            path: path
        });
        return resp['data'];
    } catch (err) {
        return err
    }
}

async function closeIssue(context, issue_number) {
    const params = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: issue_number || context.payload.issue.number
    }

    console.log(context.github.issues.edit)
    await context.github.issues.update({
        ...params,
        state: 'closed'
    })
}

async function createComment(context, comment, issue_number) {
    const params = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: issue_number || context.payload.issue.number
    }

    context.log('Adding a comment to the issue')
    context.log(comment)

    await context.github.issues.createComment({
        body: comment,
        ...params
    });
}

async function listIssuesForRepo(context) {
    const params = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name
    }

    const res = await context.github.issues.listForRepo(params)
    return res.data
}

async function addLabel(context, label, number) {
    const params = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: number,
        labels: [label]
    }

    context.log(`Adding the label ${label} to the issue`)

    await context.github.issues.addLabels(params)
}

async function getLabel(context, labelName) {
    const params = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        name: labelName
    }

    await context.github.issues.getLabel(params)
}

async function createLabel(context, labelName, labelColor, description) {
    const params = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        name: labelName,
        color: labelColor,
        description: description
    }

    await context.github.issues.createLabel(params)
}

module.exports = {
    getContent,
    closeIssue,
    createComment,
    listIssuesForRepo,
    addLabel,
    getLabel,
    createLabel
}