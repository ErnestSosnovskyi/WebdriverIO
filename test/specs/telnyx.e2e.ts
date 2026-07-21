import HomePage from "../pageobjects/home.page.js";
import SignUpPage from "../pageobjects/signup.page.js";
import ContactPage from "../pageobjects/contact.page.js";
import { testData } from "../data/testData.js";

describe("Telnyx E2E Automation Tests (WDIO Migration)", () => {
  it("TC001 - Checking if the home page has loaded successfully", async () => {
    await HomePage.open();

    await expect(HomePage.header).toBeDisplayed();
    await expect(HomePage.main).toBeDisplayed();

    await HomePage.h1.waitForDisplayed({ timeout: 5000 });
    const h1Text = await HomePage.h1.getText();
    expect(h1Text.length).toBeGreaterThan(0);
  });

  it("TC002 - Checking the transition to the registration page", async () => {
    await HomePage.open();
    await HomePage.signUpBtn.click();

    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.signUp),
    );

    await SignUpPage.form.waitForDisplayed({ timeout: 5000 });
    await expect(SignUpPage.form).toBeDisplayed();
    await expect(SignUpPage.h1).toHaveText(expect.stringContaining("Create your account"));
  });

  it("TC003 - Checking the validation of an empty registration form", async () => {
    await SignUpPage.open();
    await SignUpPage.submitForm();

    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.signUp),
    );
    const errors = await SignUpPage.validationErrors;
    expect(errors.length).toBeGreaterThan(0);
  });

  it("TC004 - Checking if the pricing section opens on the main page", async () => {
    await HomePage.open();
    await HomePage.jsClick(HomePage.pricingLink);

    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.pricing),
    );

    await browser.waitUntil(
      async () => {
        const headers = await $$("h1");
        for (const header of headers) {
          if (await header.isDisplayed()) {
            return true;
          }
        }
        return false;
      },
      {
        timeout: 10000,
        timeoutMsg: "Visible h1 not appearing on Pricing page",
      },
    );
  });

  it("TC005 - Checking access to the Voice API page", async () => {
    await HomePage.open();
    await HomePage.voiceApiLink.scrollIntoView();
    await HomePage.jsClick(HomePage.voiceApiLink);

    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.voiceApi),
    );
  });

  it('TC006 - Testing the "Talk to an expert" button', async () => {
    await browser.url(testData.urls.voiceApi);
    const talkBtn = await $("a=Talk to an expert");
    await HomePage.jsClick(talkBtn);

    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.contactUs),
    );
  });

  it("TC007 - Checking the redirect to the authorization portal", async () => {
    await HomePage.open();
    const loginLink = await HomePage.header.$("a=Log in");

    await expect(loginLink).toHaveAttribute("href", expect.stringContaining(testData.urls.portal));
  });

  it("TC008 - Checking the Cookie Consent Banner", async () => {
    await HomePage.open();

    const isBannerExist = await HomePage.cookieBanner
      .waitForExist({
        timeout: 5000,
        reverse: false,
      })
      .catch(() => false);
    
    if (isBannerExist) {
      await expect(HomePage.cookieBanner).toBeDisplayed();
      await HomePage.acceptCookies();
      await expect(HomePage.cookieBanner).not.toBeDisplayed();
    } else {
      console.log("Cookie banner did not appear in this environment/location.");
    }
  });

  it('TC009 - Checking the "Terms and Conditions of Service" link', async () => {
    await HomePage.open();
    await HomePage.footer.scrollIntoView();
    await expect(HomePage.footer).toBeDisplayed();

    await HomePage.termsLink.click();
    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.terms),
    );
  });

  it("TC010 - Checking for links to social networks", async () => {
    await HomePage.open();
    await HomePage.footer.scrollIntoView();

    const linkedInBtn = await HomePage.footer.$('a[href*="linkedin.com"]');
    const xBtn = await HomePage.footer.$('a[href*="x.com"]');
    const fbBtn = await HomePage.footer.$('a[href*="facebook.com"]');

    await expect(linkedInBtn).toHaveAttribute("target", "_blank");
    await expect(xBtn).toHaveAttribute("target", "_blank");
    await expect(fbBtn).toHaveAttribute("target", "_blank");
  });

  it("TC011 - Contact Us: Checking validation of empty form submission", async () => {
    await ContactPage.open();
    await expect(ContactPage.submitBtn).toBeDisplayed();

    await ContactPage.submitForm();
    await browser.waitUntil(
      async () => {
        const errorsCount = await ContactPage.errorMessages.length;
        return errorsCount > 0;
      },
      { timeout: 5000, timeoutMsg: "No error messages appeared" },
    );
    const finalErrorsCount = await ContactPage.errorMessages.length;
    expect(finalErrorsCount).toBeGreaterThan(0);
  });

  it('TC012 - Contact Us: Interacting with the "How can we help?" dropdown', async () => {
    await ContactPage.open();

    await ContactPage.helpDropdown.selectByVisibleText("Support");

    const selectedValue = await ContactPage.helpDropdown.getValue();
    expect(selectedValue).not.toBe("");
  });

  it("TC013 - Contact Us: Entering an invalid email address", async () => {
    await ContactPage.open();

    await ContactPage.firstNameInput.setValue("Test");
    await ContactPage.lastNameInput.setValue("User");
    await ContactPage.emailInput.setValue("invalid-email-without-at.com");
    await ContactPage.submitForm();

    const errors = await ContactPage.errorMessages;
    expect(errors.length).toBeGreaterThan(0);
  });

 it("TC014 - Footer: Navigating to the Our Network page", async () => {
   await HomePage.open();
   await HomePage.acceptCookies();

   const ourNetwork = await $("footer").$('a[href*="/our-network"]');
   await ourNetwork.scrollIntoView();
   await HomePage.jsClick(ourNetwork);

   await expect(browser).toHaveUrl(expect.stringContaining("/our-network"));

   let visibleH1Text = "";
   await browser.waitUntil(
     async () => {
       const headers = await $$("h1");
       for (const header of headers) {
         if (await header.isDisplayed()) {
           visibleH1Text = await header.getText();
           return true;
         }
       }
       return false;
     },
     {
       timeout: 10000,
       timeoutMsg: "The visible h1 did not appear on the Our Network page",
     },
   );

   expect(visibleH1Text.length).toBeGreaterThan(0);
 });

  it("TC015 - Mobile Viewport: Checking the Hamburger Menu rendering", async () => {
    await browser.setWindowSize(390, 844);

    await HomePage.open();

    const hamburgerBtn = await browser.waitUntil(
      async () => {
        const headerButtons = await $$("header button");
        for (const btn of headerButtons) {
          if (await btn.isDisplayed()) {
            const ariaLabel = (await btn.getAttribute("aria-label")) || "";
            const hasPopup = (await btn.getAttribute("aria-haspopup")) || "";
            if (
              ariaLabel.toLowerCase().includes("menu") ||
              ariaLabel.toLowerCase().includes("navigation") ||
              hasPopup === "dialog" ||
              hasPopup === "true"
            ) {
              return btn;
            }
          }
        }

        const allButtons = await $$("header button, header [role='button']");
        for (const btn of allButtons) {
          if (await btn.isDisplayed()) {
            return btn;
          }
        }
        return null;
      },
      {
        timeout: 10000,
        timeoutMsg:
          "The visible mobile menu button did not appear in the header.",
      },
    );

    await expect(hamburgerBtn).toBeDisplayed();

    await browser.setWindowSize(1920, 1080);
  });

  it("TC016 - Navigation: Checking the transition to the Blog page", async () => {
    await HomePage.open();
    await browser.url("/resources");

    await expect(browser).toHaveUrl(expect.stringContaining("/resources"));
    const articleLink = await $('a[href^="/resources/"]');
    await articleLink.waitForDisplayed({ timeout: 5000 });
    await expect(articleLink).toBeDisplayed();
  });

  it("TC017 - Tabs: Switching to LinkedIn in a new window", async () => {
    await HomePage.open();
    await HomePage.acceptCookies();
    await HomePage.footer.scrollIntoView();

    const linkedInBtn = await HomePage.footer.$('a[href*="linkedin.com"]');
    await linkedInBtn.waitForClickable();
    await linkedInBtn.click();

    const handles = await browser.getWindowHandles();
    expect(handles.length).toBe(2);

    await browser.switchToWindow(handles[1]);
    await expect(browser).toHaveUrl(expect.stringContaining("linkedin.com"));

    await browser.closeWindow();
    await browser.switchToWindow(handles[0]);
  });

  it("TC018 - Routing: Validating the 404 Not Found page", async () => {
    await browser.url("/this-page-definitely-does-not-exist-12345");

    const h1 = await $("h1");
    const text = await h1.getText();

    expect(text.toLowerCase()).toContain("oops, this page doesn’t exist");
  });

  it("TC019 - Cookies storage: Verifying cookie is set after acceptance", async () => {
    await HomePage.open();
    await HomePage.acceptCookies();

    const cookies = await browser.getCookies();
    const optanonCookie = cookies.find(
      (c) => c.name === "OptanonAlertBoxClosed",
    );

    expect(optanonCookie).toBeDefined();
  });

  it("TC020 - Pricing Page: Toggling between Monthly and Annual", async () => {
    await browser.url(testData.urls.pricing);

    const toggleBtn = await $("*=Annual");
    if (await toggleBtn.isExisting()) {
      await HomePage.jsClick(toggleBtn);
      const currentUrl = await browser.getUrl();
      expect(currentUrl).toBeDefined();
    } else {
      const priceCards = await $$("h3");
      expect(priceCards.length).toBeGreaterThan(0);
    }
  });
});
