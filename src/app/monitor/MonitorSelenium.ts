import { WebDriver } from 'selenium-webdriver';

abstract class MonitorSelenium {
    protected driver: WebDriver;

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    abstract monitor(): void;
}

export default MonitorSelenium;