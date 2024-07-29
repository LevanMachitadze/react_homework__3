import React, { useState, useEffect } from "react";
import apiRequest from "./apiRequest";
import "./Todo.css"

const TodoList = () => {
    const [loading, setLoading] = useState(true);
    const [thingsToDo, setThingsToDo] = useState([]);
    const [newthingsToDo, setNewThingsToDo] = useState({ list: "" });
    const [isDone, setIsDone] = useState(true)
    const [error, setError] = useState(null);
    
    const fetchList = async () => {
        const url = 'http://localhost:3500/toDos';
        setLoading(true);
        const data = await apiRequest(url);
        setLoading(false);
    
        if (data.error) {
          setError(data.error);
        } else {
          setThingsToDo(data);
        }
    };

    const removeList = async (id) => {
        const url = `http://localhost:3500/toDos/${id}`;
        const options = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const data = await apiRequest(url, options);
        if (data.error) {
          setError(data.error);
        } else {
          setThingsToDo((prevList) => prevList.filter((list) => list.id !== id));
        }
    };

    const todoThings = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:3500/toDos';
    
        const listsToAdd = {
          name: newthingsToDo.list,
        };
    
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(listsToAdd),
        };
    
        const data = await apiRequest(url, options);
        if (data.error) {
          setError(data.error);
        } else {
          setThingsToDo((prevList) => [...prevList, data]);
          setNewThingsToDo({ list: '' });
        }
    };
    
    useEffect(() => {
        fetchList();
    }, []);


    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

   
    return (
        <>
            <div className="main_container">
                <form onSubmit={todoThings}>
                    <label>
                        <input type="text" value={newthingsToDo.list} onChange={(e) => setNewThingsToDo({ list: e.target.value })} />
                    </label>
                  
                    <button type="submit">Add</button>
                </form>
                <ul>
                    {thingsToDo.map((thing) => (
                        <li className="list" key={thing.id}>
                            <h2>{thing.name}</h2>
                            <button ></button>
                            <button onClick={() => removeList(thing.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default TodoList;