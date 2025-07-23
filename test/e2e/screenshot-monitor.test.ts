import fs from 'fs/promises';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { Builder, WebDriver } from "selenium-webdriver";
import { ProcMonitor } from "../../src";

describe("E2E Screenshot Monitor Tests", () => {
    let driver: WebDriver | null = null;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver?.quit();
    });

    it("should take a screenshot on demand", async () => {
        const procmonitor = new ProcMonitor(driver!, {
            interval: 1000,
            dir: "./test/screenshots",
            filename: "test_screenshot_%date%__%idx%",
            onSaveHTMLBeforeGet: true
        });
        procmonitor.monitor();

        await driver?.get("https://google.com");
        await new Promise(resolve => setTimeout(resolve, 2000));
        await driver?.get("https://google.com");
        await new Promise(resolve => setTimeout(resolve, 2000));
    });

    it("check if screenshot directory is created", async () => {
        const stat = await fs.stat(process.cwd() + "/test/screenshots");
        expect(stat.isDirectory()).toBe(true);
    });

    it("check if screenshot file is created", async () => {
        const files = await fs.readdir(process.cwd() + "/test/screenshots");
        expect(files.length).toBeGreaterThan(0);
        expect(files.some(file => file.startsWith("test_screenshot_"))).toBe(true);
    });
});