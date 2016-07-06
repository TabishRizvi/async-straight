/**
 * Created by tabishrizvi on 06/07/16.
 */

module.exports = {
    error : {
        TASKS_NOT_ARRAY_OBJECT :  {
           message : "Tasks must be an array or object.",
            code : 101
        },
        TASKS_NOT_FUNCTIONS :  {
            message : "Tasks must be an array of functions or object with values as functions.",
            code : 102
        },
        FINAL_NOT_FUNCTION :  {
            message : "Final callback, if supplied, must be a function.",
            code : 103
        }
    }
}