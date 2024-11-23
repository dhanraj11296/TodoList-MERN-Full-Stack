//Using Express
const express=require("express")
//Initailizing mongoose (npm install mongoose)
const mongoose=require("mongoose")

//A middleware to autenticate request in frontend
const cors=require("cors")  

const app=express()

app.use(express.json()) //This is a middleware used to read the JSON from postman
app.use(cors())

//1. Create a new todo item and test it using postman

//1.const todos=[]    //We cannot only store datas temporarly, so replacing with mangoose

//3.Connecting MongoDB
mongoose.connect("mongodb://localhost:27017/mern-app")
.then(()=>{
    console.log("DB Connected!")
})
.catch((err)=>{
    console.log(err)
})

//4. Creating Schema
const todoSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    },
})

//5. Creating Model
const todoModel=mongoose.model("Todo", todoSchema)

//1.
app.post("/todos", async (req,res)=>{
    const {title,description}=req.body

    //1.Initially we used this values, since not used mongoDB for storing values
    // const newTodo={
    //     id:todos.length+1,
    //     title,
    //     description
    // }
    // todos.push(newTodo)
    // console.log(todos)

//5.    
    try{
       const newTodo=new todoModel({title,description})
       await newTodo.save()
       res.status(201).json(newTodo)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message})  //If we change the key value or type, we get error
    }

    //1.
    //res.status(201).json(newTodo) // This will be shown in postman as status, if created
})


//2. Get all items
//5.Get all items using mongoDB
app.get("/todos",async(req,res)=>{
    try{
        const todos=await todoModel.find()
        res.json(todos)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message})  //If we change the key value or type, we get error
    }    

     //2.
    //res.json(todos)
})

//6.Update todo item using PUT
app.put("/todos/:id", async(req,res)=>{

    try{
        const {title,description}=req.body 
        const id=req.params.id 

        //todoModel.findByIdAndUpdate used to find and update previous values
        const updatedTodo=await todoModel.findByIdAndUpdate(  
            id,
            {title,description},
            {new:true}  //We give this value so that the old items gets replaced with new updated items
        )
        // If values are not updated it results error
        if(!updatedTodo){
            return res.status(404).json({message:"Todo not found"})
        }
        res.json(updatedTodo)
    }
    //To get error if key or type changed
    catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }

})

//7.Delete a todo Item
app.delete("/todos/:id", async(req,res)=>{
    try{
        const id=req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error.message})        
    }
})

const port=8000
app.listen(port,()=>{
    console.log("Server is running at port"+port)
})