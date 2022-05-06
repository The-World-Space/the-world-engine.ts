module.exports = async function () {
  await globalThis.__BROWSER_GLOBAL__.close();
};
