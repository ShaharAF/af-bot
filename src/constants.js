module.exports = Object.freeze({
    GITHUB_ISSUES_FOLDER_PATH: ".github/ISSUE_TEMPLATE/",
    CONFIG_PATH: ".github",
    CONFIG_FILE_NAME: "bot_config.yaml",

    AGING_ISSUE_FIELDS: {
        ENABLE_CLOSING_AGING_ISSUE: "enableClosingAgingIssue",
        ENABLE_LABELING_AGING_ISSUE: "enableLabelingAgingIssue",
        AGING_TIME: "agingTime"
    },

    CLOSE_AGING_ISSUE_COMMENT: "This issue will be auto-closed because there hasn't been any activity for a while. Feel free to open a new one if you still experience this problem",
    CLOSE_SAME_TEMPLATE_ISSUE_COMMENT: "Your issue didn't follow one of our issues templates. In order to successfully submit your issue you're required to follow one of our templates\n",
    AGING_LABEL_COLOR: "a72693",
    AGING_LABEL_NAME: "Stale:hourglass:",
    AGING_LABEL_DESCRIPTION: "This label indicates that the issue was inactive for a long period of time"
})