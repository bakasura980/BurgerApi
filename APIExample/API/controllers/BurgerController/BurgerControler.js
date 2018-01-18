var mongoose = require('mongoose');
var Burgers = mongoose.model('Burgers');
var Param = require('../../ParamFacade');

var BurgerController = (function(){

    let getRandomBurger = function(req, res){
        let randomId = calculateRandomBurgerId();
        Burgers.findById(randomId, function(err, burger) {
            if(err){
                res.send(err);
            }else{
                res.json(burger);
            }
          });
    }

    let calculateRandomBurgerId = function(){
        return Math.floor(Math.random() * Math.floor(db_SIZE));
    }
    
    let getBurger = function(req, res){
        Burgers.findById(res.params.id, function(err, burger) {
            if(err){
                res.send(err);
            }else{
                res.json(burger);
            }
          });
    }

    let createBurger = function(req, res){
        let newBurger = new Burgers(req.body);
        newBurger.save(function(err, burger) {
            if(err){
                res.send(err);
            }else{
                res.json(burger);
            }
        });
    }

    let getBurgers = function(req, res){

        let param = new ParamFacade(req);

        Burgers.find(generateFindCreateria(param.filtersObject), function(err, burger) {
            if(err){
                res.send(err);
            }else{
                res.json(burger);
            }
        }).skip((param.page * param.per_page) - param.per_page).limit(param.per_page);
      
    }

    let generateFindCreateria = function(filters){
        if(filters.length > 0){
            return { $and: filters };
        }else
        {
            return { };
        }
    }
    
    return {
        getRandomBurger: getRandomBurger,
        getBurger: getBurger,
        createBurger: createBurger,
        getBurgers: getBurgers,
    }

})();

module.exports = BurgerController;