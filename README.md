# flight-with-state

[![Build Status](https://secure.travis-ci.org/flightjs/flight-with-state.png)](http://travis-ci.org/flightjs/flight-with-state)

A [Flight](https://github.com/flightjs/flight) mixin for storing and reacting to change in a component's internal state.

## Installation

```bash
npm install --save flight-with-state
```

This module requires `lodash.merge` as a peer dependency.

## Example

Here's an example component that uses with `withState`.

```js
var ToggleButton = flight.component(
    // Use `withState` before your component definition.
    withState,
    function toggleButton() {
        this.attributes({
            initiallyActive: false
        });

        // Define an instance's `initialState`
        this.initialState({
            active: false
        });

        this.after('initialize', function () {
            this.on('click', this.toggle);

            // Track changes to the state using advice
            this.after('stateChanged', this.update);

            // Transition the state using `replaceState`
            this.replaceState({
                active: this.attr.initiallyActive
            });
        });

        this.toggle = function () {
            // Merge changes onto the state using `mergeState`
            this.mergeState({
                // Access the current state using `this.state`
                active: !this.state.active
            });
        };

        this.update = function (state, previousState) {
            this.$node.toggleClass('is-active', state.active);
        };
    }
);
```

Tracking changes to your state should be done with advice on `stateChanged`:

```js
this.after('stateChanged', this.reactToStateChange);
```

## API

### `initialState`

`initialState`, like `attributes`, takes an object to set up the first `state` of an instance of a component. If you can pass a function, it will be called at initialize-time to produce the initial value. This allows you to react to the attrs or node of a component to produce the initial state.

For example:

```js
this.initialState({
    active: false,
    id: function () {
        return this.attr.id;
    }
})
```

*Warning*: data structures as values in `initialState` will be shared by instances of a component. If you need a new data structure each time, return it from a function.

### `replaceState`

`replaceState` changes the component's state to a new value. You can react to a change to state using `this.after('replaceState', this.doSomething)`.

```js
this.replaceState({
    active: false
});
// this.state.active === false
this.replaceState({
    id: '123'
});
// this.state.id === '123'
// this.state.active === undefined
```

### `mergeState`

`mergeState` shallow merges an object into the component's state.

```js
this.mergeState({
    active: false
});
// this.state.active === false
this.mergeState({
    id: '123'
});
// this.state.id === '123'
// this.state.active === false
```

### `fromState`

Make a function that returns the piece of state specified by the `key` passed.

```js
var getActive = this.fromState('active');
...
getActive.call(this); // returns this.state.active
```

### `toState`

Make a function that sets the state at `key` to the value it is called with.

```js
var setActive = this.toState('active');
...
setActive.call(this, false); // sets this.state.active to false
```

### `fromAttr`

Make a function that returns a components attributes, specified by the `key` passed.

```js
var id = this.fromAttr('id');
...
id.call(this); // returns this.attr.id
```

`fromAttr` is most useful when used with `initialState`:

```js
this.attributes({
    isActive: false
});

this.initialState({
    active: this.fromAttr('isActive')
});
```

## Development

To develop this module, clone the repository and run:

```
$ npm install && npm test
```

If the tests pass, you have a working environment. You shouldn't need any external dependencies.

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
