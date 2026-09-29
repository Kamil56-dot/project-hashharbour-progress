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

  const viewports = [
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1920, height: 1080, name: '1920x1080' }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

    // 1. CAPTURE LIGHT THEME
    await page.goto('http://localhost:5173/container-composite-preview', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('hh_theme', 'light');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    const scrollInfoLight = await page.evaluate(() => ({
      viewportH: window.innerHeight,
      bodyScrollH: document.documentElement.scrollHeight,
      needsScroll: document.documentElement.scrollHeight > window.innerHeight
    }));
    console.log(`[${vp.name} Light]`, scrollInfoLight);

    const lightPath = path.join(screenshotsDir, `container-composite-${vp.name}-light.png`);
    await page.screenshot({ path: lightPath, fullPage: false });
    console.log('Saved:', lightPath);

    // 2. CAPTURE DARK THEME
    await page.evaluate(() => {
      localStorage.setItem('hh_theme', 'dark');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    const scrollInfoDark = await page.evaluate(() => ({
      viewportH: window.innerHeight,
      bodyScrollH: document.documentElement.scrollHeight,
      needsScroll: document.documentElement.scrollHeight > window.innerHeight
    }));
    console.log(`[${vp.name} Dark]`, scrollInfoDark);

    const darkPath = path.join(screenshotsDir, `container-composite-${vp.name}-dark.png`);
    await page.screenshot({ path: darkPath, fullPage: false });
    console.log('Saved:', darkPath);

    await page.close();
  }

  await browser.close();
  console.log('All screenshots verified and captured successfully!');
})();
