const { expect } = require('chai');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const serve = require('serve');

const SERVER_PORT = 1337;

test.describe('Analytics tests', function() {
  this.timeout(10000);
  
  before(() => {
    this.server = serve(__dirname + '/app', {
        port: SERVER_PORT,
        silent: true,
        clipless: true
    }) 
  });

  after(() => {
    this.server.stop();
  });

  beforeEach(() => {
    this.driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();
  });

  afterEach(() => {
    this.driver.quit();
  });

  test.it('Loads the webpage', (done) => {
    this.driver.get('http://localhost:1337/');
    this.driver.executeScript('return document.title')
      .then((returnValue) => {
        expect(returnValue).equal('Auth0 Analytics');
        done();
      });    
  });

  test.it('Analytics is loaded', (done) => {
    this.driver.get('http://localhost:1337/');
    this.driver.executeScript('return typeof Auth0Analytics')
      .then((returnValue) => {
        expect(returnValue).equal('object');
        done();
      }); 
  })
});
