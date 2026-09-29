import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const outDir = path.resolve(__dirname, '../../screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const page = await browser.newPage();

  // 1. Desktop Dark
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/container-preview', { waitUntil: 'networkidle0' });
  await page.waitForSelector('img');
  await new Promise(r => setTimeout(r, 600));

  // Ensure dark mode first
  const isCurrentlyLight = await page.evaluate(() => document.documentElement.classList.contains('light'));
  if (isCurrentlyLight) {
    const toggle = await page.$('button[aria-label="Switch to dark theme"]');
    if (toggle) await toggle.click();
    await new Promise(r => setTimeout(r, 400));
  }

  await page.screenshot({ path: path.join(outDir, 'container-preview-desktop-dark.png') });
  console.log('Saved container-preview-desktop-dark.png');

  // 2. Desktop Light
  const lightToggle = await page.$('button[aria-label="Switch to light theme"]');
  if (lightToggle) {
    await lightToggle.click();
    await new Promise(r => setTimeout(r, 400));
  }
  await page.screenshot({ path: path.join(outDir, 'container-preview-desktop-light.png') });
  console.log('Saved container-preview-desktop-light.png');

  // 3. Mobile Dark (390px)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/container-preview', { waitUntil: 'networkidle0' });
  await page.waitForSelector('img');
  await new Promise(r => setTimeout(r, 600));

  // Toggle to dark if needed
  const isMobileLight = await page.evaluate(() => document.documentElement.classList.contains('light'));
  if (isMobileLight) {
    const darkToggle = await page.$('button[aria-label="Switch to dark theme"]');
    if (darkToggle) await darkToggle.click();
    await new Promise(r => setTimeout(r, 400));
  }
  await page.screenshot({ path: path.join(outDir, 'container-preview-mobile-dark.png') });
  console.log('Saved container-preview-mobile-dark.png');

  // 4. Mobile Light (390px)
  const mobileLightToggle = await page.$('button[aria-label="Switch to light theme"]');
  if (mobileLightToggle) {
    await mobileLightToggle.click();
    await new Promise(r => setTimeout(r, 800));
  }
  await page.screenshot({ path: path.join(outDir, 'container-preview-mobile-light.png') });
  console.log('Saved container-preview-mobile-light.png');

  // 5. Test Mobile swipe to Card 2 (Reefer)
  await page.evaluate(() => {
    const dots = document.querySelectorAll('button[aria-label^="Show"]');
    if (dots[1]) dots[1].click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'container-preview-mobile-card2.png') });
  console.log('Saved container-preview-mobile-card2.png');

  // 6. Test Mobile swipe to Card 3 (Oil/Tank)
  await page.evaluate(() => {
    const dots = document.querySelectorAll('button[aria-label^="Show"]');
    if (dots[2]) dots[2].click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'container-preview-mobile-card3.png') });
  console.log('Saved container-preview-mobile-card3.png');

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
