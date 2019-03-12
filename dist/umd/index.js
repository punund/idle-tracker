(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./active-events"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./active-events"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.activeEvents);
    global.index = mod.exports;
  }
})(this, function (_exports, _activeEvents) {
  "use strict";

  _exports.__esModule = true;
  _exports.default = void 0;
  _activeEvents = _interopRequireDefault(_activeEvents);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var DEFAULT_CALLBACK = function DEFAULT_CALLBACK() {
    return undefined;
  };

  var DEFAULT_THROTTLE = 500;
  var DEFAULT_TIMEOUT = 30000;

  var IdleTracker = function IdleTracker(_ref) {
    var _this = this;

    var _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? DEFAULT_TIMEOUT : _ref$timeout,
        _ref$onIdleCallback = _ref.onIdleCallback,
        _onIdleCallback = _ref$onIdleCallback === void 0 ? DEFAULT_CALLBACK : _ref$onIdleCallback,
        _ref$events = _ref.events,
        events = _ref$events === void 0 ? _activeEvents.default : _ref$events,
        _ref$throttle = _ref.throttle,
        throttle = _ref$throttle === void 0 ? DEFAULT_THROTTLE : _ref$throttle;

    _defineProperty(this, "start", function (_temp) {
      var _ref2 = _temp === void 0 ? {} : _temp,
          onIdleCallback = _ref2.onIdleCallback;

      _this.callback = onIdleCallback || _this.callback;
      _this.handleEvent = _this.handleEvent.bind(_this);
      _this.listeners = _this.events.map(function (eventName) {
        document.addEventListener(eventName, _this.handleEvent, false);
        return eventName;
      });

      _this.startTimer.call(_this);
    });

    _defineProperty(this, "startTimer", function () {
      _this.state.lastActive = Date.now();

      _this.resetTimer();
    });

    _defineProperty(this, "handleEvent", function (e) {
      var time = Date.now();

      if (time - _this.state.lastActive < _this.throttleTime) {
        // throttle on change
        return;
      }

      if (e.type === 'mousemove' || e.type === 'touchmove') {
        _this.resetTimer();
      } // only evoke callback when value change


      if (_this.state.idle) {
        _this.callback({
          idle: false
        });
      }

      _this.state.idle = false;

      _this.resetTimer();
    });

    _defineProperty(this, "resetTimer", function () {
      var time = Date.now();

      _this.clearTimer(_this.timer);

      _this.state.lastActive = time;
      _this.timer = setTimeout(function () {
        if (!_this.state.idle) {
          _this.callback({
            idle: true
          });
        }

        _this.state.idle = true;

        _this.resetTimer();
      }, _this.timeout);
    });

    _defineProperty(this, "isIdle", function () {
      return _this.state.idle;
    });

    _defineProperty(this, "clearTimer", function (timer) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    });

    _defineProperty(this, "end", function () {
      if (_this.listeners.length) {
        _this.listeners.forEach(function (eventName) {
          return document.removeEventListener(eventName, _this.handleEvent);
        });
      }

      _this.clearTimer(_this.timer);
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
  };

  var _default = IdleTracker;
  _exports.default = _default;
});