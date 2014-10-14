define(function (require) {
    'use strict';

    var utils = require('flight/lib/utils');

    return withState;
    function withState() {

        /**
         * Define the component's initial state. Takes an object. Values
         * can be of any type; functions will be called at initialize time
         * to produce values that will be used as part of the component's
         * initial this.state value.
         *
         * Examples:
         *
         *      this.initialState({
         *          active: false,
         *          counter: 0,
         *          id: function () {
         *              return this.node.getAttribute('data-id');
         *          }
         *      });
         *
         * Warning: reference data types (objects, arrays, functions) will
         * be shared between instances of the component. Be careful.
         *
         * Multiple calls will be merged together, with the last overwriting
         * the first.
         */
        this.initialState = function (tx) {
            this._stateDef = utils.merge(this._stateDef || {}, tx);
        };

        /**
         * Change the component's state to a new value.
         *
         * Returns the new state.
         */
        this.replaceState = function (state) {
            if (!state || typeof state !== 'object') {
                return;
            }
            this.state = state;
            this.stateChanged(this.state);
            return this.state;
        };

        /**
         * Merge an object of new state data onto the existing state. Takes
         * an object containing the changes.
         *
         * Merge is shallow (only merges based on top-level keys).
         *
         * Examples:
         *
         *      // this.state === { counter: 0, active: false }
         *
         *      this.mergeState({
         *          counter: this.state.counter + 1
         *      });
         *
         *      // this state === { counter: 1, active: false }
         *
         * Returns the new state.
         */
        this.mergeState = function (tx) {
            return this.replaceState(utils.merge(this.state, tx));
        };

        /**
         * Make a function that returns the piece of state specified by the
         * `key` passed.
         *
         * Examples:
         *
         *      var getActive = this.fromState('active');
         *      ...
         *      getActive(); // returns this.state.active
         *
         * Returns a function.
         */
        this.fromState = function (key) {
            var ctx = this;
            return function () {
                return ctx.state[key];
            };
        };

        /**
         * Make a function that sets the state at `key` to the value it is
         * called with.
         *
         * Example:
         *
         *      var setActive = this.toState('active');
         *      ...
         *      setActive(false); // sets this.state.active to false
         *
         * Returns a fuction.
         */
        this.toState = function (key) {
            var ctx = this;
            return function (data) {
                var tx = {};
                tx[key] = data;
                ctx.mergeState(tx);
            };
        };

        /**
         * Make a function that returns the attr at `key`.
         *
         * Examples:
         *
         *      var getId = this.fromAttr('id');
         *      ...
         *      getId(); // returns this.attr.id
         *
         * Returns a function.
         */
        this.fromAttr = function (key) {
            var ctx = this;
            return function (data) {
                return ctx.attr[key];
            };
        };

        /**
         * Noop for advice around state changes.
         */
        this.stateChanged = function () {};

        this.after('initialize', function () {
            var stateDef = (this._stateDef || {});
            var ctx = this;
            var state = Object.keys(stateDef).reduce(function (state, k) {
                var value = stateDef[k];
                state[k] = (typeof value === 'function' ? value.call(ctx) : value);
                return state;
            }, {});
            this.replaceState(state);
        });
    }
});
