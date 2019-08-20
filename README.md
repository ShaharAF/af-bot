
# af-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that a friendly bot to help you with submitting your issue to AppsFlyer 

<img src="https://massets.appsflyer.com/wp-content/uploads/2016/06/26122512/banner-img-ziv.png">

## Functionalities 
This bot has multiply functionalities:

### Issue template enforcing
You can force the user to follow a given issue template. If the user doesn't follow the template, the bot will alert the user about the missing fields and will close the issue.  

![template enforcing]<docs/missing_template.png>

### Filtering aging issues
The bot can close and label old issues after a predefined amount of time being inactive. 

![aging issue]<docs/aging_issue.png>

## Usage
1.  **[Configure the GitHub App](https://github.com/apps/appsflyerbot)**
2. In order to enable filtering aging issues: Create `.github/bot_config.yml` based on the following template.
3.  The script runs every hour
4.  In order to Enable Issue template enforcing first [open a new issue template]([https://help.github.com/en/articles/creating-issue-templates-for-your-repository](https://help.github.com/en/articles/creating-issue-templates-for-your-repository))
5. Make sure that for each require field you use `##` before. this part is critical for the script

``` 
# Configuration for AppsFlyerBot

# aging issues:

enableClosingAgingIssue: true

enableLabelingAgingIssue: true

#After how long the bot should consider an issue as obsolete (in days)

agingTime: 90
```
## License

[ISC](LICENSE) © 2019 Shahar Cohen <shahar.cohen@appsflyer.com>
