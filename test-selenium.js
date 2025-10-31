const {Builder, By, until, Browser} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

let options = new chrome.Options();
options.addArguments( '--no-sandbox', '--disable-dev-shm-usage');

// Use CHROME_BIN env variable if set (for CI robustness)
if (process.env.CHROME_BIN) {
    options.setChromeBinaryPath(process.env.CHROME_BIN);
}

// Helper function for demo pauses
async function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    let driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();

    try {
        console.log(' Starting Selenium Tests \n');
        await pause(1500);

        // ===== TEST 1: Page Load Test =====
        console.log('Test 1: Checking if page loads correctly...');
        await driver.get('http://localhost:8080');
        await pause(1500);

        let title = await driver.getTitle();
        assert.strictEqual(title, 'Task Manager - Selenium Demo');
        console.log('✓ Page loaded successfully - Title: "' + title + '"\n');
        await pause(1000);

        await driver.wait(until.elementLocated(By.id('app')), 6000);

        // ===== TEST 2: Add Task Test =====
        console.log('Test 2: Testing task addition...');
        await pause(1000);

        let taskInput = await driver.findElement(By.css('[data-testid="task-input"]'));
        let addButton = await driver.findElement(By.css('[data-testid="add-btn"]'));
        await pause(1500);

        const firstTask = 'Learn Selenium with JavaScript';
        for (let char of firstTask) {
            await taskInput.sendKeys(char);
            await pause(100);
        }
        await pause(1000);

        await addButton.click();
        console.log('✓ Clicked Add Task button\n');
        await pause(1000); // <== Key! Give the UI time to update before waiting for message

        // ===== TEST 3: Success Message Test =====
        console.log('Test 3: Verifying success message appears...');
        await pause(250);

        // Increased overall wait for element to 6s
        let successMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="success-message"]')),
            6000,
            "Success message '[data-testid=\"success-message\"]' did not appear within timeout."
        );

        let messageText = await successMessage.getText();
        assert.strictEqual(messageText.trim(), '✓ Task added successfully!');
        console.log(`✓ Success message displayed: "${messageText.trim()}"\n`);
        await pause(5500);

        // ...continue with the rest of your test code as before...

        console.log('=====================================');
        console.log('✅ All Tests Passed Successfully!');
        console.log('=====================================');

    } catch (error) {
        console.error('\n❌ TEST FAILED ❌');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await driver.quit();
        console.log('🔚 Browser closed. Tests completed.');
    }
}

runTests();
