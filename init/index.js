const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing = require("../models/listing.js");

const initDB=async ()=>{
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"65fb9dbde42e4800145123ac"}));
  await Listing.insertMany(initData.data);
  console.log(initData);
}

initDB();

main().then(()=>{
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}






















