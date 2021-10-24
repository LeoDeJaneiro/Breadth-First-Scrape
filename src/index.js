const { createBrowser } = require("./browser");
const { appendDataToCSV } = require("./writeFile");
const {
  extractInfo,
  getIdentifier,
  leafIdentifier,
  columnNames,
  url,
} = require("./partsHandler");

(async function breadthFirstScrape() {
  let browserInstance;
  try {
    browserInstance = await createBrowser();
    const page = await browserInstance.newPage();
    const queue = [url];
    while (queue.length > 0) {
      const currentUrl = queue.shift();
      await page.goto(currentUrl);
      const identifier = getIdentifier(currentUrl);
      if (identifier === leafIdentifier) {
        const data = await extractInfo(page, identifier, currentUrl);
        appendDataToCSV(data, columnNames);
      } else {
        const links = await page.$$eval(identifier, (domNode) =>
          domNode.map((el) => el.href)
        );
        queue.push(...links);
      }
    }
  } catch (error) {
    console.error("breadthFirstScrape: ", error);
  } finally {
    browserInstance?.close();
  }
})();
