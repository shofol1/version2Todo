const express = require("express");
const mongoose=require("mongoose");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
var items = ["food", "work", "sleep"];
var workList = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/todolistDB',{useNewUrlParser:true});

const itemSchema=mongoose.Schema({
  name:String
})
const Item=mongoose.model("item",itemSchema);

const item1=new Item({
  name:"hello1"
})
const item2=new Item({
  name:"hello2"
})
const item3=new Item({
  name:"hello3"
})


const defaultItem=[item1,item2,item3]

const customItemSchema=mongoose.Schema({
  name:String,
  items:[itemSchema]
})

const customItemModel=mongoose.model("customItem",customItemSchema)



app.get("/", (req, res) => {
  Item.find({},(err,findItem)=>{
    if(findItem.length===0){
     Item.insertMany(defaultItem,(err)=>{
  if(!err){
    console.log("data inserted successfully");
  }else{
    console.log("data insertion failed");
  }
});
res.redirect('/')
    }else{
      res.render("list", {listTitle:"Today",newItem: findItem });

    }

  })

});

app.post("/", (req, res) => {
  var item = req.body.newItem;
  const newItem=new Item({
    name:item
  })
newItem.save();
  res.redirect("/");
});

app.post('/delete',(req,res)=>{
  const removalId=req.body.checkbox;

  Item.findByIdAndRemove(removalId,(err)=>{
    if(!err){
      console.log("data deleteed succesffully");
      res.redirect('/')
    }else{
      console.log("failed to delete");
    }
  })
})

//dynamic routes

app.get('/:pera',(req,res)=>{
  const customName=req.params.pera
 
  
  customItemModel.findOne({name:customName},(err,foundList)=>{
  if(!err){
    if(!foundList){
      const customItem=new customItemModel({
        name:customName,
        item:defaultItem
      })
      customItem.save()
    }else{
     res.render("list",{listTitle:foundList.name,newItem:foundList.items})
    }
  }
})

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
