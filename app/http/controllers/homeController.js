const pizza=require('../../models/menu') ;

 
function homeController() {

  
  return {
    async index(req, res) {
      const pizzainfo = await pizza.find() ; 
      const convertTOString = JSON.stringify(pizzainfo) ; 

      // console.log(convertTOString) ;  
      // console.log(pizzainfo) ;      

      //If the cart in not NUll , pass the existing no. of elements to the frontend
      // console.log( , " = Hello from Home controller") ; 
// console.log(req) ; 

let name = req.session.name ; 

      let cartItems = req.session.cart ; 
      if(cartItems)
      cartItems = cartItems.totalQty; 
      else 
      cartItems = '' ;

      res.render("home" , {
          pizzas : pizzainfo ,
         cartItems:cartItems,
        name}); // We can now get 'pizza' db in frontEnd with the name "pizzas" , which we will use to render the details of pizza-cards in home.hbs file .
    },
  };
}


module.exports = homeController;
 