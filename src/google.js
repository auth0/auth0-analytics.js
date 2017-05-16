/* global ga */
import Deferred from './defered';

let ENABLED = true;

const deferred = new Deferred();
deferred.run(() => {
  return typeof ga === 'function';
});

export function setStatus(enabled) {
  ENABLED = enabled;
  if (!ENABLED) {
    deferred.stop();
  }
}

export function setUserId(userId) {
  if (ENABLED) {
    deferred.push(() => ga('set', 'userId', userId));
  }
}

// export function setProfile(profile) {
// }

export function logEvent(name) {
  if (ENABLED) {
    deferred.push(() => ga('send', 'event', 'Auth0Lock', name));
  }
}