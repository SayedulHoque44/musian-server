const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())

// _______________________________MONGODB START______________________________________________

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.501jhgk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();
    // musicianDb classes

    // Collection
    
    const classesCollection = client.db('musicianDb').collection('classes')

    // classes Related
    // Insert a class
    app.post('/classes',async(req,res)=>{
        const newClass = req.body

        const result = await classesCollection.insertOne(newClass)
        res.send(result)
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// _______________________________MONGODB END______________________________________________

app.get('/', (req, res) => {
  res.send('Musician Is Here')
})

app.listen(port, () => {
  console.log(`Musician app listening on port ${port}`)
})