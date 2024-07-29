import { useState } from 'react';
import TodoList from './TodoList';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TodoList />
    </>
  );
}

export default App;
