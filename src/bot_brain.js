const api = require("./api");
const issueUtils = require("./issueUtils");
const Issue = require("./models/Issue");
const constants = require("./constants");
const configUtil = require("./config");
const utils = require('./utils')
const labelUtils = require('./labelUtils')

module.exports = class BotBrain {
    constructor(context, config) {
        this.context = context;
        this.config = config;
    }

    static async buildFromConfig(context) {
        const config = await configUtil.getConfig(context);
        return new BotBrain(context, config);
    }

    async validateIssue() {
        const userIssueBody = this.context.payload.issue.body;

        let issueFilesJSON = await api.getContent(
            this.context,
            constants.GITHUB_ISSUES_FOLDER_PATH
        );
        if (!issueFilesJSON) {
            //The github ISSUE TEMPLATE folder doesn't exist
            //look for the second option
            return; //temp
        }

        let issuesTemplates = await issueUtils.getIssuesTemplates(issueFilesJSON);

        if (Object.keys(issuesTemplates).length > 0) {
            //     //iterate on all of the issue templates of the repository and try to find a match to the opened issue
            //     //in case there is no issue template with the same form of the user opened issue, the bot will close the issue and
            //     //will post a comment with the reason
            let missingHeaders = {};
            let isMatchingTemplate = false;
            for (let templateName in issuesTemplates) {
                let templateContent = issuesTemplates[templateName];
                let missingHeadersInTemplate = issueUtils.compareIssueToTemplate(
                    userIssueBody,
                    templateContent
                );

                if (missingHeadersInTemplate == undefined) {
                    continue;
                }

                if (utils.compareContent(userIssueBody, templateContent)) {
                    //the user didn't change the template at all
                    api.createComment(this.context, "Hi there, thanks for the issue, but it seem that this issue is just the default template. Please create a new issue with the template filled out.")
                    api.closeIssue(this.context)
                }

                if (missingHeadersInTemplate.length == 0) {
                    //the user issue matches the issue template
                    this.context.log("This issue follows the template structure");
                    isMatchingTemplate = true;
                    break;
                }
                missingHeaders[templateName] = missingHeadersInTemplate;
            }

            if (!isMatchingTemplate) {
                this.context.log("The user's issue didn't match any issue template");
                //the user's issus is missing some headers. Show message to the user and close the issue
                let commentBody =
                    constants.CLOSE_SAME_TEMPLATE_ISSUE_COMMENT;

                commentBody += issueUtils.formatMissingHeadersToString(missingHeaders);

                // Post a comment on the issue
                api.createComment(this.context, commentBody);

                //Close the issue
                api.closeIssue(this.context);
            }
        }
    }

    async checkForAgingIssues() {
        if (this.config) {
            //get all the issues
            const issuesJson = await api.listIssuesForRepo(this.context);
            const issues = issuesJson.map(issueJson => {
                return new Issue(issueJson);
            });

            //iterate on each one of them and find old issues
            issues.forEach(issue => {
                if (
                    issueUtils.isAgingIssue(
                        this.config[constants.AGING_ISSUE_FIELDS.AGING_TIME],
                        issue
                    )
                ) {
                    if (
                        this.config[
                            constants.AGING_ISSUE_FIELDS.ENABLE_LABELING_AGING_ISSUE
                        ]
                    ) {
                        labelUtils.ensureLabelExists(this.context, constants.AGING_LABEL_NAME)
                        //label the issue as obsolete
                        api.addLabel(this.context, constants.AGING_LABEL_NAME, issue.number)
                    }
                    if (
                        this.config[constants.AGING_ISSUE_FIELDS.ENABLE_CLOSING_AGING_ISSUE]
                    ) {
                        //close the issue
                        api.createComment(this.context, constants.CLOSE_AGING_ISSUE_COMMENT, issue.number)
                        api.closeIssue(this.context, issue.number).catch((e) => console.log(e))
                    }
                }
            });
        }
    }
};