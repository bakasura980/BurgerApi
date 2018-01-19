var BurgerName = require("../Params/BurgerName");

var ParamConfig = { };
ParamConfig.burger_name = function(value) {
    return new BurgerName(value);  
}

module.exports = ParamConfig;