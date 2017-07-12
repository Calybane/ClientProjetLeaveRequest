import { Projet2Page } from './app.po';

describe('projet2 App', () => {
  let page: Projet2Page;

  beforeEach(() => {
    page = new Projet2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
