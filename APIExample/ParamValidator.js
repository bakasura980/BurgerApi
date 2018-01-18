var ParamValidator = function(params){
    let ParamConfig = require('./ParamConfig');    

    this.checkForWrongParams = function(params){
        for(let param in params){
            if(!(param in ParamConfig)){
                return true;
            }
        }

        return false;
    }

    this.checkForEmptyParam = function(params){
        for(let param in params){
            if(params[param] === ""){
                return true;
            }
        }

        return false;
    }
}