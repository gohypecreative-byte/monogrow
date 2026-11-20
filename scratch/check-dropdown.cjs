const {chromium}=require('C:/Users/kshit/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({executablePath:'C:/Users/kshit/.cache/puppeteer/chrome/win64-156.0.8078.47/chrome-win64/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://localhost:3000',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(1600);
const select=page.locator('#calculator select').first();
await select.scrollIntoViewIfNeeded();
await select.click();
await page.waitForTimeout(300);
await page.screenshot({path:'scratch/dropdown.png'});
console.log('Picker style:',await select.evaluate(el=>({appearance:getComputedStyle(el).appearance,background:getComputedStyle(el,'::picker(select)').backgroundColor,open:el.matches(':open')})));
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
console.log('Selected:',await select.inputValue());
console.log('Dropdown count:',await page.locator('#calculator select').count());
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
