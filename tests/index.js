/* eslint-disable no-undef */

const { expect } = require('chai');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const serve = require('serve');
const { By, until } = webdriver;

const SERVER_PORT = 1337;
const SAUCE = 'http://ondemand.saucelabs.com:80/wd/hub';

const bot = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  // .usingServer(SAUCE)
  // .withCapabilities({
  //   browserName: 'Chrome',
  //   platform: 'Windows 10',
  //   name: 'Analytics test',
  //   username: process.env.SAUCE_USERNAME,
  //   accessKey: process.env.SAUCE_ACCESS_KEY
  // })
  .build();

const signUpTabXPath =
  '//*[@id="auth0-lock-container-1"]/div/div[2]/form/div/div/div[3]/span/div/div/div/div/div/div/div/div/div[1]/ul/li[2]/a';

const sleep = (seconds = 1) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));

const testEmail = 'analytics@testing.auth0.com';
const testPassword = 'Passw0rdLess!';

test.describe('Analytics tests', function() {
  this.timeout(10000);

  before(() => {
    this.server = serve(__dirname + '/app', {
      port: SERVER_PORT,
      silent: true,
      clipless: true,
      ssl: true
    });
  });

  after(() => {
    bot.quit();
    this.server.stop();
  });

  beforeEach(() => {
    bot.get(`https://localhost:${SERVER_PORT}/`);
  });

  test.it('Analytics is loaded', done => {
    bot.executeScript('return typeof Auth0Analytics').then(returnValue => {
      expect(returnValue).equal('object');
      done();
    });
  });

  test.it('Lock emits the "show" event', () => {
    return bot.executeScript('listenToEvent("show")').then(() => {
      bot.findElement(By.id('btn-login')).click();

      expect(() => {
        bot.findElement(By.id('event_show'));
      }).to.not.throw();
    });
  });

  test.it('Lock emits the "hide" event', () => {
    return bot.executeScript('listenToEvent("hide")').then(() => {
      bot.findElement(By.id('btn-login')).click();

      bot.wait(
        until.elementLocated(By.className('auth0-lock-close-button'), 5000)
      );
      bot.sleep(1.5);
      bot.findElement(By.className('auth0-lock-close-button')).click();

      expect(() => {
        bot.findElement(By.id('event_hide'));
      }).to.not.throw();
    });
  });

  test.it('Lock emits the "forgot_password ready" event', () => {
    return bot
      .executeScript('listenToEvent("forgot_password ready")')
      .then(() => {
        bot.findElement(By.id('btn-login')).click();

        bot.wait(
          until.elementLocated(By.className('auth0-lock-alternative-link')),
          5000
        );
        const forgotPasswordLink = bot.findElement(
          By.className('auth0-lock-alternative-link')
        );

        bot.wait(sleep());
        bot.wait(until.elementIsVisible(forgotPasswordLink), 5000);
        forgotPasswordLink.click();

        expect(() => {
          bot.findElement(By.id('event_forgot_password-ready'));
        }).to.not.throw();
      });
  });

  test.it('Lock emits the "forgot_password submit" event', () => {
    return bot
      .executeScript('listenToEvent("forgot_password submit")')
      .then(() => {
        bot.findElement(By.id('btn-login')).click();

        bot.wait(
          until.elementLocated(By.className('auth0-lock-alternative-link')),
          5000
        );
        const forgotPasswordLink = bot.findElement(
          By.className('auth0-lock-alternative-link')
        );

        bot.wait(sleep(1.5));
        bot.wait(until.elementIsVisible(forgotPasswordLink), 5000);
        forgotPasswordLink.click();

        bot.wait(until.elementLocated(By.className('auth0-lock-input')), 5000);
        const forgotPasswordInput = bot.findElement(
          By.className('auth0-lock-input')
        );

        bot.wait(sleep());
        bot.wait(until.elementIsVisible(forgotPasswordInput), 5000);

        forgotPasswordInput.sendKeys(testEmail);
        bot.findElement(By.className('auth0-lock-submit')).click();

        expect(() => {
          bot.findElement(By.id('event_forgot_password-submit'));
        }).to.not.throw();
      });
  });

  test.it('Lock emits the "signup submit" event', () => {
    return bot.executeScript('listenToEvent("signup submit")').then(() => {
      bot.findElement(By.id('btn-login')).click();
      bot.wait(until.elementLocated(By.xpath(signUpTabXPath), 5000));
      const signUpTab = bot.findElement(By.xpath(signUpTabXPath));

      bot.wait(until.elementIsVisible(signUpTab), 5000);

      signUpTab.click();

      bot.findElement(By.css('input[type="email"]')).sendKeys(testEmail);
      bot.findElement(By.css('input[type="password"]')).sendKeys(testPassword);
      bot.findElement(By.className('auth0-lock-submit')).click();

      expect(() => {
        bot.findElement(By.id('event_signup-submit'));
      }).to.not.throw();
    });
  });

  test.it('Lock emits the "signin submit" event', () => {
    return bot.executeScript('listenToEvent("signin submit")').then(() => {
      bot.findElement(By.id('btn-login')).click();
      bot.wait(until.elementLocated(By.linkText('Log In'), 5000));

      bot.findElement(By.css('input[type="email"]')).sendKeys(testEmail);
      bot.findElement(By.css('input[type="password"]')).sendKeys(testPassword);

      bot.sleep(1);
      bot.findElement(By.className('auth0-lock-submit')).click();

      expect(() => {
        bot.findElement(By.id('event_signin-submit'));
      }).to.not.throw();
    });
  });

  // TODO: Investigate about authorization_error not emitting in Lock 11
  test.it('Lock emits the "authorization_error" event', () => {
    return bot
      .executeScript('listenToEvent("authorization_error")')
      .then(() => {
        bot.findElement(By.id('btn-login')).click();
        bot.wait(until.elementLocated(By.linkText('Log In'), 5000));

        bot.findElement(By.css('input[type="email"]')).sendKeys(testEmail);
        bot
          .findElement(By.css('input[type="password"]'))
          .sendKeys('Inc0rr3ctP4a55w0rd!');
        bot.findElement(By.className('auth0-lock-submit')).click();

        bot.wait(
          until.elementLocated(By.className('auth0-global-message-error')),
          5000
        );

        expect(() => {
          bot.findElement(By.id('event_authorization_error'));
        }).to.not.throw();
      });
  });

  test.it('Lock emits the "authenticated" event', done => {
    bot.findElement(By.id('btn-login')).click();
    bot.wait(until.elementLocated(By.linkText('Log In'), 5000));

    bot.findElement(By.css('input[type="email"]')).sendKeys(testEmail);
    bot.findElement(By.css('input[type="password"]')).sendKeys(testPassword);

    bot.wait(sleep(1.5));
    bot.findElement(By.className('auth0-lock-submit')).click();
    bot.wait(until.elementLocated(By.id('event_authenticated')), 5000);

    expect(() => {
      bot.findElement(By.id('event_authenticated'));
      done();
    }).to.not.throw();
  });
});
