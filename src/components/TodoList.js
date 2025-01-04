import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos => {
      const newTodos = prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      return newTodos.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    });
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Tamamlanmış öğeleri her zaman sona koy
    const sortedItems = items.sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    setTodos(sortedItems);
  };

  // Görevleri tamamlanmış ve tamamlanmamış olarak ayır
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="todo-container">
      <h2>Yapılacaklar Listesi</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Yeni görev ekle..."
        />
        <button type="submit">Ekle</button>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul 
              className="todo-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sortedTodos.map((todo, index) => (
                <Draggable 
                  key={todo.id} 
                  draggableId={todo.id} 
                  index={index}
                  isDragDisabled={todo.completed}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${todo.completed ? 'completed' : ''} ${
                        snapshot.isDragging ? 'dragging' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <span>{todo.text}</span>
                      <button onClick={() => deleteTodo(todo.id)}>Sil</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TodoList; 