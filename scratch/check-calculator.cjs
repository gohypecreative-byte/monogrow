const {chromium}=require('C:/Users/kshit/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({executablePath:'C:/Users/kshit/.cache/puppeteer/chrome/win64-156.0.8078.47/chrome-win64/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:3000',{waitUntil:'domcontentloaded'});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(1500);
const section=page.locator('#calculator');
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await section.screenshot({path:'scratch/calculator-desktop.png'});
const preview=section.locator('[data-active="true"]');
const initial=await preview.innerText();
await page.waitForTimeout(5500);
console.log('Auto rotates:', initial!==await preview.innerText());
for(const name of ['Continue to quantity','Continue to delivery','Continue to rates','See my estimate']){
 await section.getByRole('button',{name,exact:true}).click();
 await page.waitForTimeout(350);
}
console.log('Estimate:',await section.getByText('Your estimate is ready',{exact:true}).isVisible());
await section.getByRole('button',{name:'Edit product details'}).click();
for(const width of [1024,390]){
 await page.setViewportSize({width,height:844});
 await section.scrollIntoViewIfNeeded();
 await page.waitForTimeout(400);
 console.log('Viewport',width,await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth})));
 if(width===390)await section.screenshot({path:'scratch/calculator-mobile.png'});
}
console.log('Runtime errors:',errors);
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
