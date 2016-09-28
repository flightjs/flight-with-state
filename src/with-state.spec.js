import { component } from 'flight';
import withState from '.';

describe('withState', function () {
    function makeComponent(Component) {
        return component(withState, Component);
    }

    function initializeComponent(Component, fixture, opts) {
        return (new Component()).initialize(fixture || document.body, opts);
    }

    var ComponentA;
    var ComponentB;
    var ComponentC;
    var instanceAofA;
    var instanceBofA;
    var instanceAofB;
    var instanceAofC;

    // Initialize a component and attach it to the DOM
    beforeEach(function () {
        ComponentA = makeComponent(function () {
            this.attributes({
                initialNumber: 10
            });

            this.initialState({
                alive: true,
                count: 0,
                fn: () => true,
                currentNumber: function () {
                    return this.attr.initialNumber;
                },
                arr: [1, 2, 3]
            });
        });

        ComponentB = makeComponent(function () {
            this.initialState(function (existingState) {
                return {
                    alive: true
                };
            });
        });

        ComponentC = makeComponent(function () {});

        instanceAofA = initializeComponent(ComponentA);
        instanceBofA = initializeComponent(ComponentA);
        instanceAofB = initializeComponent(ComponentB);
        instanceAofC = initializeComponent(ComponentC);
    });

    afterEach(function () {
        ComponentA && ComponentA.teardownAll();
        ComponentB && ComponentB.teardownAll();
        ComponentC && ComponentC.teardownAll();
    });

    describe('initialState', function () {
        it('should add this.state', function () {
            expect(instanceAofA).toBeDefined();
            expect(instanceAofA.state).toBeDefined();
        });

        it('should add empty state if initialState is not called', function () {
            expect(instanceAofC).toBeDefined();
            expect(instanceAofC.state).toEqual({});
        });

        it('propagates initialState to this.state', function () {
            expect(instanceAofA.state.alive).toBe(true);
        });

        it('calls functions defined on initialState to this.state', function () {
            expect(instanceAofA.state.fn).toBe(true);
        });

        it('should be able to access attrs', function () {
            expect(instanceAofA.state.currentNumber).toBe(10);
        });

        it('should take a function that returns a full initial state data', function () {
            expect(instanceAofB.state.alive).toBe(true);
        });

        it('should throw on multiple calls', function () {
            expect(function () {
                makeComponent(function () {
                    this.initialState({
                        alive: true
                    });
                    this.initialState({
                        dead: true
                    });
                });
            }).toThrow();
        });
    });

    describe('this.state', function () {
        it('should not be shared between instances', function () {
            expect(instanceAofA.state).not.toBe(instanceBofA.state);
            instanceAofA.state.alive = false;
            expect(instanceBofA.state.alive).toBe(true);
        });
    });

    describe('this.replaceState', function () {
        it('should replace this.state', function () {
            instanceAofA.replaceState({
                count: 2
            });
            expect(instanceAofA.state.count).toBe(2);
            expect(instanceAofA.state.alive).not.toBeDefined();
        });

        it('handles no data', function () {
            instanceAofA.replaceState();
            expect(instanceAofA.state.alive).toBe(true);
        });
    });

    describe('this.mergeState', function () {
        it('should merge onto this.state', function () {
            instanceAofA.mergeState({
                count: 2
            });
            expect(instanceAofA.state.count).toBe(2);
            expect(instanceAofA.state.alive).toBe(true);
        });

        it('handles no data', function () {
            instanceAofA.mergeState();
            expect(instanceAofA.state.alive).toBe(true);
        });

        it('should not deep merge', function () {
            instanceAofA.mergeState({
                arr: []
            });
            expect(instanceAofA.state.arr.length).toBe(0);
        });

        it('should produce different objects', function () {
            var prevState = instanceAofA.state;
            instanceAofA.mergeState({
                alive: false
            });
            expect(instanceAofA.state).not.toBe(prevState);
        });
    });

    describe('this.toState', function () {
        it('should make a function that mutates the specified key', function () {
            var fn = instanceAofA.toState('count');
            fn.call(instanceAofA, 3);
            expect(instanceAofA.state.count).toBe(3);
        });
    });

    describe('this.fromState', function () {
        it('should make a function that returns data from the specified key', function () {
            var fn = instanceAofA.fromState('alive');
            expect(fn.call(instanceAofA)).toBe(true);
        });
    });

    describe('this.fromAttr', function () {
        it('should make a function that returns data from the specified attr key', function () {
            var fn = instanceAofA.fromAttr('initialNumber');
            expect(fn.call(instanceAofA)).toBe(10);
        });
    });

    describe('this.stateChanged', function () {
        it('should be advice-able to react to state changes', function () {
            var data;
            instanceAofA.after('stateChanged', function (state) {
                data = state;
            });
            var newState = {};
            instanceAofA.replaceState(newState);
            expect(data).toBe(newState);
        });

        it('should recieve old state when state changes', function () {
            var result;
            var newState = {};
            instanceAofA.replaceState(newState);
            instanceAofA.after('stateChanged', function (state, oldState) {
                result = oldState;
            });
            instanceAofA.replaceState({});
            expect(result).toBe(newState);
        });
    });
});

