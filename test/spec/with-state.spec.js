define(function (require) {
    'use strict';

    var component = require('flight/lib/component');
    var withState = require('lib/with-state');

    describe('withState', function () {

        function makeComponent(Component) {
            return component(withState, Component);
        }

        function initializeComponent(Component, fixture, opts) {
            return (new Component()).initialize(fixture || document.body, opts);
        }

        var ComponentA;
        var instanceA;
        var instanceB;

        // Initialize a component and attach it to the DOM
        beforeEach(function () {
            ComponentA = makeComponent(function () {
                this.attributes({
                    initialNumber: 10
                });

                this.initialState({
                    alive: true,
                    count: 0,
                    fn: function () {
                        return true;
                    },
                    currentNumber: function () {
                        return this.attr.initialNumber;
                    }
                });

                this.initialState({
                    merged: true
                });
            });

            instanceA = initializeComponent(ComponentA);
            instanceB = initializeComponent(ComponentA);
        });

        afterEach(function () {
            ComponentA && ComponentA.teardownAll();
        });

        describe('initialState', function () {
            it('should add this.state', function () {
                expect(instanceA).toBeDefined();
                expect(instanceA.state).toBeDefined();
            });

            it('propagates initialState to this.state', function () {
                expect(instanceA.state.alive).toBe(true);
            });

            it('calls functions defined on initialState to this.state', function () {
                expect(instanceA.state.fn).toBe(true);
            });

            it('merges multiple calles', function () {
                expect(instanceA.state.merged).toBe(true);
            });

            it('should be able to access attrs', function () {
                expect(instanceA.state.currentNumber).toBe(10);
            });
        });

        describe('this.state', function () {
            it('should not be shared between instances', function () {
                expect(instanceA.state).not.toBe(instanceB.state);
                instanceA.state.alive = false;
                expect(instanceB.state.alive).toBe(true);
            });
        });

        describe('this.replaceState', function () {
            it('should replace this.state', function () {
                instanceA.replaceState({
                    count: 2
                });
                expect(instanceA.state.count).toBe(2);
                expect(instanceA.state.alive).not.toBeDefined();
            });

            it('handles no data', function () {
                instanceA.replaceState();
                expect(instanceA.state.alive).toBe(true);
            });
        });

        describe('this.mergeState', function () {
            it('should merge onto this.state', function () {
                instanceA.mergeState({
                    count: 2
                });
                expect(instanceA.state.count).toBe(2);
                expect(instanceA.state.alive).toBe(true);
            });

            it('handles no data', function () {
                instanceA.mergeState();
                expect(instanceA.state.alive).toBe(true);
            });
        });

        describe('this.toState', function () {
            it('should make a function that mutates the specified key', function () {
                var fn = instanceA.toState('count');
                fn.call(instanceA, 3);
                expect(instanceA.state.count).toBe(3);
            });
        });

        describe('this.fromState', function () {
            it('should make a function that returns data from the specified key', function () {
                var fn = instanceA.fromState('alive');
                expect(fn.call(instanceA)).toBe(true);
            });
        });

        describe('this.fromAttr', function () {
            it('should make a function that returns data from the specified attr key', function () {
                var fn = instanceA.fromAttr('initialNumber');
                expect(fn.call(instanceA)).toBe(10);
            });
        });

        describe('this.stateChanged', function () {
            it('should be advice-able to react to state changes', function () {
                var data;
                instanceA.after('stateChanged', function (state) {
                    data = state;
                });
                var newState = {};
                instanceA.replaceState(newState);
                expect(data).toBe(newState);
            });
        });
    });
});

