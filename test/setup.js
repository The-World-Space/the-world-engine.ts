const puppeteer = require("puppeteer");

module.exports = async function () {
    const browser = await puppeteer.launch({
        headless: true,
        product: "firefox"
    });
    globalThis.__BROWSER_GLOBAL__ = browser;
};
