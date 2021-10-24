const puppeteer = require("puppeteer");

const createBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.error("@createBrowser", err);
  }
  return browser;
};

module.exports = { createBrowser };
