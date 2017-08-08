import { browser, by, element } from 'protractor';

export class Projet2Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-ptl-root h1')).getText();
  }
}
