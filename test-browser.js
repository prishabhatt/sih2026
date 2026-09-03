import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    try {
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
        console.log('Page loaded');
        
        // Find the chatbot button
        const button = await page.$('button[aria-label="Open CORA Chatbot"]');
        if (button) {
            console.log('Clicking chatbot button');
            await button.click();
            
            // Wait a bit for animations and potential errors
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            console.log('Chatbot button not found');
        }
    } catch (e) {
        console.error('Script error:', e);
    } finally {
        await browser.close();
    }
})();
