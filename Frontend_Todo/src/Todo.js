import { useEffect, useState } from "react";
import axios from "axios";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  const apiUrl = "https://todo-server-flax.vercel.app"; // Updated server link

  // Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      try {
        await axios.post(`${apiUrl}/todos`, { title, description });
        setTodos([...todos, { title, description }]);
        setTitle("");
        setDescription("");
        setMessage("Item added successfully");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch {
        setError("Unable to create Todo item");
      }
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/todos`);
      setTodos(response.data);
    } catch {
      setError("Failed to fetch todos");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = async () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      try {
        await axios.put(`${apiUrl}/todos/${editId}`, {
          title: editTitle,
          description: editDescription,
        });
        const updatedTodos = todos.map((item) => {
          if (item._id === editId) {
            item.title = editTitle;
            item.description = editDescription;
          }
          return item;
        });
        setTodos(updatedTodos);
        setEditTitle("");
        setEditDescription("");
        setMessage("Item updated successfully");
        setTimeout(() => {
          setMessage("");
        }, 3000);
        setEditId(-1);
      } catch {
        setError("Unable to update Todo item");
      }
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await axios.delete(`${apiUrl}/todos/${id}`);
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      } catch {
        setError("Unable to delete Todo item");
      }
    }
  };

  return (
    <>
      <div className="row p-3 bg-dark text-light">
        <h1 className="text-center">ToDo Project</h1>
      </div>
      <div className="container my-4">
        <h3 className="text-dark">Add Task</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="input-group mb-3">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-success" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}

        <h3 className="text-dark mt-4">Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item d-flex justify-content-between align-items-center mb-2"
              style={{ borderRadius: "10px", backgroundColor: "#f8f9fa" }}
            >
              <div className="d-flex flex-column">
                {editId === -1 || editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                ) : (
                  <>
                    <div className="d-flex gap-2">
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="d-flex gap-2">
                {editId === -1 ? (
                  <>
                    <button
                      className="btn btn-warning text-light"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-success" onClick={handleUpdate}>
                      Update
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}










// import { useEffect, useState } from "react";

// export default function Todo() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [todos, setTodos] = useState([]);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [editId, setEditId] = useState(-1);
//   const apiUrl = "http://localhost:8000";

//   // Edit
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");

//   const handleSubmit = () => {
//     setError("");
//     if (title.trim() !== "" && description.trim() !== "") {
//       fetch(apiUrl + "/todos", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title, description }),
//       })
//         .then((res) => {
//           if (res.ok) {
//             setTodos([...todos, { title, description }]);
//             setTitle("");
//             setDescription("");
//             setMessage("Item added successfully");
//             setTimeout(() => {
//               setMessage("");
//             }, 3000);
//           } else {
//             setError("Unable to create Todo item");
//           }
//         })
//         .catch(() => {
//           setError("Unable to create Todo item");
//         });
//     }
//   };

//   useEffect(() => {
//     getItems();
//   }, []);

//   const getItems = () => {
//     fetch(apiUrl + "/todos")
//       .then((res) => res.json())
//       .then((res) => {
//         setTodos(res);
//       });
//   };

//   const handleEdit = (item) => {
//     setEditId(item._id);
//     setEditTitle(item.title);
//     setEditDescription(item.description);
//   };

//   const handleUpdate = () => {
//     setError("");
//     if (editTitle.trim() !== "" && editDescription.trim() !== "") {
//       fetch(apiUrl + "/todos/" + editId, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title: editTitle, description: editDescription }),
//       })
//         .then((res) => {
//           if (res.ok) {
//             const updatedTodos = todos.map((item) => {
//               if (item._id === editId) {
//                 item.title = editTitle;
//                 item.description = editDescription;
//               }
//               return item;
//             });
//             setTodos(updatedTodos);
//             setEditTitle("");
//             setEditDescription("");
//             setMessage("Item updated successfully");
//             setTimeout(() => {
//               setMessage("");
//             }, 3000);
//             setEditId(-1);
//           } else {
//             setError("Unable to update Todo item");
//           }
//         })
//         .catch(() => {
//           setError("Unable to update Todo item");
//         });
//     }
//   };

//   const handleEditCancel = () => {
//     setEditId(-1);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete?")) {
//       fetch(apiUrl + "/todos/" + id, {
//         method: "DELETE",
//       }).then(() => {
//         const updatedTodos = todos.filter((item) => item._id !== id);
//         setTodos(updatedTodos);
//       });
//     }
//   };

//   return (
//     <>
//       <div className="row p-3 bg-dark text-light">
//         <h1 className="text-center">ToDo Project</h1>
//       </div>
//       <div className="container my-4">
//         <h3 className="text-dark">Add Task</h3>
//         {message && <p className="text-success">{message}</p>}
//         <div className="input-group mb-3">
//           <input
//             placeholder="Title"
//             onChange={(e) => setTitle(e.target.value)}
//             value={title}
//             className="form-control"
//             type="text"
//           />
//           <input
//             placeholder="Description"
//             onChange={(e) => setDescription(e.target.value)}
//             value={description}
//             className="form-control"
//             type="text"
//           />
//           <button className="btn btn-success" onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//         {error && <p className="text-danger">{error}</p>}

//         <h3 className="text-dark mt-4">Tasks</h3>
//         <ul className="list-group">
//           {todos.map((item) => (
//             <li
//               key={item._id}
//               className="list-group-item d-flex justify-content-between align-items-center mb-2"
//               style={{ borderRadius: "10px", backgroundColor: "#f8f9fa" }}
//             >
//               <div className="d-flex flex-column">
//                 {editId === -1 || editId !== item._id ? (
//                   <>
//                     <span className="fw-bold">{item.title}</span>
//                     <span>{item.description}</span>
//                   </>
//                 ) : (
//                   <>
//                     <div className="d-flex gap-2">
//                       <input
//                         placeholder="Title"
//                         onChange={(e) => setEditTitle(e.target.value)}
//                         value={editTitle}
//                         className="form-control"
//                         type="text"
//                       />
//                       <input
//                         placeholder="Description"
//                         onChange={(e) => setEditDescription(e.target.value)}
//                         value={editDescription}
//                         className="form-control"
//                         type="text"
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
//               <div className="d-flex gap-2">
//                 {editId === -1 ? (
//                   <>
//                     <button
//                       className="btn btn-warning text-light"
//                       onClick={() => handleEdit(item)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-danger"
//                       onClick={() => handleDelete(item._id)}
//                     >
//                       Delete
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button className="btn btn-success" onClick={handleUpdate}>
//                       Update
//                     </button>
//                     <button
//                       className="btn btn-secondary"
//                       onClick={handleEditCancel}
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );

// }




// // import { useEffect,useState } from "react";

// // export default function Todo(){
// //     const [title,setTitle]=useState("");
// //     const [description,setDescription]=useState("");
// //     const[todos,setTodos]=useState([]);
// //     const [error,setError]=useState("");
// //     const [message,setMessage]=useState("");
// //     const[editId,setEditId]=useState(-1);
// //     const apiUrl="http://localhost:8000"

// //     //Edit
// //     const [editTitle,setEditTitle]=useState("");
// //     const [editDescription,setEditDescription]=useState("");
     
// //     const handleSubmit=()=>{
// //         setError("")
// //         //check inputs
// //         if(title.trim()!=='' && description.trim()!=='' ){
// //              fetch(apiUrl+"/todos",{
// //                 method:"POST",
// //                 headers:{
// //                     'Content-Type':'application/json',
// //                 },
// //                 body :JSON.stringify({title,description})
// //              }).then((res)=>{
// //                 if(res.ok){
// //                     // add item to list
// //                     setTodos([...todos,{title,description}])
// //                     setTitle("");
// //                     setDescription("")
// //                     setMessage("Item added successfully")
// //                     setTimeout(()=>{
// //                         setMessage("");
// //                     },3000)
// //                 }else{
// //                     //set Error
// //                     setError("Unable to create Todo item") 
// //                 }
                
// //              }).catch(()=>{
// //                 setError("Unable to create Todo item") 
// //              })
             
// //         }

// //     }

// //     useEffect(()=>{
// //       getItems()
// //     },[]);

// //     const getItems=()=>{
// //         fetch(apiUrl+"/todos")
// //         .then((res)=>res.json())
// //         .then((res)=>{
// //             setTodos(res)
// //         })
// //     }

// //     const handleEdit=(item)=>{
// //         setEditId(item._id);
// //         setEditTitle(item.title);
// //         setEditDescription(item.description)
// //     }

// //     const handleUpdate=()=>{
// //         setError("")
// //         //check inputs
// //         if(editTitle.trim()!=='' && editDescription.trim()!=='' ){
// //              fetch(apiUrl+'/todos/'+ editId,{
// //                 method:"PUT",
// //                 headers:{
// //                     'Content-Type':'application/json',
// //                 },
// //                 body :JSON.stringify({title:editTitle,description:editDescription})
// //              }).then((res)=>{
// //                 if(res.ok){
// //                     // update item to list
// //                     const updatedTodos=todos.map((item)=>{
// //                         if(item._id===editId){
// //                             item.title=editTitle;
// //                             item.description=editDescription;
// //                         }
// //                         return item;
// //                     })
// //                     setTodos(updatedTodos)
// //                     setEditTitle("");
// //                     setEditDescription("");
// //                     setMessage("Item updated successfully")
// //                     setTimeout(()=>{
// //                         setMessage("");
// //                     },3000)
// //                     setEditId(-1)

// //                 }else{
// //                     //set Error
// //                     setError("Unable to create Todo item") 
// //                 }
                
// //              }).catch(()=>{
// //                 setError("Unable to create Todo item") 
// //              })
             
// //         }

// //     }

// //     const handleEditCancel=()=>{
// //         setEditId(-1)
// //     }

// //     const handleDelete=(id)=>{
// //         if(window.confirm('Are you sure Want to delete ?')){
// //             fetch(apiUrl+'/todos/'+id,{
// //                 method:"DELETE"
// //             })
// //             .then(()=>{
// //                 const updatedTodos=todos.filter((item)=>item._id!==id)
// //                 setTodos(updatedTodos)
// //             })
// //         }
// //     }



// //     return <>
// //     <div className="row p-3 bg-success text-light">
// //         <h1>ToDo Project with MERN stack</h1>
// //     </div>
// //     <div className="row">
// //         <h3>Add Item</h3>
// //         {message && <p className="text-success">{message}</p>}
// //         <div className="form-group d-flex gap-2" >
// //             <input  placeholder= "Title" onChange={(e)=>setTitle(e.target.value)} value={title} className="form-control"type="text" />
// //             <input  placeholder= "Description" onChange={(e)=>setDescription(e.target.value)} value={description} className="form-control"type="text" />
// //             <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
// //         </div>
// //         {error && <p className="text-danger">{error}</p>}

// //     </div>
// //     <div className="row mt-3">
// //         <h3>Tasks</h3>
// //         <div className="col-md-6">
// //         <ul className="list-group">
// //             {
// //               todos.map((item)=> <li className="list-group-item d-flex justify-content-between align-items-center my-2">
// //               <div className="d-flex flex-column me-2">

// //                 {
// //                     editId ===-1 || editId!==item._id?<>
// //                     <span className="fw-bold">{item.title}</span>
// //                     <span>{item.description}</span>
// //                     </> : <>
// //                     <div className="form-group d-flex gap-2" >
// //                     <input  placeholder= "Title" onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} className="form-control"type="text" />
// //                      <input  placeholder= "Description" onChange={(e)=>setEditDescription(e.target.value)} value={editDescription} className="form-control"type="text" />
              
// //                     </div>
// //                     </>
// //                 }
                
// //               </div>
              
// //               <div className="d-flex gap-2">
// //                  {editId ===-1  ? <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>:<button onClick={handleUpdate}>Update</button>}
// //                  {editId ===-1 ?<button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button> :
// //                  <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
// //               </div>
              
// //             </li>
// //             )  
// //             }
          

            
            
// //         </ul>
// //         </div>
       
// //     </div>
// //     </>
// // }

// // // || editId!==item._id
