import React from 'react'

export default function Main() {
    const [todos, setTodos] = React.useState([]);
    
    const listOfTodos = todos.map((todo) => (
        <li key={todo.id}>
            <span>{todo.description}</span>
            <button>{todo.isdone ? "Done" : "Pending"}</button>
        </li>
    ))

    React.useEffect(() => {
        fetch("http://localhost:8080/todo/all")
            .then(result => result.json())
            .then(json => {
            setTodos(json);
            }
        )
    }, []);

    return (
        <ul>
            {listOfTodos}
        </ul>
    )
}