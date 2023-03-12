const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PizzaSchema = new Schema({
  _id:{type:String,required:true},
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
});

const pizza = new mongoose.model("pizza", PizzaSchema);

module.exports = pizza;
