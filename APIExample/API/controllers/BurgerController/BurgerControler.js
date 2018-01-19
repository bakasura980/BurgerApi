var BurgerController = (function(){

    let mongoose = require('mongoose');
    let Burgers = mongoose.model('Burgers');
    let ParamFacade = require('../../Params/ParamFacade');

    let getRandomBurger = function(req, res){
        calculateRandomBurgerId().then((randomId) => {
            req.params.id = randomId;
            getBurger(req, res);
        });
        
    }

    let calculateRandomBurgerId = function(){
        return new Promise((resolve) => {
                                    getBurgersCount().then((burgersCount) => {
                                        let randomNumber = Math.floor(Math.random() * Math.floor(burgersCount));
                                        resolve(randomNumber);
                                });
                            });
    }

    let getBurgersCount = function(){
        return Burgers.collection.count();
    }
    
    let getBurger = function(req, res){
        Burgers.findOne( { id: Number(req.params.id) }, function(err, burger) {
            sendResponse(err, burger, res);
        });
    }

    let sendResponse = function(err, burger, res){
        if(err){
            res.send(err);
        }else{
            res.json(burger);
        }
    }

    let createBurger = function(req, res){
        let newBurger = new Burgers(req.body);
        newBurger.save(function(err, burger) {
            sendResponse(err, burger, res);
        });
    }

    let getBurgers = function(req, res){

        let param = new ParamFacade(req);
        let filters = param.getFilters();
        Burgers.find(generateFilters(filters), 
                        function(err, burger) {
                            sendResponse(err, burger, res);
                        })
        .skip((param.page * param.per_page) - param.per_page)
        .limit(param.per_page);
      
    }

    let generateFilters = function(filters){
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