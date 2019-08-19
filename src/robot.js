/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

const createScheduler = require('probot-scheduler')
const App = require("./bot_brain");
const Issue = require('./models/Issue')

module.exports = bot => {
    // Your code here
    bot.log('Yay, the app was loaded!')

    createScheduler(bot, {
        delay: false,
        interval: 1000 * 60 * 60
    })

    bot.on("schedule.repository", async (context) => {
        //will be triggered every 50 sec
        const app = await getAppFromContext(context)
        context.log("scheduler activated")

        app.checkForAgingIssues()
    })

    bot.on("issues.opened", async context => {
        const app = await getAppFromContext(context);
        console.log("issue opened");
        await app.validateIssue();
    });

    async function getAppFromContext(context) {
        return await App.buildFromConfig(context);
    }
}