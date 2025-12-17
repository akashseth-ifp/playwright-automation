
import { test, expect } from '@playwright/test';

test('Headstart Practice Test - Submit Python Solution', async ({ page }) => {
    // 1. Open the webpage
    await test.step('Navigate to page', async () => {
        await page.goto('https://headstart.infocusp.com/#/practice-test');
        await page.waitForLoadState('networkidle');
        console.log('Page loaded');
    });

    // 2. Click on button 'GO FULLSCREEN'
    await test.step('Click GO FULLSCREEN', async () => {
        const fullscreenBtn = page.getByText('GO FULLSCREEN');
        await fullscreenBtn.waitFor({ state: 'visible', timeout: 10000 });
        await fullscreenBtn.click();
        console.log('Clicked Fullscreen');
    });

    // 3. Click on tab 'Programming'
    await test.step('Click Programming Tab', async () => {
        const tab = page.getByText('Programming');
        await tab.waitFor({ state: 'visible' });
        await tab.click();
        console.log('Clicked Programming tab');
    });

    // 4. Select Python language
    await test.step('Select Python', async () => {
        const select = page.locator('.language-options select');
        await select.waitFor({ state: 'attached' });
        // Try selecting by Label first, then by value used in catch because we want to be robust
        await select.selectOption({ label: 'python3' }).catch(() => select.selectOption({ value: 'python' }));
        console.log('Selected Python');
    });

    // 5. Enter Code
    await test.step('Enter Code', async () => {
        const editorContainer = page.locator('.editor-container');
        await editorContainer.click();

        // Clean the editor
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');

        // Enter code
        await page.keyboard.insertText('n = int(input())');
        await page.keyboard.press('Enter');
        await page.keyboard.insertText('print(n*(n + 1)//2)');

        console.log('Entered code');
    });

    // 6. Click Submit
    await test.step('Click Submit', async () => {
        await page.getByText('Submit').click();
        console.log('Clicked Submit');
    });

    // 7. Wait for result
    await test.step('Wait for Result', async () => {
        const resultDiv = page.locator('.result-div');
        const resultTable = resultDiv.locator('table');

        // Wait for the result div to be visible
        await expect(resultDiv).toBeVisible({ timeout: 15000 });

        // Wait for result table to be visible
        await expect(resultTable).toBeVisible({ timeout: 10000 });

        // Identify data rows (ignoring header) by looking for text pattern like "Input #"
        // This makes sure we are looking at the actual data
        const dataRows = resultTable.locator('tr').filter({ hasText: /Input #/ });

        // Wait for at least one data row to appear
        await expect(dataRows.first()).toBeVisible({ timeout: 15000 });

        // Wait for the first row's result column (2nd column) to be populated (not empty)
        // Adjust column index if needed, assuming 2nd column is Result
        const firstResultCell = dataRows.first().locator('th').nth(2);
        await expect(firstResultCell).not.toBeEmpty({ timeout: 20000 });

        // Wait for the last row's result column as well to ensure *full* table population
        // This addresses the user's request to wait for the full table
        const lastResultCell = dataRows.last().locator('th').nth(2);
        await expect(lastResultCell).not.toBeEmpty({ timeout: 20000 });

        // Scroll into view
        await resultDiv.scrollIntoViewIfNeeded();

        console.log('Result populated and visible');
    });

    // 8. Screenshot
    await test.step('Take Screenshot', async () => {
        // Wait a bit for any animations to settle
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'headstart-result.png', fullPage: true });
        console.log('Screenshot taken');
    });
});
