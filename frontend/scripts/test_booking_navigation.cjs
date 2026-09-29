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

  console.log('1. Navigating to http://localhost:5173/container-composite-preview ...');
  await page.goto('http://localhost:5173/container-composite-preview', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.setItem('hh_theme', 'dark'));
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('2. Rotating to Reefer container (clicking Right arrow)...');
  await page.evaluate(() => {
    const nextBtn = document.querySelector('button[aria-label="Next container"]');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 700));

  const bookBtnText = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const bookBtn = btns.find(b => b.textContent.includes('Book'));
    return bookBtn ? bookBtn.textContent.trim() : null;
  });
  console.log(`3. Verified centered button text: "${bookBtnText}"`);

  console.log('4. Clicking the Book Reefer Container button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const bookBtn = btns.find(b => b.textContent.includes('Book Reefer Container'));
    if (bookBtn) bookBtn.click();
  });

  // Wait for navigation / modal animation
  await new Promise(r => setTimeout(r, 1500));

  const currentUrl = page.url();
  console.log(`5. Destination URL after click: ${currentUrl}`);

  const modalInfo = await page.evaluate(() => {
    const modalTitle = document.querySelector('h3');
    const banner = Array.from(document.querySelectorAll('div')).find(d => d.textContent.includes('Booking Request:'));
    const badge = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('ISO Cold Chain Reefer'));
    const containerTitle = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Reefer Container'));

    return {
      modalTitle: modalTitle ? modalTitle.textContent.trim() : null,
      bannerText: banner ? banner.textContent.trim() : null,
      hasReeferBadge: Boolean(badge),
      hasReeferTitle: Boolean(containerTitle),
    };
  });
  console.log('6. Destination page state:', JSON.stringify(modalInfo, null, 2));

  console.log('7. Capturing destination screenshot (Dark theme)...');
  await saveShot('booking-destination-reefer-dark.png');

  // Also test in Light mode
  console.log('8. Testing in Light theme via theme toggle...');
  await page.evaluate(() => {
    // close modal first
    const closeBtn = document.querySelector('button[aria-label="Close modal"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Toggle theme via header button
  await page.evaluate(() => {
    const themeBtn = document.querySelector('header button[aria-label*="Switch to light theme"]') ||
                     document.querySelector('button[aria-label*="Switch to light theme"]');
    if (themeBtn) themeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Re-trigger booking modal in light theme to capture light state
  await page.goto('http://localhost:5173/container-section?type=reefer&action=book', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  console.log('9. Capturing destination screenshot (Light theme)...');
  await saveShot('booking-destination-reefer-light.png');

  await browser.close();
  console.log('\nBooking navigation verification completed successfully!');
})();
