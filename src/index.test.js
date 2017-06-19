import * as analytics from './index';

const lock = {
  on: jest.fn(),
  validEvents: ['a', 'b', 'c', 'd']
};

const check = (eventName) => analytics.eventIsAvailable(lock, eventName);

test('eventIsAvailable must check if an event is available', () => {
  // Expect to find
  expect(check('a')).toBe(true);
  expect(check('b')).toBe(true);
  expect(check('c')).toBe(true);
  expect(check('d')).toBe(true);
});

test('eventIsAvailable must check if an event is not available', () => {
  // Expect not to find
  expect(check('e')).toBe(false);
  expect(check('f')).toBe(false);
  expect(check('g')).toBe(false);
  expect(check('h')).toBe(false);
});

test('eventIsAvailable must throw an error if event name is not a string', () => {
  const error = 'Lock event name must be string.';
  
  // With object
  expect(() => {
    check({});
  }).toThrow(error);

  // With number
  expect(() => {
    check(73);
  }).toThrow(error);

  // With array
  expect(() => {
    check([]);
  }).toThrow(error);
});

test('setupEvent must subscribe to event if name is available', () => {
  analytics.setupEvent(lock, 'a');
  expect(lock.on.mock.calls.length).toEqual(1);
});

test('setupEvent must not subscribe to event if name is not available', () => {
  analytics.setupEvent(lock, 'a');
  expect(lock.on.mock.calls.length).toEqual(2);
});

test('setupEvent must subscribe to event using the same name it received', () => {
  const eventName = lock.validEvents[0];
  analytics.setupEvent(lock, eventName);
  expect(lock.on.mock.calls[2][0]).toEqual(eventName);
});

test('setupEvent must subscribe using a callback function', () => {
  const eventName = lock.validEvents[0];
  analytics.setupEvent(lock, eventName);
  expect(typeof lock.on.mock.calls[3][1]).toEqual('function');
});

