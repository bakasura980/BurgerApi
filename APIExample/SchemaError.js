var SchemaErrors = (function(){

    let saveError = function(req){
        return sendError(req, "Save Errors");
    }

    let updateError = function(req){
        return sendError(req, "Update Errors");
    }

    let findError = function(req){
        return sendError(req, "Find Errors");
    }

    let sendError = function(req, message){
        res.statusCode = 500;
        return res.json({
            errors: [
                { message: message }
            ]
        });
    }

    return{
        saveError: saveError,
        updateError: updateError,
        findError: findError
    }
})();