const { teardown: teardownDevServer } = require('jest-dev-server');

module.exports = async function () {
	await globalThis.__BROWSER_GLOBAL__.close();
	await teardownDevServer();
};
