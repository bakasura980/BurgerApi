var ParamValidator = (function(){
    let ParamConfig = require('./API/Params/config/ParamConfig');    

    let checkForWrongParams = function(params, res, next){
        for(let param in params){
            if(!(param in ParamConfig) && param !== "page" && param !== "per_page"){
                res.statusCode = 400;
                return res.json({
                    errors: [
                        { message: `Wrong param: ""${param}""` }
                    ]
                });
            }
        }

        next();
    }

    let checkForEmptyParam = function(params, res, next){
        for(let param in params){
            if(params[param] === ""){
                res.statusCode = 400;
                return res.json({
                    errors: [
                        { message: `Param: "${param}" can not be empty` }
                    ]
                });
            }
        }

        next();
    }

    return{
        checkForWrongParams: checkForWrongParams,
        checkForEmptyParam: checkForEmptyParam
    }
})();

module.exports = ParamValidator;