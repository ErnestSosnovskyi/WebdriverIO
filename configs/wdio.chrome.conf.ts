import { config as baseConfig } from "./wdio.conf.js";

export const config: WebdriverIO.Config = {
  ...baseConfig,
  maxInstances: 5,
  capabilities: [
    {
      browserName: "chrome",
      acceptInsecureCerts: true,
      "goog:chromeOptions": {
        args: [
          "--headless",
          "--disable-gpu",
          "--window-size=1920,1080",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "disable-blink-features=AutomationControlled",
          "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ],
      },
    },
  ],
};
