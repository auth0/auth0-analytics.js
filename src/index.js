/* global window, Auth0Lock */
import TagManager from 'auth0-tag-manager';

const EVENT_NAMES = {
  'show': 'Auth0 Lock Show',
  'hide': 'Auth0 Lock Hide',
  'authenticated': 'Auth0 Lock Authenticated',
};

let analytics;

function eventIsAvailable(lock, name) {
  if (typeof name !== 'string') throw new Error('Lock event name must be string.');
  
  return lock.validEvents.indexOf(name) !== -1;
}

function setupEvent(lock, name) {
  if (!eventIsAvailable(lock, name)) return;
  
  lock.on(name, function(payload) {
    if (name === 'authenticated' && payload && payload.idTokenPayload && payload.idTokenPayload.sub) {
      analytics.setUserId(payload.idTokenPayload.sub);
    }
    let eventName = EVENT_NAMES[name] || name;
    analytics.track(eventName);
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
  if (!window.auth0AnalyticsOptions) {
    throw new Error('You must provide initialization options for Auth0 Analytics.');
  }

  if (!window.auth0AnalyticsOptions.label) {
    window.auth0AnalyticsOptions.label = 'Auth0 Analytics';
  }

  analytics = TagManager(window.auth0AnalyticsOptions);

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

module.exports = {
  EVENT_NAMES,
  eventIsAvailable,
  setupEvent,
  init
};