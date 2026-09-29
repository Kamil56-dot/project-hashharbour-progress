const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const screenshotsDir = path.resolve(__dirname, '../../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const brainDir = 'C:\\Users\\ARB\\.gemini\\antigravity-ide\\brain\\3dd20820-a094-4b2c-b77a-774c133f7f4b';

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1024, deviceScaleFactor: 1 });

  const saveShot = async (filename) => {
    const repoPath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: repoPath, fullPage: false });
    console.log(`Saved screenshot: ${repoPath}`);
    if (fs.existsSync(brainDir)) {
      const brainPath = path.join(brainDir, filename);
      fs.copyFileSync(repoPath, brainPath);
      console.log(`Copied to brain: ${brainPath}`);
    }
  };

  const getBookBtnText = async () => {
    return await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bookBtn = btns.find(b => b.textContent.includes('Book'));
      return bookBtn ? bookBtn.textContent.trim() : 'NOT_FOUND';
    });
  };

  const clickRightArrow = async () => {
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Next container"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 650));
  };

  // ══════════════════════════════════════════════════════
  // 1. DARK THEME TESTING
  // ══════════════════════════════════════════════════════
  console.log('Testing DARK THEME...');
  await page.goto('http://localhost:5173/container-composite-preview', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.setItem('hh_theme', 'dark'));
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Initial State: Red Center
  let label = await getBookBtnText();
  console.log(`[Dark - Initial] Book button text: "${label}"`);
  await saveShot('carousel-dark-1-initial-red.png');

  // Click Right Arrow -> Reefer Center
  console.log('Clicking Right arrow (advance to Reefer)...');
  await clickRightArrow();
  label = await getBookBtnText();
  console.log(`[Dark - Step 1] Book button text: "${label}"`);
  await saveShot('carousel-dark-2-reefer-center.png');

  // Click Right Arrow -> Oil/Tank Center
  console.log('Clicking Right arrow (advance to Oil/Tank)...');
  await clickRightArrow();
  label = await getBookBtnText();
  console.log(`[Dark - Step 2] Book button text: "${label}"`);
  await saveShot('carousel-dark-3-tank-center.png');

  // ══════════════════════════════════════════════════════
  // 2. LIGHT THEME TESTING (via Real Navbar Toggle)
  // ══════════════════════════════════════════════════════
  console.log('\nTesting LIGHT THEME via real navbar toggle button...');
  // Click real navbar theme toggle
  await page.evaluate(() => {
    const btn = document.querySelector('header button[aria-label*="Switch to light theme"]') ||
                document.querySelector('button[aria-label*="Switch to light theme"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Reset to initial Red Center in Light Theme by clicking pagination dot 0
  await page.evaluate(() => {
    const dots = document.querySelectorAll('div[role="tablist"] button');
    if (dots.length > 0) dots[0].click();
  });
  await new Promise(r => setTimeout(r, 650));

  // Initial State: Red Center (Light)
  label = await getBookBtnText();
  console.log(`[Light - Initial] Book button text: "${label}"`);
  await saveShot('carousel-light-1-initial-red.png');

  // Click Right Arrow -> Reefer Center (Light)
  console.log('Clicking Right arrow in Light theme (advance to Reefer)...');
  await clickRightArrow();
  label = await getBookBtnText();
  console.log(`[Light - Step 1] Book button text: "${label}"`);
  await saveShot('carousel-light-2-reefer-center.png');

  await browser.close();
  console.log('\nCarousel verification completed successfully!');
})();
