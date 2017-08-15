/* global window, Auth0Lock */
import 'babel-polyfill';

import TagManager from 'auth0-tag-manager';

let analytics;

const IGNORED_EVENTS = [
  'hash_parsed'
];

function eventShouldBeIgnored(name) {
  if (typeof name !== 'string') throw new Error('Lock event name must be string.');
  
  return IGNORED_EVENTS.indexOf(name) !== -1;
}

function eventIsAvailable(lock, name) {
  if (typeof name !== 'string') throw new Error('Lock event name must be string.');
  
  return lock.validEvents.indexOf(name) !== -1;
}

function setupEvent(lock, name, tracker = analytics) {
  if (!eventIsAvailable(lock, name)) return;
  
  lock.on(name, function(payload) {
    if (name === 'authenticated' && payload && payload.idTokenPayload && payload.idTokenPayload.sub) {
      tracker.setUserId(payload.idTokenPayload.sub);
    }
    let eventName = `auth0 lock ${name}`;
    tracker.track(eventName);
  });
}

function init(lock) {
  if (!window.auth0AnalyticsOptions) {
    throw new Error('You must provide initialization options for Auth0 Analytics.');
  }

  if (!window.auth0AnalyticsOptions.label) {
    window.auth0AnalyticsOptions.label = 'Auth0 Analytics';
  }

  analytics = TagManager(window.auth0AnalyticsOptions);

  lock.validEvents.forEach((name) => {
    if (eventShouldBeIgnored(name)) return; // Not needed for analytics
    setupEvent(lock, name);
  });
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
  IGNORED_EVENTS,
  eventShouldBeIgnored,
  eventIsAvailable,
  setupEvent,
  init
};