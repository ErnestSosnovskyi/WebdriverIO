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
    return $('header a[href*="/pricing"]');
  }
  public get voiceApiLink() {
    return $('a[href*="/voice-api"]');
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

  public open() {
    return super.open('');
  }

  public async acceptCookies() {
    if (await this.cookieBanner.isDisplayed()) {
        await this.acceptCookiesBtn.click();
    }
  }
}
export default new HomePage();