module.exports = function(app){

    
    let bugerController = require('../controllers/BurgerControler');

    app.route('burgers/:id')
    .get(bugerController.getBurger);

    app.route('/burger/random')
    .get(bugerController.getRandomBurger);

    app.route('/burger')
    .post(bugerController.createBurger);

    app.route('/burgers')
    .get(bugerController.getBurgers);

}