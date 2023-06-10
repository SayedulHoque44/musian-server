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
    const enrollCollection = client.db('musicianDb').collection('enroll')

    // --------------------------classes Related
    // Insert a classes : Instructor
    app.post('/classes',async(req,res)=>{
        const newClass = req.body

        const result = await classesCollection.insertOne(newClass)
        res.send(result)
    })
    
    // update a classes : Instructor
    app.patch('/classesInstructor/:id',async(req,res)=>{
      const id = req.params.id
      const newClass = req.body
      const query = {_id:new ObjectId(id)}
      const updateDoc = {
        $set:{...newClass}
      }

      const result = await classesCollection.updateOne(query,updateDoc)
      res.send(result)
  })
    // delete a classes : Instructor
    app.delete('/classesInstructor/:id',async(req,res)=>{
        const id = req.params.id
        const result = await classesCollection.deleteOne({_id:new ObjectId(id)})
        res.send(result)
    })
    // get all classes
    app.get('/AllClasses',async(req,res)=>{
      const result = await classesCollection.find().toArray()
      res.send(result)
    })
    // get status wise class for only user : My Class 
    app.get('/StatusClasses/:status',async(req,res)=>{
      const status = req.params.status
      const result = await classesCollection.find({status:status}).toArray()
      res.send(result)
  })
    // get  classes by email : instructor
    app.get('/classes/:email',async(req,res)=>{
        const email = req.params.email
        const query = {instructorEmail:email}
        const result = await classesCollection.find(query).toArray()
        return res.send(result)
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
    //  isAdmin Check
    app.get('/usersRole/:email',async(req,res)=>{
      const email = req.params.email
      const query = {email:email}
      const result = await usersCollection.findOne(query)
      res.send(result)

    })
    //  get all User : Admin
    app.get('/users',async(req,res)=>{
      
      const result = await usersCollection.find().toArray()
      res.send(result)

    })
    //  get all instructor : instructor page
    app.get('/allInstructor',async(req,res)=>{

      const query = {role:'instructor'}
      
      const result = await usersCollection.find(query).toArray()
      res.send(result)

    })
    //  Chang User Role : Admin
    app.patch('/userRoleChange/:id',async(req,res)=>{
      const id = req.params.id
      const role = req.body
      const query = {_id:new ObjectId(id)}
      const updateDoc = {
        $set:role
      }
      const result = await usersCollection.updateOne(query,updateDoc)
      res.send(result)

    })

    // Enroll Related : Student
    //  enroll class
    app.post('/enroll',async(req,res)=>{

      const newEnroll = req.body
      const result = await enrollCollection.insertOne(newEnroll);
      res.send(result)
    })
    // get enrolled class
    app.get('/enroll/:email',async(req,res)=>{

      const email = req.params.email 
      
      const result = await enrollCollection.find({email:email}).toArray()
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