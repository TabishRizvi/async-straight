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
                setTimeout(function(){
                    cb(null,"hello");
                },1000);
            },
            function(cb){
                setTimeout(function(){
                    cb(null,"world");
                },1000);
            }
        ],function(err,result){
            expect(err).to.eql(null);
            expect(result).to.eql(["hello","world"]);
            expect(callOrder).to.eql([1,2]);
            done();
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
## Tests

```js
npm run test
```

## Author

**Tabish Rizvi (<a href="mailto:sayyidtabish@gmail.com">sayyidtabish@gmail.com</a>)**

## License

**MIT**
