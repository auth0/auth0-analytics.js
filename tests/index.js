/* eslint-disable no-undef */

const { expect } = require('chai');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const serve = require('serve');
const { By, until } = webdriver;

const SERVER_PORT = 1337;

// listenToEvent('authenticated');
// listenToEvent('signin submit');
// listenToEvent('register submit');
// listenToEvent('federated login');

const driver = new webdriver.Builder()
.withCapabilities(webdriver.Capabilities.chrome())
.build();

test.describe('Analytics tests', function() {
  this.timeout(10000);
  
  before(() => {
    this.server = serve(__dirname + '/app', {
      port: SERVER_PORT,
      silent: true,
      clipless: true
    });
  });
  
  after(() => {
    this.server.stop();
    driver.quit();
  });
  
  beforeEach(() => {
    driver.get(`http://localhost:${SERVER_PORT}/`)
  });

  test.it('Analytics is loaded', (done) => {
    driver.executeScript('return typeof Auth0Analytics')
    .then((returnValue) => {
      expect(returnValue).equal('object');
      done();
    }); 
  });
  
  test.it('Lock emits the "show" event', () => {
    
    return driver.executeScript('listenToEvent("show")')
    .then(() => {
      driver.findElement(By.id('btn-login')).click();
      
      expect(() => {
        driver.findElement(By.id('event_show'));
      }).to.not.throw();
    });
  });

  test.it('Lock emits the "forgot_password ready" event', () => {
    
    return driver.executeScript('listenToEvent("forgot_password ready")')
    .then(() => {
      driver.findElement(By.id('btn-login')).click();
      
      driver.wait(until.elementLocated(By.className('auth0-lock-alternative-link')), 5000);
      const forgotPasswordLink = driver.findElement(By.className('auth0-lock-alternative-link'));
      
      driver.wait(until.elementIsVisible(forgotPasswordLink), 5000);
      forgotPasswordLink.click();
      
      expect(() => {
        driver.findElement(By.id('event_forgot_password-ready'));
      }).to.not.throw();
    });
  });

  test.it('Lock emits the "forgot_password submit" event', () => {
    
    return driver.executeScript('listenToEvent("forgot_password submit")')
    .then(() => {
      driver.findElement(By.id('btn-login')).click();

      driver.wait(until.elementLocated(By.className('auth0-lock-alternative-link')), 5000);
      const forgotPasswordLink = driver.findElement(By.className('auth0-lock-alternative-link'));
      
      driver.wait(until.elementIsVisible(forgotPasswordLink), 5000);
      forgotPasswordLink.click();
      
      driver.wait(until.elementLocated(By.className('auth0-lock-input')), 5000);
      const forgotPasswordInput = driver.findElement(By.className('auth0-lock-input'));
      
      driver.wait(until.elementIsVisible(forgotPasswordInput), 5000);
      
      forgotPasswordInput.sendKeys('fcorrea@sophilabs.com');
      driver.findElement(By.className('auth0-lock-submit')).click();
      
      expect(() => {
        driver.findElement(By.id('event_forgot_password-submit'));
      }).to.not.throw();
    });
  });

  test.it.skip('Lock emits the "federated login" event', () => {
    
    return driver.executeScript('listenToEvent("federated login")')
    .then(() => {
      driver.findElement(By.id('btn-login')).click();
      
      driver.wait(until.elementLocated(By.className('auth0-lock-social-button-text')), 5000);
      const googleButton = driver.findElement(By.className('auth0-lock-social-button-text'));
      
      driver.wait(until.elementIsVisible(googleButton), 5000);
      googleButton.click();
      driver.findElement(By.tagName('body')).sendKeys('Keys.ESCAPE');
      
      expect(() => {
        driver.findElement(By.id('event_federated-login'));
      }).to.not.throw();
    });
  });

  test.it('Lock emits the "signup submit" event', () => {
    
    return driver.executeScript('listenToEvent("signup submit")')
    .then(() => {
      driver.findElement(By.id('btn-login')).click();
      driver.wait(until.elementLocated(By.linkText('Sign Up'), 5000));
      const signUpTab = driver.findElement(By.linkText('Sign Up'));
      
      driver.wait(until.elementIsVisible(signUpTab), 5000);
      signUpTab.click();

      driver.findElement(By.css('input[type="email"]')).sendKeys('je08f3h@testing.auth0.com');
      driver.findElement(By.css('input[type="password"]')).sendKeys('someRandomPassw0rd');
    
      driver.findElement(By.className('auth0-lock-submit')).click();

      expect(() => {
        driver.findElement(By.id('event_signup-submit'));
      }).to.not.throw();
    });
  });
});
