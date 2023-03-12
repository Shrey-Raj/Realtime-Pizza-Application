const Order = require("../../models/order");
const User = require("../../models/user");

function orderController() {
  return {
    async index(req, res) {
      // console.log(
      //   req,
      //   "from ADMIN ORDER CONTROLLER ------------------------------------------------- \n"
      // );

      const customerId = req.session.customerId;
      console.log("CustomerID = " , customerId) ; 

      await User.findOne({ _id : customerId })
        .select("name email role")
        .then(async (user) => { 
          
          if(user)
          console.log(user.name , '\n' , user.email , '\n' , user.role ) ; 

          if (user && user.role == "admin") {
            const AllOrders = await Order.find(
              {
                status: {
                  $ne: "completed",
                },
              },
              null,
              { sort: { timestamp: -1 } }
            );

 
            // console.log(AllOrders);
            res.render("admin/orders", {
              AllOrders: AllOrders,
            });
          } else {
            res
              .status(302)
              .render("auth/login", {
                message: "Please Login First As ADMIN ", 
                name : req.session.name ,
              });
          }
        })
        .catch((err) => {
          console.log(
            err,
            "Error in Displaying Orders to Admin in orderController\n"
          );
          res.status(404).send("OOPS! Some Error Occured");
        });
    },
  };
}

module.exports = orderController;
