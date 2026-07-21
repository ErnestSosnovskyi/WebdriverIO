import { config as baseConfig } from "./wdio.conf.js";

export const config: WebdriverIO.Config = {
  ...baseConfig,
  maxInstances: 5,
  capabilities: [
    {
      browserName: "firefox",
      acceptInsecureCerts: true,
      "moz:firefoxOptions": {
        args: ["--headless", "--width=1920", "--height=1080"],
      },
    },
  ],
};
