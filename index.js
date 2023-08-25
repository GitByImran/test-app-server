const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.AUTH}:${process.env.PASS}@cluster0.gw3j1qn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {

        const productCollection = client.db('test-data').collection('products');

        app.get('/', (req, res) => {
            res.send('Server is running');
        });

        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        });

        app.put('/products', async (req, res) => {
            const newProduct = req.body;
            const result = productCollection.insertOne(newProduct)
            res.send(result)
        });

        app.patch('/products/:id', async (req, res) => {
            const productId = req.params.id;
            const updatedFields = req.body;
            const query = { _id: new ObjectId(productId) };

            try {
                const result = await productCollection.updateOne(query, { $set: updatedFields });
                res.send(result);
            } catch (error) {
                console.error('Error updating product:', error);
                res.status(500).send({ error: 'Error updating product' });
            }
        });


        app.delete('/products/:id', async (req, res) => {
            const productId = req.params.id;
            const query = { _id: new ObjectId(productId) }
            const result = await productCollection.deleteOne(query);
            res.send(result)
        });


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {

    } finally {
    }
}

run().catch(console.dir);

app.listen('5000', () => {
    console.log('connected to server')
})
