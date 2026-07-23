import { ChainablePromiseElement } from 'webdriverio';
import Page from "./page.js";

class HomePage extends Page {
  public get header() {
    return $("header");
  }
  public get main() {
    return $("main");
  }
  public get h1() {
    return $("h1");
  }
  public get signUpBtn() {
    return $('header a[href*="/sign-up"]');
  }
  public get pricingLink() {
    return this.header.$("button*=Pricing");
  }
  public get voiceApiLink() {
    return $('a[href*="voice-api"]');
  }
  public get cookieBanner() {
    return $("#onetrust-banner-sdk");
  }
  public get acceptCookiesBtn() {
    return $("#onetrust-accept-btn-handler");
  }
  public get footer() {
    return $("footer");
  }
  public get termsLink() {
    return $('footer a[href*="/terms-and-conditions"]');
  }
  public get loginLink() {
    return this.header.$('a[href*="portal.telnyx.com"]');
  }
  public get talkToExpertBtns() {
    return $$('a[href*="contact-us"]');
  }
  public get ourNetworkLink() {
    return this.footer.$('a[href*="/our-network"]');
  }
  public get linkedInBtn() {
    return this.footer.$('a[href*="linkedin.com"]');
  }
  public get xBtn() {
    return this.footer.$('a[href*="x.com"]');
  }
  public get facebookBtn() {
    return this.footer.$('a[href*="facebook.com"]');
  }
  public get notFoundHeading() {
    return $("h1");
  }
  public get pricingToggleBtn() {
    return $("*=Annual");
  }
  public get priceCards() {
    return $$("h3");
  }
  public get articleLink() {
    return $('a[href^="/resources/"]');
  }

  public open() {
    return super.open("");
  }

  public async acceptCookies() {
    const isDisplayed = await this.cookieBanner
      .isDisplayed()
      .catch(() => false);
    if (isDisplayed) {
      await this.acceptCookiesBtn.click();
      await this.cookieBanner
        .waitForDisplayed({ reverse: true })
        .catch(() => {});
    }
  }

  public async safeClick(element: ChainablePromiseElement) {
    const el = await element;
    await el.scrollIntoView({ block: "center", inline: "center" });
    await el.waitForClickable();
    await el.click();
  }

  public async safeClickVisible(elementsPromise: ReturnType<typeof $$>) {
    const elements = await elementsPromise;
    for (const el of elements) {
      if (await el.isDisplayed()) {
        await el.scrollIntoView({ block: "center", inline: "center" });
        await el.waitForClickable();
        await el.click();
        return;
      }
    }
    throw new Error("No visible element found to click");
  }
}
export default new HomePage();