const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.13qkung.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db('my-choice').collection('products');

       
        app.get('/product', async(req, res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const allProducts = await cursor.toArray();
            res.send(allProducts);
        });

        app.get('/product/:id', async(req, res) =>{
            const id = req.params.id;            
            const query = {_id:ObjectId(id)}            
            const product = await productCollection.findOne(query);              
            res.send(product);

        });
        //update Quantity
        app.put('/updatequantity/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(id);
            // const updateDoc = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    quantity: req.body.addedQuantity
                },
            };
            const result = await productCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })


        //POST
        app.post('/product', async(req, res) =>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        //Delete
        app.delete('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }

}

run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('My Choice shop server running');
})

app.listen(port, () =>{
    console.log('Listening to port', port);
})