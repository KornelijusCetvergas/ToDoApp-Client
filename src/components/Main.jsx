import React, {useState, useEffect} from 'react';
import Axios from 'axios';

export default function Main() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = "http://localhost:8080/todo"

    const listOfTodos = todos.map((todo) => (
        <li key={todo.id}>
            <button onClick={() => toggleIsDone(todo.id)}>{todo.isDone ? "Done" : "Pending"}</button>
            <span
                style={{
                textDecoration: todo.isDone
                    ? 'line-through'
                    : 'none',
                }}
            >{todo.description}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
    ))

    function deleteTodo(id) {
        const handleDelete = async () => {
            try {
                const response = await Axios.delete(url + "/" + id)
                //console.log(response);
                if (response.status >= 200 && response.status < 300) {
                    setTodos(todos.filter(todo => todo.id !== id))
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
            } catch (error) {
                console.error('Error deleting data:', error);
                //alert("Could not delete the Todo, please try again later.");
            }
        }

        handleDelete();
    }

    function toggleIsDone(id) {
        
        const handlePatch = async () => {
            try {
                const response = await Axios.patch(url + "/" + id + "/toggle")
                if (response.status >= 200 && response.status < 300) {
                    setTodos( prev => prev.map( todo => {
                        if ( todo.id == id) {
                            return {...todo, isDone: !todo.isDone}
                        }
                        return todo;
                    }))
                }
            } catch (error) {
                console.error('Error updating data:', error);
                //alert("Could not update the Todo, please try again later")
            }
        }

        handlePatch();
    }
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(url + "/all");
                setTodos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                //alert("There was an issue with loading the Todo list, please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    function handleDeleteAllDone() {

        const deleteAllDone = async () => {
            try {
                const response = await Axios.delete(url + "/alldone")
                if (response.status >= 200 && response.status < 300) {
                    setTodos(todos.filter(todo => !todo.isDone));
                }
            } catch (error) {
                console.error("Error deleting all done todos: ", error);
            }
        }
        
        deleteAllDone();
    }

    function createTodo(formData) {
        const description = formData.get("task");
        //console.log("Added a new Todo: " + description);

        const handleCreate = async () => {
            try {
                const response = await Axios.post(url , { description })
                if (response.status >= 200 && response.status < 300) {
                    setTodos( prev => [...prev, response.data] )
                }
            } catch (error) {
                console.error("Error creating todo: ", error);
                //alert("Could not create the Todo, please try again later")
            }
        }

        handleCreate()
    };
    
    return (
        <main>
            <form action={createTodo} className="todo-form">
                <input 
                    className="todo-input"
                    type="text"
                    placeholder="Do the dishes"
                    name="task"
                />
                <button className='todo-add'>Add</button>
            </form>

            {loading ? (
                <p>Loading...</p>
            )  : (
                <ul>
                    {listOfTodos}
                </ul> 
            )}

            {todos.length === 0 ? (
                <></>
            ) : (
                <button onClick={handleDeleteAllDone}>Delete all completed tasks</button>
            )}

        </main>
    )
}