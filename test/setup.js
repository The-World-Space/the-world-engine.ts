const { mkdir, writeFile } = require("fs").promises;
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");

const DIR = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

const { setup: setupDevServer } = require("jest-dev-server");

module.exports = async function () {
    // await setupDevServer({
    //     command: "npm run start -- --port=20310",
    //     launchTimeout: 100000,
    //     port: 20310,
    //     usedPortAction: "kill"
    // });

    const browser = await puppeteer.launch({
        headless: true,
        product: "firefox"
    });
    globalThis.__BROWSER_GLOBAL__ = browser;

    await mkdir(DIR, { recursive: true });
    await writeFile(path.join(DIR, "wsEndpoint"), browser.wsEndpoint());
};
