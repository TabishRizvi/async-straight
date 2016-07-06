# **async-straight**

[![NPM](https://nodei.co/npm/logger-one.png)](https://nodei.co/npm/async-straight/)

#### **A light weight module to run asynchronous tasks in series, inspired from [async.series](https://github.com/caolan/async/blob/v1.5.2/README.md#seriestasks-callback)**


## Installation

```sh
npm install async-straight
```

## API


```js
var straight = require('async-straight')
```

### straight(tasks, [callback])

It executes each function in `tasks` in series and after their execution calls the optional `callback`(if supplied).

__Arguments__

* `tasks` - An array or object containing functions to run, each function is passed
  a `cb(err, result)` it must call on completion with an error `err` (which can
  be `null`) and an optional `result` value.
* `callback(err, results)` - An optional callback to run once all the functions
  have completed. This function gets a results array (or object) containing all
  the result arguments passed to the `task` callbacks.


__Example__

```js
straight([
    function(cb){
        // do some stuff ...
        cb(null, 'one');
    },
    function(cb){
        // do some more stuff ...
        cb(null, 'two');
    }
],
// optional callback
function(err, results){
    // results is now equal to ['one', 'two']
});


// an example using an object instead of an array
straight({
    one: function(cb){
        setTimeout(function(){
            cb(null, 1);
        }, 200);
    },
    two: function(callback){
        setTimeout(function(){
            cb(null, 2);
        }, 100);
    }
},
function(err, results) {
    // results is now equal to: {one: 1, two: 2}
});
```

## AUTHOR

** Tabish Rizvi (<a href="mailto:sayyidtabish@gmail.com">sayyidtabish@gmail.com</a>)**

## LICENSE

**MIT**
