const { expect } = require('@jest/globals');
const puppeteer = require('puppeteer');

describe('E2E Test', () => {
  let browser;
  let page;

  beforeAll(async () => {

    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });
    page = await browser.newPage();
  });

  it('should open google.com', async () => {
    await page.goto('http://localhost:9000');

    const currentUrl = await page.url();

    expect(currentUrl).toMatch('http://localhost:9000');
  });

  afterAll(async () => {

    if(browser) {
      await browser.close();
    }
  });
});