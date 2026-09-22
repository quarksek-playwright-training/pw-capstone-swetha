import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput = this.page
    .getByPlaceholder('Email Address')
    .first();

  readonly passwordInput = this.page
    .getByPlaceholder('Password');

  readonly loginButton = this.page
    .getByRole('button', { name: 'Login' });

  readonly loginError = this.page.getByText(
    'Your email or password is incorrect!'
  );

  readonly loginAccountText = this.page.getByText(
    'Login to your account'
  );

  async openLoginPage() {
    await this.goToHome();
    await this.openLogin();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await this.loginButton.click();
  }
}