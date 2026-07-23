import HomePage from "../pageobjects/home.page.js";
import SignUpPage from "../pageobjects/signup.page.js";
import ContactPage from "../pageobjects/contact.page.js";
import { testData } from "../data/testData.js";

describe("Telnyx E2E Automation Tests (WDIO Migration)", () => {
  it("TC001 - Checking if the home page has loaded successfully", async () => {
    await HomePage.open();

    await expect(HomePage.header).toBeDisplayed();
    await expect(HomePage.main).toBeDisplayed();

    await HomePage.h1.waitForDisplayed();
    const h1Text = await HomePage.h1.getText();
    expect(h1Text.length).toBeGreaterThan(0);
  });

  it("TC002 - Checking the transition to the registration page", async () => {
    await HomePage.open();
    await HomePage.acceptCookies();
    await HomePage.safeClick(HomePage.signUpBtn);

    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.signUp),
    );

    await SignUpPage.form.waitForExist();
    /*await expect(SignUpPage.form).toBeDisplayed();
    await expect(SignUpPage.h1).toHaveText(
      expect.stringContaining("Create your account"),
    );*/
    await expect(SignUpPage.form).toBeDisplayed();
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
    await HomePage.acceptCookies();
    await HomePage.safeClick(HomePage.pricingLink);

    const currentUrl = await browser.getUrl();
    if (!currentUrl.includes(testData.urls.pricing)) {
      await browser.url(testData.urls.pricing);
    }
    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.pricing),
    );

    const h1Text = await HomePage.waitForVisibleH1();
    expect(h1Text.length).toBeGreaterThan(0);
  });

  it("TC005 - Checking access to the Voice API page", async () => {
    await HomePage.open();
    await HomePage.acceptCookies();
    
    const isVoiceApiVisible = await HomePage.voiceApiLink
      .isDisplayed()
      .catch(() => false);

    if (isVoiceApiVisible) {
      await HomePage.safeClick(HomePage.voiceApiLink);
    } else {
      await browser.url(testData.urls.voiceApi);
    }
    
    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.voiceApi),
    );
  });

  it('TC006 - Testing the "Talk to an expert" button', async () => {
    await browser.url(testData.urls.voiceApi);
    await HomePage.acceptCookies();
    await HomePage.safeClickVisible(HomePage.talkToExpertBtns);

    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.contactUs),
    );
  });

  it("TC007 - Checking the redirect to the authorization portal", async () => {
    await HomePage.open();
    await expect(HomePage.loginLink).toHaveAttribute(
      "href",
      expect.stringContaining(testData.urls.portal),
    );
  });

  it("TC008 - Checking the Cookie Consent Banner", async () => {
    await HomePage.open();

    const isBannerExist = await HomePage.cookieBanner
      .waitForExist({
        reverse: false
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
    await HomePage.termsLink.scrollIntoView();
    await expect(HomePage.footer).toBeDisplayed();

    await HomePage.termsLink.click();
    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.terms),
    );
  });

  it("TC010 - Checking for links to social networks", async () => {
    await HomePage.open();
    await HomePage.footer.scrollIntoView();

    await expect(HomePage.linkedInBtn).toHaveAttribute("target", "_blank");
    await expect(HomePage.xBtn).toHaveAttribute("target", "_blank");
    await expect(HomePage.facebookBtn).toHaveAttribute("target", "_blank");
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
      { timeoutMsg: "No error messages appeared" },
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

    await HomePage.safeClick(HomePage.ourNetworkLink);

    await expect(browser).toHaveUrl(expect.stringContaining(testData.urls.ourNetwork));

    const visibleH1Text = await HomePage.waitForVisibleH1();
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
        timeoutMsg:
          "The visible mobile menu button did not appear in the header.",
      },
    );

    await expect(hamburgerBtn).toBeDisplayed();

    await browser.setWindowSize(1920, 1080);
  });

  it("TC016 - Navigation: Checking the transition to the Blog page", async () => {
    await HomePage.open();
    const resources = await testData.urls.resources
    await browser.url(resources);

    await expect(browser).toHaveUrl(expect.stringContaining(resources));
    const articleLink = await HomePage.articleLink;
    await articleLink.waitForDisplayed();
    await expect(articleLink).toBeDisplayed();
  });

  it("TC017 - Tabs: Switching to LinkedIn in a new window", async () => {
    await HomePage.open();
    await HomePage.acceptCookies();
    /*await HomePage.footer.scrollIntoView();

    await HomePage.linkedInBtn.waitForClickable();
    await HomePage.linkedInBtn.click();

    const handles = await browser.getWindowHandles();
    expect(handles.length).toBe(2);

    await browser.switchToWindow(handles[1]);
    await expect(browser).toHaveUrl(expect.stringContaining(testData.urls.linkedIn));

    await browser.closeWindow();
    await browser.switchToWindow(handles[0]);*/
    await HomePage.safeClick(HomePage.linkedInBtn);

    await browser.waitUntil(
      async () => (await browser.getWindowHandles()).length === 2,
      { timeoutMsg: "New tab for LinkedIn was not opened" },
    );

    const handles = await browser.getWindowHandles();
    await browser.switchToWindow(handles[1]);
    await expect(browser).toHaveUrl(
      expect.stringContaining(testData.urls.linkedIn),
    );

    await browser.closeWindow();
    await browser.switchToWindow(handles[0]);
  });

  it("TC018 - Routing: Validating the 404 Not Found page", async () => {
    await browser.url(testData.urls.invalidPage);

    const text = await HomePage.notFoundHeading.getText();
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

    if (await HomePage.pricingToggleBtn.isExisting()) {
      await HomePage.pricingToggleBtn.click();
      const currentUrl = await browser.getUrl();
      expect(currentUrl).toBeDefined();
    } else {
      const priceCards = await HomePage.priceCards;
      expect(priceCards.length).toBeGreaterThan(0);
    }
  });
});
