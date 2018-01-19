var ParamConfig = require("./config/ParamConfig");

function ParamFacade(req){

    let filters = new Array();
    
    for(var urlParamName in req.query){
        if(urlParamName !== "page" && urlParamName !== "per_page"){
            let urlParamValue = req.query[urlParamName];

            let param = ParamConfig[urlParamName]( urlParamValue );

            let filter = param.getFilter();
            filters.push(filter);
        }
    }

    this.getFilters = function(){
        return filters;
    }

    this.page = parseInt(req.query.page) || 1;
    this.per_page = parseInt(req.query.per_page) || 2;
}

module.exports = ParamFacade;
