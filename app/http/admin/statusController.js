const Order = require("../../models/order");

function statusController() {
  return {
    update(req, res) {
      Order.updateOne({ _id: req.body.orderId }, { status: req.body.status })
        .then((result) => {
          res.redirect("/admin/orders");
        })
        .catch((error) => {
          console.log(error , 'Error in updating the status of the order in the status controller');  
          res.status(500).send("Error updating order status");  
        });
    },
  };
}

module.exports = statusController;
