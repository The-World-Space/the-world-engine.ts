import { mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import puppeteer from "puppeteer";
//import { setup as setupDevServer } from "jest-dev-server";

const dir = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

export default async function (): Promise<void> {
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
    (globalThis as any).__BROWSER_GLOBAL__ = browser;

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "wsEndpoint"), browser.wsEndpoint());
}
