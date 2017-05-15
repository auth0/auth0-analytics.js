

export default class Deferred {
  constructor() {
    this.isReady = false;
    this.queue = [];
  }

  _ready() {
    this.isReady = true;
    var value = this.queue.shift();
    while (value) {
      value();
      value = this.queue.shift();
    }
  }

  push(fn) {
    if (this.isReady) {
      fn();
    } else {
      this.queue.push(fn);
    }
  }

  run(isReady) {
    if (isReady()) {
      this._ready();
    } else {
      this.timeout = setTimeout(() => { this.run(isReady); }, 100);
    }
  }

  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}