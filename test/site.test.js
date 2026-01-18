const puppeteer = require("puppeteer");
const path = require("path");

jest.setTimeout(30000); 

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--single-process"
  ]
});

    page = await browser.newPage();

    const filePath = "file://" + path.resolve(__dirname, "../index.html");
    await page.goto(filePath, { waitUntil: "load" });
});

afterAll(async () => {
    if (browser) await browser.close();
});

describe("Automation tests for Login / Home site", () => {

    test("page title is Login", async () => {
        const title = await page.title();
        expect(title).toBe("Login");
    });

    test("username and password inputs exist", async () => {
        const usernameInput = await page.$("#username");
        const passwordInput = await page.$("#password");
        expect(usernameInput).not.toBeNull();
        expect(passwordInput).not.toBeNull();
    });

    test("register button exists", async () => {
        const button = await page.$("button[onclick='register()']");
        expect(button).not.toBeNull();
    });

    test("login button exists", async () => {
        const button = await page.$("button[onclick='login()']");
        expect(button).not.toBeNull();
    });

    test("register user shows message", async () => {
        // נקה קודם את השדות
        await page.evaluate(() => {
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        });

        await page.type("#username", "testuser");
        await page.type("#password", "1234");
        await page.click("button[onclick='register()']");

        const message = await page.$eval("#message", el => el.innerText);
        expect(message).toContain("Registered");
    });

    test("login redirects to home.html", async () => {
        await Promise.all([
            page.click("button[onclick='login()']"),
            page.waitForNavigation({ waitUntil: "load" })
        ]);
        expect(page.url()).toContain("home.html");
    });

    test("home page shows hello message with username", async () => {
        const text = await page.$eval("#hello", el => el.innerText);
        expect(text).toContain("HELLO testuser");
    });

    test("dark mode button exists and toggles class on login page", async () => {
     
        const filePath = "file://" + path.resolve(__dirname, "../index.html");
        await page.goto(filePath, { waitUntil: "load" });

        const button = await page.$(".toggle-theme");
        expect(button).not.toBeNull();

      
        const initialClass = await page.$eval("body", el => el.className);
        await page.click(".toggle-theme");
        const afterClass = await page.$eval("body", el => el.className);
        expect(afterClass).not.toBe(initialClass);
    });

});