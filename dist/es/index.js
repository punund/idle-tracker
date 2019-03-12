"use strict";

exports.__esModule = true;
exports.default = void 0;

var _activeEvents = _interopRequireDefault(require("./active-events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_CALLBACK = () => undefined;

const DEFAULT_THROTTLE = 500;
const DEFAULT_TIMEOUT = 30000;

class IdleTracker {
  constructor(_ref) {
    var _this = this;

    let _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? DEFAULT_TIMEOUT : _ref$timeout,
        _ref$onIdleCallback = _ref.onIdleCallback,
        _onIdleCallback = _ref$onIdleCallback === void 0 ? DEFAULT_CALLBACK : _ref$onIdleCallback,
        _ref$events = _ref.events,
        events = _ref$events === void 0 ? _activeEvents.default : _ref$events,
        _ref$throttle = _ref.throttle,
        throttle = _ref$throttle === void 0 ? DEFAULT_THROTTLE : _ref$throttle;

    _defineProperty(this, "start", function (_temp) {
      let _ref2 = _temp === void 0 ? {} : _temp,
          onIdleCallback = _ref2.onIdleCallback;

      _this.callback = onIdleCallback || _this.callback;
      _this.handleEvent = _this.handleEvent.bind(_this);
      _this.listeners = _this.events.map(eventName => {
        document.addEventListener(eventName, _this.handleEvent, false);
        return eventName;
      });

      _this.startTimer.call(_this);
    });

    _defineProperty(this, "startTimer", () => {
      this.state.lastActive = Date.now();
      this.resetTimer();
    });

    _defineProperty(this, "handleEvent", e => {
      const time = Date.now();

      if (time - this.state.lastActive < this.throttleTime) {
        // throttle on change
        return;
      }

      if (e.type === 'mousemove' || e.type === 'touchmove') {
        this.resetTimer();
      } // only evoke callback when value change


      if (this.state.idle) {
        this.callback({
          idle: false
        });
      }

      this.state.idle = false;
      this.resetTimer();
    });

    _defineProperty(this, "resetTimer", () => {
      const time = Date.now();
      this.clearTimer(this.timer);
      this.state.lastActive = time;
      this.timer = setTimeout(() => {
        if (!this.state.idle) {
          this.callback({
            idle: true
          });
        }

        this.state.idle = true;
        this.resetTimer();
      }, this.timeout);
    });

    _defineProperty(this, "isIdle", () => this.state.idle);

    _defineProperty(this, "clearTimer", timer => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    });

    _defineProperty(this, "end", () => {
      if (this.listeners.length) {
        this.listeners.forEach(eventName => document.removeEventListener(eventName, this.handleEvent));
      }

      this.clearTimer(this.timer);
    });

    this.callback = _onIdleCallback;
    this.events = events;
    this.listeners = [];
    this.throttleTime = throttle;
    this.timeout = timeout;
    this.timer = null;
    this.state = {
      idle: false,
      lastActive: 0
    };
  }

}

var _default = IdleTracker;
exports.default = _default;