import { useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import Weather from './components/Weather';
import Notepad from './components/Notepad';

function App() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('#282c34');
  const [activeWidget, setActiveWidget] = useState('all'); // 'all', 'todo', 'weather', 'notes'

  const colors = ['#282c34', '#2c5282', '#285228', '#522828', '#522882'];

  const handleColorChange = () => {
    const currentIndex = colors.indexOf(color);
    const nextIndex = (currentIndex + 1) % colors.length;
    setColor(colors[nextIndex]);
  };

  const renderWidget = () => {
    switch(activeWidget) {
      case 'todo':
        return <TodoList />;
      case 'weather':
        return <Weather />;
      case 'notes':
        return <Notepad />;
      default:
        return (
          <div className="widgets-container">
            <TodoList />
            <Notepad />
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: color }}>
        <Weather />
        <h1>Merhaba Dünya!</h1>
        <div className="counter-section">
          <p>Sayaç: {count}</p>
          <div className="button-group">
            <button onClick={() => setCount(count - 1)}>Azalt</button>
            <button onClick={() => setCount(0)}>Sıfırla</button>
            <button onClick={() => setCount(count + 1)}>Artır</button>
          </div>
          <button className="color-button" onClick={handleColorChange}>
            Arka Plan Rengini Değiştir
          </button>
        </div>

        <nav className="widget-nav">
          <button 
            className={activeWidget === 'all' ? 'active' : ''} 
            onClick={() => setActiveWidget('all')}
          >
            Tümü
          </button>
          <button 
            className={activeWidget === 'todo' ? 'active' : ''} 
            onClick={() => setActiveWidget('todo')}
          >
            Yapılacaklar
          </button>
          <button 
            className={activeWidget === 'notes' ? 'active' : ''} 
            onClick={() => setActiveWidget('notes')}
          >
            Notlar
          </button>
        </nav>
        
        {renderWidget()}
      </header>
    </div>
  );
}

export default App; 