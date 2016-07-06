/**
 * Created by tabishrizvi on 06/07/16.
 */


var _ = require("underscore"),
    CONSTANT = require("./const");

function straight(tasks,final){

    var tasksListType,keys;
    if(typeof tasks !== "object"){
        throw createCustomError("TASKS_NOT_ARRAY_OBJECT");
    }
    else if(Array.isArray(tasks)){
        tasksListType = "ARRAY";
    }
    else {
        tasksListType = "OBJECT";
        keys = _.keys(tasks);
        tasks = _.values(tasks);
    }

    var areAllFunctions = _.every(tasks,function(element){
        return typeof element === "function";
    });

    if(!areAllFunctions){
        throw createCustomError("TASKS_NOT_FUNCTIONS");
    }

    if(tasks.length===0){
        callSafely(final,this,[null,[]]);
        return;
    }

    straightUtil(tasks,0,[],function(err,resultArray){

        if(err){
            callSafely(final,this,[err]);
        }
        else{

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

function straightUtil(tasks,counter,resultArray,cb){

    callSafely(tasks[counter],this,[function(err,result){

        if(err){
            cb(err,[]);
        }
        else{
            resultArray.push(result);
            if(counter===tasks.length-1){
                cb(null,resultArray);
            }
            else{
                straightUtil(tasks,counter+1,resultArray,cb);
            }
        }
    }]);
}

function callSafely (fn,thisArg,args){
    process.nextTick(function(){
        fn.apply(thisArg,args);
    });
}

function createCustomError(errorId){
    var errorDetails = CONSTANT.error[errorId];
    var err =  new Error(errorDetails.message);
    err.code = errorDetails.code;
    return err;
}


module.exports.straight = straight;