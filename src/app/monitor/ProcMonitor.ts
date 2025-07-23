import fs from 'fs/promises';
import path from 'path';
import { mkdirp } from 'mkdirp';
import { WebDriver } from "selenium-webdriver";
import MonitorSelenium from "./MonitorSelenium";
import utils from '../../lib/utils';

export interface ProcMonitorOptions {
    onScreenshotExit: boolean;
    onScreenshotBeforeGet: boolean;
    onScreenshotBeforeClick: boolean;
    onScreenshotBeforeSubmit: boolean;
    onScreenshotBeforeSendKeys: boolean;
    onSaveHTMLBeforeGet: boolean;
    interval: number;
    dir: string;
    filename: string;
    takeScreenshot?: () => Promise<void>;
    log: (msg: string) => void;
}

export class ProcMonitor extends MonitorSelenium {
    private options: ProcMonitorOptions;
    private isDirCreated: boolean = false;
    private isMonitoring: boolean = false;
    private maxFilenameIndex: number = 0;
    private intervals: NodeJS.Timeout[] = [];

    constructor(driver: WebDriver, options?: Partial<ProcMonitorOptions>) {
        super(driver);

        this.options = {
            // default options
            onScreenshotExit: true,
            onScreenshotBeforeGet: true,
            onScreenshotBeforeClick: false,
            onScreenshotBeforeSubmit: false,
            onScreenshotBeforeSendKeys: false,
            onSaveHTMLBeforeGet: false,
            interval: 0,
            dir: "./screenshots",
            log: console.log,

            // user setted options
            ...options,

            // ensure filename is resolved
            filename: utils.resolveString(options?.filename || "screenshot_%idx%.png"),
        }
    }

    private clearAllIntervals() {
        for (const id of this.intervals)
            clearInterval(id);
        this.intervals = [];
    }

    private getFullFileName(event: string, ext: string): string {
        let file = this.options.filename
            .replace(/%idx%/g, `${this.maxFilenameIndex++}`)
            .replace(/%event%/g, event);
        file += `.${ext}`;
        return path.join(this.options.dir, file);
    }

    public async takeScreenshot(event:string = "unknown") {
        try {
            if (!this.isDirCreated) {
                const _ = await mkdirp(this.options.dir);
                this.isDirCreated = _ !== undefined;
            }

            const file = this.getFullFileName(event, "png");
            const imgData = await this.driver.takeScreenshot();
            await fs.writeFile(file, imgData, 'base64');
        } catch (error) {
            this.options.log(`Error taking screenshot: ${String(error)}`);
        }
    }

    public async saveHTML(event: string = "beforeGet") {
        try {
            const html = await this.driver.executeScript<string>("return document.documentElement.outerHTML");
            const file = this.getFullFileName(event, "html");
            await fs.writeFile(file, html);
        } catch (error) {
            this.options.log(`Error saving HTML: ${String(error)}`);
        }
    }

    public monitor() {
        if (this.isMonitoring)
            return;

        this.isMonitoring = true;

        if (this.options.interval > 0) {
            const id = setInterval(async () => {
                this.options.log(`Taking screenshot at 'interval' at ${new Date().toISOString()}`);
                await this.takeScreenshot('interval');
            }, this.options.interval);

            this.intervals.push(id);
        }

        const originalQuit = this.driver.quit.bind(this.driver);
        this.driver.quit = async () => {
            this.clearAllIntervals();
            if (this.options.onScreenshotExit) {
                this.options.log(`Taking screenshot on exit`);
                await this.takeScreenshot('exit');
            }
            return originalQuit();
        }

        const originalGet = this.driver.get.bind(this.driver);
        this.driver.get = async (url: string) => {
            if (this.options.onScreenshotBeforeGet) {
                this.options.log(`Taking screenshot before navigating to ${url}`);
                await this.takeScreenshot('beforeGet');
            }

            if (this.options.onSaveHTMLBeforeGet)
                await this.saveHTML();
            return originalGet(url);
        }

        if (this.options.onScreenshotBeforeClick || this.options.onScreenshotBeforeSubmit) {
            const originalFindElement = this.driver.findElement.bind(this.driver);

            this.driver.findElement = (async (...args: Parameters<typeof originalFindElement>) => {
                const element = await originalFindElement(...args);

                if (this.options.onScreenshotBeforeClick) {
                    const originalClick = element.click.bind(element);
                    element.click = async () => {
                        this.options.log(`Taking screenshot before click`);
                        await this.takeScreenshot('beforeClick');
                        return originalClick();
                    }
                }

                if (this.options.onScreenshotBeforeSubmit) {
                    const originalSubmit = element.submit.bind(element);
                    element.submit = async () => {
                        this.options.log(`Taking screenshot before submit`);
                        await this.takeScreenshot('beforeSubmit');
                        return originalSubmit();
                    }
                }

                if (this.options.onScreenshotBeforeSendKeys) {
                    const originalSendKeys = element.sendKeys.bind(element);
                    element.sendKeys = async (...sendKeysArgs: Parameters<typeof originalSendKeys>) => {
                        this.options.log(`Taking screenshot before sending keys`);
                        await this.takeScreenshot('beforeSendKeys');
                        return originalSendKeys(...sendKeysArgs);
                    }
                }

                return element;
            }) as typeof this.driver.findElement;
        }
    }
}