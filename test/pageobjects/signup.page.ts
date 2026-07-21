import Page from './page.js';

class SignUpPage extends Page {
    public get h1() { return $('h1'); }
    public get form() { return $('form'); }
    public get submitBtn() { return $('button[type="submit"]'); }
    public get validationErrors() { return $$('[aria-invalid="true"]'); }

    public open() {
        return super.open('sign-up');
    }

    public async submitForm() {
        await this.submitBtn.click();
    }
}
export default new SignUpPage();