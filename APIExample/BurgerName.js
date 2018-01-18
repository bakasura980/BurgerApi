var IParam = require('./IParam');

function BurgerName(value){ 
    let filter = { name: value };
    
    this.getFilter = function(){
        return filter;
    }
}

BurgerName.prototype = Object.create(IParam.prototype);
BurgerName.prototype.constructor = BurgerName;

BurgerName.prototype.getFilter = function(){
    return this.getFilter();
}

module.exports = BurgerName;

