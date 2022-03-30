//jshint eversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to aff a new item."
});

const item3 = {
  name: "<--Hit this to delete an item."
};

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully saved default item to DB");
  }
});

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  Item.push(req.body.newItem);

  res.render("list", { listTitle: "Today", newListsItems: Item });
});

app.post("/delete", function (req, res) {
  const arrIndex = Item.findIndex((item) => item === req.body.deleteItem);

  arrIndex !== -1 && Item.splice(arrIndex, 1);

  res.render("list", {
    Item
  });
});

app.listen(3000, function () {
  console.log("Serve started on port 3000");
});
