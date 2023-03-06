const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const _ = require('lodash');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const todolistSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    }
});

const listSchema = new mongoose.Schema({
    listName: String,
    listItems:[todolistSchema]  
});

const Item = mongoose.model('Item', todolistSchema);
const List = mongoose.model('List',listSchema);

const defaultValue = new Item({
    itemName:"Byyeee"
});
let todayDay = date.getDate();

app.get('/', async function (req, res) {
    
    const item = await getItem();
    res.render('list', { listTitle: todayDay, listItem: item});

});


app.post("/", async function(req,res){

    let item = req.body.newItem;
    let collection = req.body.button;

    if(collection == todayDay){
        await insertItem(item);
        res.redirect('/');
    }
    else{
        
        await updatelistItem(collection,item);
        res.redirect(`/${collection}`);
    }
});


app.post('/delete', async (req,res) =>{
    
    const item = req.body.checkbox;
    const collection = item[1];

      
    if(collection == todayDay){
        await deleteItem(item[0]);
        res.redirect('/');
    }
    else{
        await deletelistItem(collection,item[0]);
        res.redirect(`/${collection}`);
    }
});


app.get('/:listName', async (req, res) =>{
    
    const todolist = _.capitalize(req.params.listName);
    const created = await findlistOne(todolist);
  
    
    if(created == null){
        const item = new List({
            listName: todolist,
            listiItems:[]
        });
        item.save();
        res.redirect(`/${todolist}`);

    } 
    else{
        res.render('list', {listTitle:todolist, listItem: created.listItems})
    }

});





app.listen(process.env.PORT || 3000, function () {
    console.log("Server listening on port 3000");
})



async function getItem(){
    try{
        const result = await Item.find();
        return result;
    }
    catch(err){
        console.log(err);
    }
}

async function insertItem(value){
    try{
       
        const todo = new Item({
            itemName: value    
            });
        await todo.save();
    }
    catch(err){
        console.log(err);
    }
}
async function updatelistItem(collection,value){
    try{
        await List.findOneAndUpdate(
            {listName:collection},
            { 
                $push: {listItems: {itemName: value}}
            });
    }
    catch(err){
        console.log(err);
    }
}

async function deleteItem(value){
    try{
        await Item.deleteOne({_id: value});
        
    }
    catch(err){
        console.log(err);
    }
}
async function deletelistItem(collection, value){
    try{
        await List.findOneAndUpdate({listName:collection},
            {$pull:
                {listItems:{_id:value}}
            });
        
    }
    catch(err){
        console.log(err);
    }
}

async function findlistOne(value){
    try{
        const result = await List.findOne({listName:value});
        return result;
    }
    catch(err){
        console.log(err);
    }
}
