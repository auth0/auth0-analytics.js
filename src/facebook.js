/* global FB */
import Deferred from './defered';

let ENABLED = true;

const EVENT_NAMES = {
  'show': 'Auth0 Lock Show',
  'hide': 'Auth0 Lock Hide',
  'authenticated': 'Auth0 Lock Authenticated',
};

const deferred = new Deferred();
deferred.run(() => {
  return typeof FB === 'object' && window.fbAsyncInit.hasRun;
});

function translateName(name) {
  let eventName = EVENT_NAMES[name];
  if (!eventName) {
    return `Auth0 Lock ${name}`;
  }
  return eventName;
}

// $account_created_time: The time when the user's account was created, as a unix timestamp.
// $city: The city in which the user lives.
// $country: The country in which the user lives.
// $currency: The user's preferred currency.
// $gender: The gender of the user. To get consistent analytics, set this to 'm' or 'f'.
// $install_source: The source from which the user installed your app.
// $language: The user's preferred language.
// $state: The state in which the user lives.
// $user_type: The type of the user. You define the types to get the analytics results you want.
// $zipcode: The user's zip code.

function normalizeProfile(profile) {
  const normalizedProfile = {};

  // TODO: Seems to be a bug in the FB SDK. Reached out to FB to find out what is going on.
  // if (profile.created_at) {
  //   normalizedProfile.$account_created_time = Math.floor(Date.parse(profile.created_at)/1000);
  // }

  // // Set gender
  // if (profile.gender === 'male') {
  //   normalizedProfile['$gender'] = 'm';
  // } else if (profile.gender === 'famale') {
  //   normalizedProfile['$gender'] = 'f';
  // }
  return normalizedProfile;
}

export function setStatus(enabled) {
  ENABLED = enabled;
  if (!ENABLED) {
    deferred.stop();
  }
}

export function setUserId(userId) {
  deferred.push(() => { FB.AppEvents.setUserID(userId); });
}

export function setProfile(profile) {
  let normalizedProfile = normalizeProfile(profile);
  if (Object.keys(normalizedProfile).length > 0) {
    deferred.push(() => { 
      FB.AppEvents.updateUserProperties(normalizedProfile); 
    });
  }
}

export function logEvent(name) {
  let eventName = translateName(name);
  deferred.push(() => { 
    FB.AppEvents.logEvent(eventName); 
  });
}