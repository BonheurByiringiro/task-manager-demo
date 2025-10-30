const {Builder, By, until, Browser} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let options = new chrome.Options();
// Required flags for CI:
options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();


/**
 * Test Suite for Task Manager Vue App
 * Tests covered:
 * 1. Page loads correctly
 * 2. Adding a task
 * 3. Task counter updates
 * 4. Success message appears
 * 5. Adding multiple tasks
 * 6. Deleting a task
 * 7. Form validation (empty input)
 */

// Helper function to add pauses (in milliseconds)
async function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    
    try {
        console.log('🚀 Starting Selenium Tests (Demo Mode - Slower)...\n');
        await pause(1500);

        // ===== TEST 1: Page Load Test =====
        console.log('Test 1: Checking if page loads correctly...');
        await driver.get('http://localhost:8080');
        await pause(2000); // Wait 2 seconds
        
        let title = await driver.getTitle();
        assert.strictEqual(title, 'Task Manager - Selenium Demo');
        console.log('✓ Page loaded successfully');
        console.log(`  Title: "${title}"\n`);
        await pause(1500);

        // Wait for Vue app to mount
        await driver.wait(until.elementLocated(By.id('app')), 5000);
        await pause(1000);

        // ===== TEST 2: Add Task Test =====
        console.log('Test 2: Testing task addition...');
        await pause(1500);
        
        // Find form elements
        let taskInput = await driver.findElement(By.css('[data-testid="task-input"]'));
        let addButton = await driver.findElement(By.css('[data-testid="add-btn"]'));
        await pause(1000);
        
        // Enter a task - type slower for demo
        console.log('  ✓ Typing task slowly...');
        const firstTask = 'Learn Selenium with JavaScript';
        for (let char of firstTask) {
            await taskInput.sendKeys(char);
            await pause(100); // 100ms between each character
        }
        console.log('  ✓ Entered task: "Learn Selenium with JavaScript"');
        await pause(2000); // Pause to see the typed text
        
        // Click add button
        await addButton.click();
        console.log('  ✓ Clicked Add Task button\n');
        await pause(2000);

        // ===== TEST 3: Success Message Test =====
        console.log('Test 3: Verifying success message appears...');
        await pause(1000);
        
        // Wait for success message to appear
        await driver.wait(until.elementLocated(By.css('[data-testid="success-message"]')), 5000);
        let successMessage = await driver.findElement(By.css('[data-testid="success-message"]'));
        let messageText = await successMessage.getText();
        
        assert.strictEqual(messageText, '✓ Task added successfully!');
        console.log(`  ✓ Success message displayed: "${messageText}"\n`);
        await pause(2500); // Wait to see success message before it disappears

        // ===== TEST 4: Task Counter Test =====
        console.log('Test 4: Checking task counter...');
        await pause(1000);
        
        let taskCount = await driver.findElement(By.css('[data-testid="task-count"]'));
        let countText = await taskCount.getText();
        
        assert(countText.includes('1'));
        console.log(`  ✓ ${countText}\n`);
        await pause(2000);

        // ===== TEST 5: Add Multiple Tasks =====
        console.log('Test 5: Adding multiple tasks...');
        await pause(1500);
        
        const tasksToAdd = [
            'Build a Vue application',
            'Write Selenium tests',
            'Present Tech Talk'
        ];
        
        for (let task of tasksToAdd) {
            await pause(1000); // Pause before each new task
            
            taskInput = await driver.findElement(By.css('[data-testid="task-input"]'));
            
            // Type each task character by character for demo effect
            for (let char of task) {
                await taskInput.sendKeys(char);
                await pause(80); // 80ms between characters
            }
            
            await pause(1000); // Pause to see the typed text
            
            addButton = await driver.findElement(By.css('[data-testid="add-btn"]'));
            await addButton.click();
            
            await pause(1500); // Wait for Vue to update
            console.log(`  ✓ Added: "${task}"`);
        }
        
        await pause(2000);
        
        // Verify total count
        taskCount = await driver.findElement(By.css('[data-testid="task-count"]'));
        countText = await taskCount.getText();
        assert(countText.includes('4')); // 1 initial + 3 new tasks
        console.log(`  ✓ Final count: ${countText}\n`);
        await pause(2000);

        // ===== TEST 6: Task Display Test =====
        console.log('Test 6: Verifying tasks are displayed...');
        await pause(1500);
        
        let firstTaskElement = await driver.findElement(By.css('[data-testid="task-0"]'));
        let firstTaskText = await firstTaskElement.getText();
        
        assert(firstTaskText.includes('Learn Selenium with JavaScript'));
        console.log(`  ✓ First task displayed correctly\n`);
        await pause(2000);

        // ===== TEST 7: Delete Task Test =====
        console.log('Test 7: Testing task deletion...');
        await pause(1500);
        
        let deleteButton = await driver.findElement(By.css('[data-testid="delete-btn-0"]'));
        
        // Highlight the delete button area (scroll into view)
        await driver.executeScript("arguments[0].scrollIntoView(true);", deleteButton);
        await pause(1000);
        
        await deleteButton.click();
        console.log('  ✓ Clicked delete button on first task');
        
        // Wait for deletion to complete
        await pause(2000);
        
        // Verify count decreased
        taskCount = await driver.findElement(By.css('[data-testid="task-count"]'));
        countText = await taskCount.getText();
        assert(countText.includes('3'));
        console.log(`  ✓ Task deleted successfully. ${countText}\n`);
        await pause(2000);

        // ===== TEST 8: Form Validation Test =====
        console.log('Test 8: Testing empty form submission...');
        await pause(1500);
        
        taskInput = await driver.findElement(By.css('[data-testid="task-input"]'));
        await taskInput.clear();
        await pause(1000);
        
        addButton = await driver.findElement(By.css('[data-testid="add-btn"]'));
        await addButton.click();
        
        // Count should remain the same
        await pause(1500);
        taskCount = await driver.findElement(By.css('[data-testid="task-count"]'));
        countText = await taskCount.getText();
        assert(countText.includes('3'));
        console.log('  ✓ Empty task prevented, count unchanged\n');
        await pause(2000);

        console.log('=====================================');
        console.log('✅ All Tests Passed Successfully!');
        console.log('=====================================\n');
        await pause(3000); // Final pause before closing

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        console.error(error);
        await pause(5000); // Longer pause on error so you can see what happened
    } finally {
        // Close the browser
        await driver.quit();
        console.log('🔚 Browser closed. Tests completed.');
    }
}

// Run the test suite
runTests();
