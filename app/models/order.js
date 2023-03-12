const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//We are linking this collection with the 'Users'Collection
const orderSchema = new Schema({
  customerId:{
    // type:mongoose.Schema.Types.ObjectId,
    // ref:'User',
    type:String,
    required:true
},
  customerName:{type:String},
  items: { type: Object, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  paymentType: { type: String, default:'COD' },
  status: { type: String, default:'Placed' },
  timestamp: { type: Date, default: new Date() }, 
});

const order = new mongoose.model("Order", orderSchema);

module.exports = order;
