import * as script from './index';
jest.mock('auth0-tag-manager');

const analytics = require('auth0-tag-manager').default;
const check = (eventName) => script.eventIsAvailable(lock, eventName);
const payload = {
  idTokenPayload: {
    sub: '5998fb300000000000000000'
  }
};
const options = {
  'facebook-analytics': {
    id: '586886298182936'
  }
};
window.Auth0Lock = jest.fn();
window.auth0AnalyticsOptions = options;

const lock = {
  on: jest.fn(),
  validEvents: [ ...script.EVENT_NAMES, 'a', 'b', 'c', 'd']
};

const errors = {
  noOptions: 'You must provide initialization options for Auth0 Analytics.',
  eventIsNotString: 'Lock event name must be string.'
};

beforeAll(() => {
  script.init(lock);
});

beforeEach(() => {
  // Reset lock.on calls to avoid counting them in tests.
  lock.on.mock.calls = [];
});

test('eventIsAvailable should check if an event is available', () => {
  // Expect to find
  expect(check('a')).toBe(true);
  expect(check('b')).toBe(true);
  expect(check('c')).toBe(true);
  expect(check('d')).toBe(true);
});

test('eventIsAvailable should check if an event is not available', () => {
  // Expect not to find
  expect(check('e')).toBe(false);
  expect(check('f')).toBe(false);
  expect(check('g')).toBe(false);
  expect(check('h')).toBe(false);
});

test('eventIsAvailable should throw an error if event name is not a string', () => {
  const error = errors.eventIsNotString;
  
  // With object
  expect(() => {
    check({});
  }).toThrow(error);

  // With number
  expect(() => {
    check(7513);
  }).toThrow(error);

  // With array
  expect(() => {
    check([]);
  }).toThrow(error);
});

test('setupEvent should subscribe to event if name is available', () => {
  script.setupEvent(lock, 'a');
  expect(lock.on.mock.calls.length).toEqual(1);
});

test('setupEvent should not subscribe to event if name is not available', () => {
  script.setupEvent(lock, 'a');
  expect(lock.on.mock.calls.length).toEqual(1);
});

test('setupEvent should subscribe to event using the same name it received', () => {
  const eventName = lock.validEvents[0];
  script.setupEvent(lock, eventName);
  expect(lock.on.mock.calls[0][0]).toEqual(eventName);
});

test('setupEvent should subscribe using a callback function', () => {
  const eventName = lock.validEvents[0];
  script.setupEvent(lock, eventName);
  expect(typeof lock.on.mock.calls[0][1]).toEqual('function');
});

test('init should initialize analytics with options', () => {
  expect(analytics).toBeCalledWith(options);
});

test('init should throw an error if there are no options set', () => {
  expect(() => {
    window.auth0AnalyticsOptions = null;
    script.init(lock);
    window.auth0AnalyticsOptions = options;
  }).toThrow(errors.noOptions);
});

test('init should set default label if not provided', () => {
  window.auth0AnalyticsOptions = options;
  script.init(lock);
  expect(window.auth0AnalyticsOptions.label).toEqual('Auth0 Analytics');
});



