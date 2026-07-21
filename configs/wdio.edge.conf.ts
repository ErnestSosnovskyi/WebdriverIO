import { config as baseConfig } from "./wdio.conf.js";

export const config: WebdriverIO.Config = {
  ...baseConfig,
  maxInstances: 5,
  capabilities: [
    {
      browserName: "MicrosoftEdge",
      "ms:edgeOptions": {
        args: ["--headless", "--disable-gpu", "--window-size=1920,1080"],
      },
    },
  ],
};
