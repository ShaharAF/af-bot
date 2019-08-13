const api = require('./api')
const issueUtils = require('./issueUtils')

const GITHUB_ISSUES_FOLDER_PATH = ".github/ISSUE_TEMPLATE/"

module.exports = class BotBrain {
    constructor(context) {
        this.context = context
    }

    async validateIssue() {
        const userIssueBody = this.context.payload.issue.body
        const issue = api.getIssue(this.context);

        let issueFilesJSON = await api.getContent(this.context, issue, GITHUB_ISSUES_FOLDER_PATH)
        if (!issueFilesJSON) {
            //The github ISSUE TEMPLATE folder doesn't exist
            //look for the second option
            return //temp
        }

        // console.log(await this.context.github.rateLimit.get())

        let issuesTemplates = await issueUtils.getIssuesTemplates(issueFilesJSON)

        if (Object.keys(issuesTemplates).length > 0) {
            //     //iterate on all of the issue templates of the repository and try to find a match to the opened issue
            //     //in case there is no issue template with the same form of the user opened issue, the bot will close the issue and
            //     //will post a comment with the reason
            let missingHeaders = {}
            let isMatchingTemplate = false
            for (let templateName in issuesTemplates) {
                let templateContent = issuesTemplates[templateName];
                let missingHeadersInTemplate = issueUtils.compareIssueToTemplate(userIssueBody, templateContent);
                console.log(missingHeadersInTemplate)

                if (missingHeadersInTemplate == undefined) {
                    continue
                }

                if (missingHeadersInTemplate.length == 0) {
                    //the user issue matches the issue template
                    isMatchingTemplate = true
                    break
                }
                missingHeaders[templateName] = missingHeadersInTemplate
            }

            if (!isMatchingTemplate) {
                this.context.log("The user's issue didn't match any issue template");
                //the user's issus is missing some headers. Show message to the user and close the issue
                let commentBody =
                    "Your issue didn't follow one of our issues templates. In order to successfully submit your issue you're required to follow one of our templates\n";

                commentBody += issueUtils.formatMissingHeadersToString(missingHeaders)

                // Post a comment on the issue
                api.createComment(this.context, commentBody);

                //Close the issue
                api.closeIssue(this.context)
            }
        }
    }
}