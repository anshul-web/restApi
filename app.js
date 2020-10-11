const express = require('express');
const app = express();
const port = process.env.PORT || 8900;
const cors = require('cors');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const mongoUrl = "mongodb+srv://anshul:mongo123@cluster0.nobuk.mongodb.net/assignment?retryWrites=true&w=majority";
const bodyParser = require('body-parser');

let db;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
///listPage api//
app.get('/restaurantList/:mealtype',(req,res)=>{
    var query={"type.mealtype":req.params.mealtype};
    var sort={cost:1};
    if(req.query.city){
        query={"city":req.query.city,"type.mealtype":req.params.mealtype}
    }else if(req.query.cuisine){
        query={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
    }else if(req.query.lcost && req.query.hcost){
        query={"type.mealtype":req.params.mealtype,"cost":{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
    }else if(req.query.sort){
        sort={cost:Number(req.query.sort)};
    }
    
    db.collection('restaurant').find(query).sort(sort).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
});
})
/*restaurant detail*/
app.get(('/restaurant'),(req,res)=>{
    var query={};
    if (req.query.city){
        query={"city":req.query.city}
    } else if (req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    } else if (req.query.id){
        query={"_id":req.query.id}
    }
    db.collection('restaurant').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
});
})

//orders
app.get('/orders',(req,res) => {
    db.collection('orders').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

//placeorder
app.post('/placeorder',(req,res) => {
    db.collection('orders').insertOne(req.body,(err,result) => {
        if(err){
            throw err
        }else{
            res.send('Data Added')
        }
    })
});


/*location detail*/
app.get(('/location'),(req,res)=>{
    db.collection('citydata').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
});
})

app.get(('/city'),(req,res)=>{
    db.collection('city').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
});
})

app.get(('/mealtype'),(req,res)=>{
    db.collection('mealtype').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
});
})

mongoClient.connect(mongoUrl,{useNewUrlParser:true},(err,client)=>{
    if(err) console.log(err);
    db=client.db('assignment');
    app.listen(port,(err)=>{
        if(err) throw err;
        console.log(`server is running on port ${port}`);
    });
})