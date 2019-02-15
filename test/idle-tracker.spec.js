const ip = require('ip');

describe('Idle tracker tests', () => {
  const server = `http://${ip.address()}:8080/test`;
  let page;

  before(async () => {
    page = await browser.newPage();
  });

  after(async () => {
    await page.close();
  });

  it('page should become inactive after timeout and reactivate after events', async () => {
    await page.goto(`${server}/test-case-inactive.html`);
    await page.waitFor(1000);
    let isActive = await page.evaluate(() => {
      const el = document.getElementById('active-status');
      return el.innerHTML;
    });
    expect(isActive).to.be('false');
    await page.mouse.move(100, 100);
    await page.waitFor(50);
    isActive = await page.evaluate(() => {
      const el = document.getElementById('active-status');
      return el.innerHTML;
    });
    expect(isActive).to.be('true');
  });
});
