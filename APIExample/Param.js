var ParamConfig = require("./ParamConfig");

function Param(req){

    this.filtersObject = new Array();
    
    //Have to check out
    for(var param in req.query){
        if(param !== "page" && param !== "per_page"){
            let filter = ParamConfig[param](req.query[param]).filter;
            this.filtersObject.push(filter);
        }
    }

    this.page = Number(req.query.page) || 1;
    this.per_page = Number(req.query.per_page) || 2;
}

module.exports = Param;
