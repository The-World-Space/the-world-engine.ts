const NodeEnvironment = require('jest-environment-node').default;

class PuppeteerEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
    }

    async setup() {
        await super.setup();
    }

    async teardown() {
        await super.teardown();
    }

    getVmContext() {
        return super.getVmContext();
    }
}

module.exports = PuppeteerEnvironment;