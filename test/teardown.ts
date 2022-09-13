import fs from "fs/promises";
import os from "os";
import path from "path";

//import { teardown as teardownDevServer } from "jest-dev-server";

const dir = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

module.exports = async function (): Promise<void> {
    await (globalThis as any).__BROWSER_GLOBAL__.close();
    await fs.rm(dir, {recursive: true, force: true});
    //await teardownDevServer();
};
