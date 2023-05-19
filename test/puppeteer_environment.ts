import type { JestEnvironmentConfig } from "@jest/environment";
import type { EnvironmentContext } from "@jest/environment";
import { readFile } from "fs/promises";
import NodeEnvironment from "jest-environment-node";
import os from "os";
import path from "path";
import puppeteer from "puppeteer";
import type { Context } from "vm";

const dir = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

class PuppeteerEnvironment extends NodeEnvironment {
    public constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
        super(config, context);
    }

    public override async setup(): Promise<void> {
        await super.setup();
        // get the wsEndpoint
        const wsEndpoint = await readFile(path.join(dir, "wsEndpoint"), "utf8");
        if (!wsEndpoint) {
            throw new Error("wsEndpoint not found");
        }

        // connect to puppeteer
        this.global.__BROWSER_GLOBAL__ = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint
        });
    }

    public override async teardown(): Promise<void> {
        await super.teardown();

        // disconnect puppeteer
        await (this.global.__BROWSER_GLOBAL__ as any).disconnect();
    }

    public override getVmContext(): Context|null {
        return super.getVmContext();
    }
}

export default PuppeteerEnvironment;
