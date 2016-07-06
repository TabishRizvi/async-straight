/**
 * Created by tabishrizvi on 06/07/16.
 */


var _ = require("underscore"),
    CONSTANT = require("./const");


/**
 * straight()
 * @param tasks
 * @param final
 *
 * This is the core function of async-straight which has function signature like straight(tasks,[final])
 */

function straight(tasks,final){

    var tasksListType,keys;

    // To throw error if tasks is neither array or object
    if(!_.isObject(tasks)){
        throw createCustomError("TASKS_NOT_ARRAY_OBJECT");
    }
    // To throw error if final callback is supplied and it is not a function
    if(!_.isUndefined(final) && !_.isFunction(final)){
        throw createCustomError("FINAL_NOT_FUNCTION");
    }
    // To throw error if all elements of tasks are not functions
    if(!_.every(tasks,_.isFunction)){
        throw createCustomError("TASKS_NOT_FUNCTIONS");
    }
    /*To identify task as array or object
    and in case of objects , extract its corresponding keys and values array.
    Note : keys array is later used to create resultObject from resultArray
     */
    if(_.isArray(tasks)){
        tasksListType = "ARRAY";
    }
    else {
        tasksListType = "OBJECT";
        keys = _.keys(tasks);
        tasks = _.values(tasks);
    }
    // If final callback is not supplied, assign a blank function to final
    final = _.isUndefined(final) ? function(){} :  final;

    /* Utility function which runs tasks in series
     and accepts callback as last parameter
     In the callback of this function, we safely call the final callback
      */
    straightUtil(tasks,0,[],function(err,resultArray){
        if(err){
            callSafely(final,this,[err]);
        }
        else{
            // Calculates resultObject from resultArray if original tasks was an object
            if(tasksListType==="OBJECT"){
                var resultObject ={};
                for(var i=0;i<keys.length;i++){
                    resultObject[keys[i]]= resultArray[i];
                }
                callSafely(final,this,[null,resultObject]);
            }
            else{
                callSafely(final,this,[null,resultArray]);
            }
        }
    });



}


/**
 * straightUtils()
 * @param tasks
 * @param counter
 * @param resultArray
 * @param cb
 *
 * It is the recursive utility function which runs function in tasks in series.
 * Counter is the index of current function to be run
 * resultArray is the array of results from functions run up till that point.
 */

function straightUtil(tasks,counter,resultArray,cb){
    // Base case when tasks is an empty array
    if(tasks.length==0){
        cb(null,[]);
        return;
    }
    // Call function in tasks array with index equal to the counter
    callSafely(tasks[counter],this,[function(err,result){

        if(err){
            cb(err,[]);
        }
        else{
            // Push result of current operation into resultArray
            resultArray.push(result);
            if(counter===tasks.length-1){
                cb(null,resultArray);
            }
            else{
                // Call recursively for next counter
                straightUtil(tasks,counter+1,resultArray,cb);
            }
        }
    }]);
}


/**
 * callSafely()
 * @param fn
 * @param thisArg
 * @param args
 *
 * It is used to avoid RangeError if a synchronous task is passed in tasks list
 * It defers the execution of the task till the next pass of the event loop.
 */
function callSafely(fn,thisArg,args){
    process.nextTick(function(){
        fn.apply(thisArg,args);
    });
}

/**
 * createCustomError()
 * @param errorId
 * @returns {Error}
 *
 * It returns an error object by getting message and code from const.js using errorId
 */

function createCustomError(errorId){
    var errorDetails = CONSTANT.error[errorId];
    var err =  new Error(errorDetails.message);
    err.code = errorDetails.code;
    return err;
}


module.exports.straight = straight;