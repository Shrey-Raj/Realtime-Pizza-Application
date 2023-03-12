const Swal = require("sweetalert2");
const auth = require('../middlewares/auth');

function cartController() {
  return {
    cart(req, res) {
      // auth(req,res) ; //middleware so that only loggedIn User can go thru 
      let cartList = req.session.cart;
      let name = req.session.name;
      let totalPrice = 0;

      console.log(req.session , ' printing in CartController') ;

      if (cartList) {
        console.log(cartList);
        cartList = cartList.items;
        totalPrice = req.session.cart.totalPrice;
        console.log(totalPrice, " = TOTAL PRICE");
      }
      res.render("customers/cart", { cartList, totalPrice , name });
    },

    update(req, res) {
      //OBJECT STRUCTURE FOR CART
      // let cart = {
      //     items:{
      //       pizzaId;{ item : pizzaObject , qty :0},
      //     },
      //     totalQty:0,
      //     totalPrice:0
      //   }

      // console.log(req.body , "this is request body") ;

      let name = req.session.name;

      if (name == null) {
        // console.log("User is = ", name);
        //display a message to logIn first
        Swal.fire({
          icon: "error",
          title: "Please login first",
          timer: 2000,
          position: "top-end",
        });

        return res.json({ ifLoggedIn: req.session.name });
      }


      //if cart is empty
      if (req.session.cart == null) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }
      let cart = req.session.cart;

      //Check if item DOES NOT exists in cart
      if (cart.items[req.body._id] == null) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice =
          parseFloat(cart.totalPrice) + parseFloat(req.body.price);
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice =
          parseFloat(cart.totalPrice) + parseFloat(req.body.price);
      }

      return res.json({
        totalQty: req.session.cart.totalQty , 
        ifLoggedIn: req.session.name });
    },
  };
}

module.exports = cartController;
