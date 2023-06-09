const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())

// _______________________________MONGODB START______________________________________________

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const usersCollection = client.db('musicianDb').collection('users')

    // --------------------------classes Related
    // Insert a class : Instructor
    app.post('/classes',async(req,res)=>{
        const newClass = req.body

        const result = await classesCollection.insertOne(newClass)
        res.send(result)
    })
    // update a class : Instructor
    app.patch('/classesInstructor/:id',async(req,res)=>{
      const id = req.params.id
      const newClass = req.body

      // const result = await classesCollection.insertOne(newClass)
      res.send(newClass)
  })
    // delete a class : Instructor
    app.delete('/classesInstructor/:id',async(req,res)=>{
        const id = req.params.id
        

        const result = await classesCollection.deleteOne({_id:new ObjectId(id)})
        res.send(result)
    })
    // get all classes
    app.get('/classes',async(req,res)=>{
        const result = await classesCollection.find().toArray()
        res.send(result)
    })
    // get  classes
    app.get('/classes/:email',async(req,res)=>{
        const email = req.params.email
        const query = {instructorEmail:email}
        const result = await classesCollection.find(query).toArray()
        res.send(result)
    })
    // update classes : Admin
    app.patch('/classes/:id',async(req,res)=>{
    
        const id = req.params.id
        const status = req.query.status
        const body = req.body || ''
        // 
        let updateDoc;
        if(status === 'deny'){
             updateDoc = {
                $set: {
                  status: `${status}`,
                  feedback: body.feedback,
                },
              };
        }else{
            updateDoc = {
                $set: {
                  status: `${status}`,
                },
                $unset:{
                    feedback:1,
                }
              };
        }
        const query = {_id : new ObjectId(id)}
        const result = await classesCollection.updateOne(query,updateDoc)
        res.send(result)
    })
    // --------------------------users Related
    //  insert a user 
    app.post('/users',async(req,res)=>{
      const user = req.body
      const query = {email:user.email}
      const existingUser = await usersCollection.findOne(query)
      if(existingUser){
       return res.send({result:'user exits',exits:true})
      }
       const result = await usersCollection.insertOne(user)
      // console.log(existingUser)
      res.send(result)

    })
    //  isAdmin Check
    app.get('/users/:email',async(req,res)=>{
      const email = req.params.email
      const query = {email:email}
      const result = await usersCollection.findOne(query)
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