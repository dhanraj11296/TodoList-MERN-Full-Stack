import React from 'react'
import {useEffect,useState} from "react"

function Todo() {
   
    const [title,settitle]=useState("")
    const [description,setdescription]=useState("")
    const [todos,setTodos]=useState([])
    const [error,setError]=useState("")
    const [message,setMessage]=useState("")

    const [editId,setEditId]=useState(-1)
    const [editTitle,setEditTitle]=useState("")
    const [editDescription,setEditDescription]=useState("")

    const apiUrl="http://localhost:8000"


    const onChangeTitle=(event)=>{
        settitle(event.target.value)
    }

    const onChangeDescription=(event)=>{
        setdescription(event.target.value)
    }  
    
    
//GET Request    
useEffect(()=>{  

    const getItems = async () => {
        try {
            const response = await fetch(apiUrl+"/todos");
    
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            setTodos(data);
        } 
        catch (error) {
            setError("Error fetching todos: " + error.message);
        }
    };

    getItems()
},[])   


    //POST Request
    const handleSubmit=async()=>{
        if (title.trim() !== '' && description.trim() !== '') {
            try {
                const response = await fetch(apiUrl+"/todos", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, description }),
                });
        
                if (response.ok) {
                    // Add item to list
                    const newTodos={
                        title:title,
                        description:description
                    }
                    setTodos([...todos,newTodos]);
                    settitle("");
                    setdescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } 
                else {
                    // Set error
                    setError("Unable to create Todo item");
                }
            } 

            catch (error) {
                setError("Unable to create Todo item");
            }
        }
    }


//PUT Request
    const handleEdit = (item) => {
        setEditId(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description)
    }

    const handleUpdate = () => {
        setError("")
        
        if (editTitle.trim() !== '' && editDescription.trim() !== '') 
            {
            fetch(apiUrl+"/todos/"+editId, {
                method: "PUT",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title: editTitle, description: editDescription})
            }).then((res) => {
                if (res.ok) {
                    //update item to list
                    const updatedTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })

                    setTodos(updatedTodos)
                    setEditTitle("");
                    setEditDescription("")
                    setMessage("Item updated successfully")
                    setTimeout(() => {
                        setMessage("");
                    },3000)

                    setEditId(-1)
    
                }else {
                    //set error
                    setError("Unable to create Todo item")
                }
            }).catch(() => {
                setError("Unable to create Todo item")
            })
        }
    }

    const handleEditCancel = () => {
        setEditId(-1)
    }

//Delete Request    
    const handleDelete = (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            fetch(apiUrl+'/todos/'+id, {
                method: "DELETE"
            })
            .then(() => {
               const updatedTodos = todos.filter((item) => item._id !== id)
               setTodos(updatedTodos)
            })
        }
    }    

 
  return (
    <>
    <div className="row p-3 bg-success text-light">
        <h1>Todo Components</h1>
    </div>
    <div className="row my-4">
        <h3>Add Your Movie List</h3>
        {message&&<p className="text-success">{message}</p>}
        <div className="d-flex gap-2">
            <input type="text" placeholder="Title" value={title} onChange={onChangeTitle}/>
            <input type="description" placeholder="Description" value={description} onChange={onChangeDescription}/>
            <button className="btn-success" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <ul className="list-group">
                {todos.map((i)=>(
                    <li className="list-group-item bg-warning d-flex justify-content-between align-items-center my-2">
                        <div className="d-flex flex-column me-2">
                            {
                                editId==-1 || editId!==i._id? 
                                <>
                                    <span className="fw-bold">{i.title}</span>
                                    <span className="fw-bold">{i.description}</span>
                                </>
                                :
                                <>
                                <div className="form-group d-flex gap-2">
                                    <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text" />
                                    <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text" />
                                </div>                                
                                </>
                            }
                        </div>
                        <div className="d-flex gap-2">
                            { editId == -1 ?<button className="btn btn-secondary" onClick={() => handleEdit(i)} >Edit</button>
                            :
                            <button className="btn btn-secondary" onClick={handleUpdate} >Update</button>}

                            { editId == -1 ? <button className="btn btn-danger" onClick={() => handleDelete(i._id)}>Delete</button> :
                            <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button> }
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    </div>
    </>
  )
}

export default Todo