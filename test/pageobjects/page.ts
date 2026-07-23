import { browser } from '@wdio/globals'

export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public open (path: string) {
        return browser.url(`/${path}`)
    }

    public async waitForVisibleH1(): Promise<string> {
        let visibleText = '';
        await browser.waitUntil(
            async () => {
                const headers = await $$('h1');
                for (const header of headers) {
                    if (await header.isDisplayed()) {
                        visibleText = await header.getText();
                        return true;
                    }
                }
                return false;
            },
            {
                timeoutMsg: 'No visible h1 heading found on the page',
            }
        );
        return visibleText;
    }
}