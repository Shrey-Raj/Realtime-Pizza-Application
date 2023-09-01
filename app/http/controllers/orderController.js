const Order = require("../../models/order");
const Swal = require("sweetalert2");
const moment = require("moment");
const auth = require("../middlewares/auth");

function orderController() {
  return {
    async store(req, res) {
      try {
        const { phone, address } = req.body;

        const newOrder = new Order({
          customerId: req.session.customerId,
          customerName: req.session.name,
          items: req.session.cart.items,
          phone,
          address,
        });

        const customerName = req.session.name;
        console.log(
          "Printing Customer Name in OrderController : ",
          customerName
        );

        const OrderSaved = await newOrder.save();

        let orderId = newOrder._id;

        // console.log(req , 'From orderControlller store ------------------------------------------\n') ;

        req.query.orderId = orderId;
        // console.log(req , 'After setting query in orderController') ;

        // res.redirect(302,`/customers/orders?orderId=`+orderId);
        res.redirect(
          302,
          `/customers/orders?orderId=${encodeURIComponent(orderId)}`
        );

        // res.redirect(302 , '/customers/orders', {orderId: orderId});
      } catch (err) {
        console.log("Error in Placing Order:", err);

        res
          .status(404)
          .render("customers/cart", { message: "Error In Placing Order" });
      }
    },
    async index(req, res) {
      try {
        //Using the auth middleware
        auth(req, res, async () => {
          const orders = await Order.find(
            { customerId: req.session.customerId },
            null,
            { sort: { timestamp: -1 } }
          );

          // console.log(req.session.customerId, "printing in the orderController");

          // console.log(orders, `Customer's All Orders`);

          //To remove any Cache in saved in memory : If you're Placing an order the congratulations alert message displayed and if you go to the previous page and again come to the same page using the previous and forward buttons respectively the congratulations alert is displayed again , but we do not want that . So we're setting this header

          res.header("Expires", "-1");
          res.header("Pragma", "no-cache");

          // console.log(req , 'From orderControlller index ------------------------------------------\n') ;

          res.render("customers/orders", {
            orders: orders,
            name: req.session.name,
            moment: moment,
            message: "Success",
          });
        });
      } catch (err) {
        console.log(
          "Some Error Occured in Placing Order , OrderController",
          err
        );

        res.render("customers/orders", {
          name: req.session.name,
          moment: moment,
        });
      }
    },

    async show(req, res) {

      //Authorize User
      //Search for the order with the same OrderId as req.params.id
      //Then compare the currently logged in user's customerId for that Order's customerId
      const curr_user_id = req.session.customerId.toString() ; 
      const paramId = req.params.id ; 

       await Order.findOne({ _id: paramId })
      .then(order=>{
        console.log('---------------',order,'------------------\n') ;

        if(!order){ //Wrong OrderId in url Params
           return res.render('home',{message:"Wrong OrderID Entered"}) ; 
        }

        console.log('Customer who Ordered = ' , order.customerId , '\n' ,
         'CustomerId = ' , curr_user_id) ; 

          if(order.customerId === curr_user_id){
            res.status(302).render('customers/singleOrder' , {order,name:req.session.name});
          }
          else{
            return res.redirect('/') ; 
          } 
      })
      .catch(err=>{
        console.log(err , 'Error in Showing Order Tracking , (orderController)') ;
      })
    },
  };
}

module.exports = orderController;
