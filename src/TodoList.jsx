import React, { useState, useEffect } from 'react';
import apiRequest from './apiRequest';
import './Todo.css';
import logo from './assets/Logo (1).png';

const TodoList = () => {
  const [loading, setLoading] = useState(true);
  const [thingsToDo, setThingsToDo] = useState([]);
  const [newthingsToDo, setNewThingsToDo] = useState({ list: '' });
  const [error, setError] = useState(null);
  const [number, setNumber] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [checkThings, setCheckThings] = useState(0);

  const fetchList = async () => {
    const url = 'http://localhost:3500/toDos';
    setLoading(true);
    const data = await apiRequest(url);
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      setThingsToDo(data);
      setNumber(data.length);
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
      setNumber((prev) => prev - 1);
      if (checkedItems[id]) {
        setCheckThings((prev) => prev - 1);
      }
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
      setNumber((prev) => prev + 1);
    }
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      const newCheckedItems = {
        ...prev,
        [id]: !prev[id],
      };

      const count = Object.values(newCheckedItems).filter(Boolean).length;
      setCheckThings(count);

      return newCheckedItems;
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className='main_container'>
        <div>
          <img src={logo} alt='Logo' />
        </div>
        <form onSubmit={todoThings}>
          <label>
            <input
              type='text'
              placeholder='Add a new task'
              value={newthingsToDo.list}
              onChange={(e) => setNewThingsToDo({ list: e.target.value })}
            />
          </label>
          <button type='submit'>Add</button>
        </form>
        <div className='about_tasks'>
          <div>
            <p>Task created {number}</p>
          </div>
          <div>
            <p>
              Completed {checkThings} of {number}
            </p>
          </div>
        </div>
        <div>
          <ul>
            {thingsToDo.map((thing) => (
              <li
                className='list'
                key={thing.id}
                style={{
                  textDecoration: checkedItems[thing.id]
                    ? 'line-through'
                    : 'none',
                  color: checkedItems[thing.id] ? 'silver' : 'white',
                }}
              >
                <label>
                  <input
                    type='checkbox'
                    className='checkbox'
                    checked={checkedItems[thing.id] || false}
                    onChange={() => handleCheckboxChange(thing.id)}
                  />
                  <h2>{thing.name}</h2>
                  <button onClick={() => removeList(thing.id)}>🗑️</button>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TodoList;
