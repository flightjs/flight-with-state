# flight-with-state

[![Build Status](https://secure.travis-ci.org/<username>/flight-with-state.png)](http://travis-ci.org/<username>/flight-with-state)

A [Flight](https://github.com/flightjs/flight) mixin for storing and reacting to change in a component's internal state.

## Installation

```bash
bower install --save flight-with-state
```

## Example

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
            this.after('setState', this.update);

            // Transition the state using `setState`
            this.setState({
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

        this.update = function () {
            this.$node.toggleClass('is-active', this.state.active);
        };
    }
);
```

## Development

Development of this component requires [Bower](http://bower.io) to be globally
installed:

```bash
npm install -g bower
```

Then install the Node.js and client-side dependencies by running the following
commands in the repo's root directory.

```bash
npm install & bower install
```

To continuously run the tests in Chrome during development, just run:

```bash
npm run watch-test
```

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
