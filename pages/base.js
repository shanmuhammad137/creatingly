export class BasePage {
  constructor(page) {
      this.page = page;
      this.route = '/';
      this.selectors = {};
  }

  async visit() {
    await this.page.goto(this.route);
  }
}
