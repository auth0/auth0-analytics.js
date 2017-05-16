/* global window, Auth0Lock */

const facebook = require('./facebook');
const google = require('./google');

function setOptions(options) {
  options = options || {};

  facebook.setStatus(options.enable_facebook || true);
  google.setStatus(options.enable_google || true);
}

function logEvent(name, parameters) {
  facebook.logEvent(name, parameters);
  google.logEvent(name, parameters);
}

function setUserId(userId) {
  facebook.setUserId(userId);
  google.setUserId(userId);
}

function setupEvent(lock, name) {
  lock.on(name, function(payload) {
    if (name === 'authenticated' && payload && payload.idTokenPayload && payload.idTokenPayload.sub) {
      setUserId(payload.idTokenPayload.sub);
    }
    logEvent(name);
  });
}

// function setProfile(profile) {
//   facebook.setProfile(profile);
//   // Not implimented for google
// }

// export function setUserProperties(data) {
//   throw new Error('Not implimented');
// }

function init(lock) {
  if (window.auth0AnalyticsOptions) {
    setOptions(window.auth0AnalyticsOptions);
  }

  let eventNames = [
    'show',
    'hide',
    'authenticated'
  ];

  eventNames.forEach(setupEvent.bind(this, lock));
}

if (typeof Auth0Lock === 'function') {
  let prototype = Auth0Lock.prototype;
  Auth0Lock = function() {
    let lock = prototype.constructor.apply(this, arguments);
    init(lock);
    return lock;
  };

  Auth0Lock.prototype = prototype;
}