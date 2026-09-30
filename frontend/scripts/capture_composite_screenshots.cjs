const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const screenshotsDir = path.resolve(__dirname, '../../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const brainDir = 'C:\\Users\\ARB\\.gemini\\antigravity-ide\\brain\\28de817b-1a25-48d4-add7-8ad5febf1dfb';

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

  const saveScreenshots = async (themeName) => {
    const filename = `container-composite-desktop-${themeName}.png`;
    const repoPath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: repoPath, fullPage: false });
    console.log(`Saved ${themeName} screenshot to:`, repoPath);

    if (fs.existsSync(brainDir)) {
      const brainPath = path.join(brainDir, filename);
      fs.copyFileSync(repoPath, brainPath);
      console.log(`Copied ${themeName} screenshot to brain:`, brainPath);
    }
  };

  if (isDarkInitial) {
    // 1. Capture Dark theme
    await saveScreenshots('dark');

    // 2. Click real navbar theme toggle to switch to Light
    console.log('Clicking real navbar theme toggle button...');
    const clicked = await page.evaluate(() => {
      const btn = document.querySelector('header button[aria-label*="Switch to light theme"]') ||
                  document.querySelector('header button[aria-label*="theme" i]') ||
                  document.querySelector('button[aria-label*="Switch to light theme"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Navbar toggle clicked:', clicked);
    await new Promise((r) => setTimeout(r, 1000));

    // 3. Capture Light theme
    await saveScreenshots('light');
  } else {
    // 1. Capture Light theme
    await saveScreenshots('light');

    // 2. Click real navbar theme toggle to switch to Dark
    console.log('Clicking real navbar theme toggle button...');
    const clicked = await page.evaluate(() => {
      const btn = document.querySelector('header button[aria-label*="Switch to dark theme"]') ||
                  document.querySelector('header button[aria-label*="theme" i]') ||
                  document.querySelector('button[aria-label*="Switch to dark theme"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Navbar toggle clicked:', clicked);
    await new Promise((r) => setTimeout(r, 1000));

    // 3. Capture Dark theme
    await saveScreenshots('dark');
  }

  await browser.close();
  console.log('Screenshots captured successfully at 1440x1024!');
})();

