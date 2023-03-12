require("../server.js");
const auth = require('../app/http/middlewares/auth');
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/cartController");
const orderController = require("../app/http/controllers/orderController");
const AdminOrderController = require("../app/http/admin/orderController")
const statusController = require("../app/http/admin/statusController")

function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/login", authController().login);

  app.get("/register", authController().register);

  app.get("/cart", cartController().cart);

  app.post('/update-cart' , cartController().update) ;

  app.post('/register' , authController().postRegister) ;

  app.post('/login' , authController().postLogin) ;

  app.get('/logout' , authController().logout) ;
  
  //Customer routes 
  app.get('/customers/orders' , orderController().index) ;
  app.get('/customers/orders/:id' , orderController().show) ;
  app.post('/orders' , orderController().store) ;

  //Admin routes
  app.get('/admin/orders',  AdminOrderController().index) ;
  app.post('/admin/orders/status',  statusController().update) ;
}

module.exports = initRoutes;
 