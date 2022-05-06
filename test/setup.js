const puppeteer = require("puppeteer");
const { setup: setupDevServer } = require("jest-dev-server");

module.exports = async function () {
    await setupDevServer({
        command: "npm run start -- --port=20310",
        launchTimeout: 100000,
        port: 20310,
        usedPortAction: "kill"
    });

    const browser = await puppeteer.launch({
        headless: true,
        product: "firefox"
    });
    globalThis.__BROWSER_GLOBAL__ = browser;
};
