/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

const App = require("./bot_brain");

module.exports = bot => {
    // Your code here
    bot.log('Yay, the app was loaded!')

    bot.on("issues.opened", async context => {
        const app = getAppFromContext(context);
        console.log("issue opened");
        await app.validateIssue();
    });

    function getAppFromContext(context) {
        return new App(context);
    }
}