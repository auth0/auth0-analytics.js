const facebook = require('./facebook');
const google = require('./google');

function setOptions(options) {
  options = options || {};

  facebook.setStatus(options.facebook_enabled || true);
  google.setStatus(options.google_enabled || true);
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
    logEvent(name);
  });
}


export function setAuthenticated(authResult) {
  if (authResult && authResult.idTokenPayload && authResult.idTokenPayload.sub) {
    setUserId(authResult.idTokenPayload.sub);
    logEvent('authenticated');
  }
}

export function setProfile(profile) {
  facebook.setProfile(profile);
  // Not implimented for google
}

export function setUserProperties(data) {

}

export function initLock(lock, options) {
  setOptions(options);
  [
    'show',
    'hide',
  ].forEach(setupEvent.bind(this, lock));
}