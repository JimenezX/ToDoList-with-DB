const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
var items = ["Buy Food", "Cook Food", "Eat Food"];
const PORT = 3192;
app.set("view engine", "ejs");

app.use(express.static("style"))
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/todolistDB", 
{useNewUrlParser:true})
.then(()=>console.log('Connection Granted'))
.catch(e=>console.log(e));

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name:"Welcome"
});

const item2 = new Item({
    name:"Please take a sit"
});

const item3 = new Item({
    name:"Enjoy your own list"
});

const defaultItem = [item1, item2, item3];



app.get("/", function(req, res) {

   

    var today = new Date();
    var currentDay = today.getDay();
    var todayy = new Date();
    var day = "";
    var options = {
        weekday: "long", 
        month: "long",
        day: "numeric",
       
    };

    var dayn = todayy.toLocaleDateString("en-US", options);

  switch(currentDay){
      case 0:
          day = "Sunday"
          break;
          case 1:
          day = "Monday"
          break;
          case 2:
          day = "Tuesday"
          break;
          case 3:
          day = "Wednesday"
          break;
          case 4:
          day = "Thursday"
          break;
          case 5:
          day = "Friday"
          break;
          case 6:
          day = "Saturday"
          break;
        
          default:
              console.log("Error: current day is equal to:" + currentDay)
  }
  Item.find({}, function(err, foundItems){
      if(foundItems.length === 0){
        Item.insertMany(defaultItem, function(err){
            if(err){
                console.log(err)
            }else{
                console.log("Successfully Saved")
            }
        })
        res.redirect("/");
      }else {
           res.render("list", 
    {
        kindOfDay: dayn, 
        ndOfDay:day,
        newListItems: foundItems,
    })
      }
   
})

});

app.post("/", function(req,res) {
   const itemName = req.body.newItem;

   const item = new Item({
       name:itemName
   });
   item.save();

   res.redirect("/");
  
})

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox
    Item.findByIdAndDelete(checkedItemId, function(err){
        if(!err){
            console.log("Successfully Deleted checked item")
            res.redirect("/");
        }
    })
})

app.listen(PORT, function(){
    console.log("Server Connected")
});
