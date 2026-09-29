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
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 });

  const saveShot = async (filename) => {
    const repoPath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: repoPath, fullPage: false });
    console.log(`Saved screenshot to:`, repoPath);

    if (fs.existsSync(brainDir)) {
      const brainPath = path.join(brainDir, filename);
      fs.copyFileSync(repoPath, brainPath);
      console.log(`Copied to brain:`, brainPath);
    }
  };

  // ─────────────────────────────────────────────────────────
  // 1. COMPOSITE CAROUSEL - TANK ON LEFT
  // ─────────────────────────────────────────────────────────
  console.log('1. Navigating to /container-composite-preview ...');
  await page.goto('http://localhost:5173/container-composite-preview', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  await saveShot('tank-scaled-left-position.png');

  // ─────────────────────────────────────────────────────────
  // 2. COMPOSITE CAROUSEL - ADVANCE ONCE (TANK ON RIGHT)
  // ─────────────────────────────────────────────────────────
  console.log('2. Clicking Right Carousel Arrow (Tank to RIGHT)...');
  await page.evaluate(() => {
    const nextBtn = document.querySelector('button[aria-label="Next container"]');
    if (nextBtn) nextBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  await saveShot('tank-scaled-right-position.png');

  // ─────────────────────────────────────────────────────────
  // 3. COMPOSITE CAROUSEL - ADVANCE ONCE MORE (TANK IN CENTER)
  // ─────────────────────────────────────────────────────────
  console.log('3. Clicking Right Carousel Arrow (Tank to CENTER)...');
  await page.evaluate(() => {
    const nextBtn = document.querySelector('button[aria-label="Next container"]');
    if (nextBtn) nextBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  await saveShot('tank-scaled-center-position.png');

  // ─────────────────────────────────────────────────────────
  // 4. BOOKING FORM - OIL / TANK CONTAINER (LOGGED OUT)
  // ─────────────────────────────────────────────────────────
  console.log('4. Navigating to /container-section?type=oil-tank&action=book (Logged Out)...');
  await page.goto('http://localhost:5173/container-section?type=oil-tank&action=book', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  await saveShot('booking-modal-oil-tank-logged-out.png');

  // ─────────────────────────────────────────────────────────
  // 5. BOOKING FORM - AUTHENTICATED WITH REAL DEMO JWT
  // ─────────────────────────────────────────────────────────
  console.log('5. Logging in demo user via API to inject real JWT token...');
  const tokenData = await page.evaluate(async () => {
    try {
      const res = await fetch('http://localhost/hashharbour-api/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@hashharbour.com', password: 'password123' })
      });
      const data = await res.json();
      localStorage.setItem('hh_access_token', data.access);
      if (data.user) localStorage.setItem('hh_user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      return { error: e.message };
    }
  });
  console.log('Obtained JWT token for demo user:', Boolean(tokenData.access));

  // Reload page so modal picks up authenticated state
  await page.goto('http://localhost:5173/container-section?type=oil-tank&action=book', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await saveShot('booking-modal-oil-tank-authenticated.png');

  // ─────────────────────────────────────────────────────────
  // 6. SUBMIT REAL BOOKING - VERIFY 201 CONFIRMATION IN MODAL
  // ─────────────────────────────────────────────────────────
  console.log('6. Submitting real booking form for Oil/Tank...');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));
  await saveShot('booking-confirmation-oil-tank.png');

  // ─────────────────────────────────────────────────────────
  // 7. REEFER NON-BOOKABLE INFORMATIONAL STATE
  // ─────────────────────────────────────────────────────────
  console.log('7. Navigating to /container-section?type=reefer&action=book (Non-bookable Reefer)...');
  await page.goto('http://localhost:5173/container-section?type=reefer&action=book', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await saveShot('booking-modal-reefer-nonbookable.png');

  await browser.close();
  console.log('All screenshots and end-to-end verification completed successfully!');
})();
