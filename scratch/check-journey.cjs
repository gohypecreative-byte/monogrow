const { chromium } = require('C:/Users/kshit/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async () => {
 const browser=await chromium.launch({executablePath:'C:/Users/kshit/.cache/puppeteer/chrome/win64-156.0.8078.47/chrome-win64/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000',{waitUntil:'domcontentloaded',timeout:60000});
 await page.evaluate(()=>document.fonts.ready);
 const root=page.locator('[class*="OriginJourney"][class*="__track"]');
 const stage=page.locator('[class*="OriginJourney"][class*="__stage"]');
 await page.evaluate(()=>{const r=document.querySelector('[class*="OriginJourney"][class*="__track"]');window.scrollTo(0,scrollY+r.getBoundingClientRect().top)});
 await page.waitForTimeout(1800);
 
 await page.getByRole('navigation',{name:'Our sourcing journey'}).getByRole('button',{name:/Verification/}).click();
 await page.waitForTimeout(1400);
 console.log('Desktop selected:',await page.locator('#journey-details [data-current="true"] h3').innerText());
 await stage.screenshot({path:'scratch/journey-desktop.png'});
 await page.getByRole('button',{name:'View details'}).click();
 await page.getByRole('dialog').waitFor({state:'visible'});
 console.log('Dialog visible:',await page.getByRole('dialog').isVisible());
 await page.keyboard.press('Escape');
 console.log('Dialog closed:',!await page.getByRole('dialog').isVisible());
 for(const size of [{width:1000,height:740},{width:390,height:844}]){
  await page.setViewportSize(size); await page.waitForTimeout(500);
  await stage.scrollIntoViewIfNeeded();
  console.log('Layout',size,await page.evaluate(()=>{const e=document.querySelector('[class*="OriginJourney"][class*="__canvas"]');return {overflow:document.documentElement.scrollWidth>innerWidth,contentHeight:e.scrollHeight,panelHeight:e.clientHeight}}));
 }
 await page.getByRole('navigation',{name:'Our sourcing journey'}).getByRole('button',{name:/Dispatch/}).click();
 console.log('Mobile selected:',await page.locator('#journey-details [data-current="true"] h3').innerText());
 await stage.screenshot({path:'scratch/journey-mobile.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(200);
 console.log('Reduced motion scroll:',await root.getAttribute('data-scroll'));
 console.log('Runtime errors:',errors);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
