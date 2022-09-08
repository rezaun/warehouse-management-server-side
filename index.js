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