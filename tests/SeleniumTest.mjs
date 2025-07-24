import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

// Get the argument (default to 'local' if not provided)
const environment = process.argv[2] || 'local';

// URLs based on environment
// Obtain dev selenium server IP using: docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' selenium-server
const seleniumUrl = environment === 'github' 
  ? 'http://selenium:4444/wd/hub' 
  : 'http://localhost:4444/wd/hub';

// Note: Start the nodejs server before running the test locally
const serverUrl = environment === 'github' 
  ? 'http://testserver:3000' 
  : 'http://host.docker.internal:3000';

console.log(`Running tests in '${environment}' environment`);
console.log(`Selenium URL: ${seleniumUrl}`);
console.log(`Server URL: ${serverUrl}`);

(async function testTimestamp() {

    console.log("before driver init")

    // Initialize the WebDriver with Chrome
    const driver = environment === 'github' 
        ? await new Builder()
        .forBrowser('chrome')
        .usingServer(seleniumUrl) // Specify the Selenium server
        .build()
        : await new Builder()
        .forBrowser('chrome')
        .usingServer(seleniumUrl) // Specify the Selenium server
        .build();


    try {
        console.log("after driver init");
        
        await driver.get(serverUrl);
        console.log("after driver.get serverUrl");

        // Locate the input box and enter a value
        const inputField = await driver.findElement(By.id('userInput'));
        await inputField.sendKeys('hi'); // Change this to test valid/invalid values

        // Submit the form
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();

        // Wait for the response - assume server sends back a plain message
        const result = await driver.wait(
            until.elementLocated(By.css('body')), // Response could replace body
            5000
        );

        const resultText = await result.getText();
        console.log("Result from /check:", resultText);

        // Validate response
        assert.ok(resultText.includes('You submitted: hi'), 'Response did not include expected message');

        console.log("Validation passed.");

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await driver.quit();
    }
})();
