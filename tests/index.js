const { expect } = require('chai');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');

test.describe('Sample test', function() {
  this.timeout(10000);

  beforeEach(() => {
    this.driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();
  });

  afterEach(() => {
    this.driver.quit();
  });

  test.it('Sample test case', (done) => {
    this.driver.get('http://the-internet.herokuapp.com');
    this.driver.executeScript('return document.title')
      .then((returnValue) => {
        expect(returnValue).equal('The Internet');
        done();
      });    
  });
});
