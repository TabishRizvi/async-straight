var chai = require("chai");
var expect = chai.expect;
var straight = require("../index");
var assert = require("assert");

describe("Straight", function () {

    this.timeout(15000);

    it("series", function (done) {
        var callOrder = [];
        straight([
            function (cb) {
                setTimeout(function () {
                    callOrder.push(1);
                    cb(null, "hello");
                }, 1000);
            },
            function (cb) {
                setTimeout(function () {
                    callOrder.push(2);
                    cb(null, "world");
                }, 1000);
            }
        ], function (err, result) {
            expect(err).to.eql(null);
            expect(result).to.eql(["hello", "world"]);
            expect(callOrder).to.eql([1, 2]);
            done();
        });
    });

    it("empty array", function (done) {
        straight([], function (err, results) {
            expect(err).to.equal(null);
            expect(results).to.eql([]);
            done();
        });
    });

    it("series object", function (done) {
        straight({
            x: function (cb) {
                setTimeout(function () {
                    cb(null, "hello");
                }, 1000);
            },
            y: function (cb) {
                setTimeout(function () {
                    cb(null, "world");
                }, 1000);
            }
        }, function (err, result) {
            expect(err).to.eql(null);
            expect(result).to.eql({x: "hello", y: "world"});
            done();
        });
    });

    it("error", function (done) {
        straight({
            x: function (cb) {
                setTimeout(function () {
                    cb("this is error");
                }, 1000);
            },
            y: function (cb) {
                setTimeout(function () {
                    cb(null, "world");
                }, 1000);
            }
        }, function (err, result) {
            expect(err).to.eql("this is error");
            done();
        });
    });

    it("no callback", function (done) {
        straight([
            function (callback) {
                callback();
            },
            function (callback) {
                callback();
                done();
            }
        ]);
    });

    it("falsy return values", function (done) {
        function taskFalse(callback) {
            callback(null, false);
        }

        function taskUndefined(callback) {
            callback(null, undefined);
        }

        function taskEmpty(callback) {
            callback(null);
        }

        function taskNull(callback) {
            callback(null, null);
        }

        straight(
            [taskFalse, taskUndefined, taskEmpty, taskNull],
            function (err, results) {
                expect(results.length).to.equal(4);
                assert.strictEqual(results[0], false);
                assert.strictEqual(results[1], undefined);
                assert.strictEqual(results[2], undefined);
                assert.strictEqual(results[3], null);
                done();
            }
        );
    });

    it("tasks not array or object", function () {
        expect(straight.bind(straight, 12312, function (err, result) {
        })).to.throw(Error, /Tasks must be an array or object./);
    });

    it("tasks is null", function () {
        expect(straight.bind(straight, null, function (err, result) {
        })).to.throw(Error, /Tasks must be an array or object./);
    });

    it("tasks not all elements as functions", function () {
        expect(straight.bind(straight, [
            function (cb) {
                setTimeout(function () {
                    cb(null, "hello");
                }, 1000);
            },
            "this is not a function"
        ], function (err, result) {
        })).to.throw(Error, /Tasks must be an array of functions or object with values as functions./);
    });

    it("final callback is not function", function () {
        expect(straight.bind(straight, [
            function (cb) {
                setTimeout(function () {
                    cb(null, "hello");
                }, 1000);
            },
            function (cb) {
                setTimeout(function () {
                    cb(null, "world");
                }, 2000);
            }
        ], "this is not a function")).to.throw(Error, /Final callback, if supplied, must be a function./);
    });

});