const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const screenshotsDir = path.resolve('../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1024, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:5173/container-composite-preview ...');
  await page.goto('http://localhost:5173/container-composite-preview', { waitUntil: 'networkidle0' });

  // Wait 1.5 seconds for canvas flood fill and render
  await new Promise((r) => setTimeout(r, 1500));

  const isDarkInitial = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log('Initial theme isDark:', isDarkInitial);

  if (isDarkInitial) {
    const darkPath = path.join(screenshotsDir, 'container-composite-desktop-dark.png');
    await page.screenshot({ path: darkPath, fullPage: false });
    console.log('Saved dark screenshot to:', darkPath);

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Theme'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const lightPath = path.join(screenshotsDir, 'container-composite-desktop-light.png');
    await page.screenshot({ path: lightPath, fullPage: false });
    console.log('Saved light screenshot to:', lightPath);
  } else {
    const lightPath = path.join(screenshotsDir, 'container-composite-desktop-light.png');
    await page.screenshot({ path: lightPath, fullPage: false });
    console.log('Saved light screenshot to:', lightPath);

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Theme'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const darkPath = path.join(screenshotsDir, 'container-composite-desktop-dark.png');
    await page.screenshot({ path: darkPath, fullPage: false });
    console.log('Saved dark screenshot to:', darkPath);
  }

  await browser.close();
  console.log('Screenshots captured successfully at 1440x1024!');
})();
