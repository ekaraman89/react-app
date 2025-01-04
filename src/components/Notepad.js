import { useState, useEffect } from 'react';
import './Notepad.css';

function Notepad() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [currentNote, setCurrentNote] = useState('');
  const [title, setTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (!title.trim() || !currentNote.trim()) return;
    
    setNotes([{
      id: Date.now(),
      title: title,
      content: currentNote,
      date: new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      color: getRandomColor()
    }, ...notes]);
    
    setTitle('');
    setCurrentNote('');
  };

  const deleteNote = (id) => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const getRandomColor = () => {
    const colors = [
      '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9',
      '#bbdefb', '#b3e5fc', '#b2ebf2', '#b2dfdb', '#c8e6c9',
      '#dcedc8', '#f0f4c3', '#fff9c4', '#ffecb3', '#ffe0b2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNoteModal = (note) => {
    setSelectedNote(note);
    document.body.style.overflow = 'hidden';
  };

  const closeNoteModal = () => {
    setSelectedNote(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="notepad-container">
      <div className="notepad-header">
        <h2>Not Defteri</h2>
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Notlarda ara..."
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="note-input">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Not başlığı..."
          className="title-input"
        />
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Notunuzu buraya yazın..."
          className="content-input"
        />
        <button 
          onClick={saveNote}
          className="save-button"
          disabled={!title.trim() || !currentNote.trim()}
        >
          Kaydet
        </button>
      </div>

      <div className="notes-grid">
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            className="note-card"
            style={{ backgroundColor: note.color }}
            onClick={() => note.content.length > 150 && openNoteModal(note)}
          >
            <div className="note-header">
              <h3>{note.title}</h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="delete-button"
              >
                ×
              </button>
            </div>
            <p className="note-content">
              {note.content.length > 150 
                ? note.content.slice(0, 150).trim() + '...'
                : note.content
              }
            </p>
            <small className="note-date">{note.date}</small>
          </div>
        ))}
        {filteredNotes.length === 0 && searchTerm && (
          <div className="no-results">
            Arama sonucu bulunamadı
          </div>
        )}
      </div>

      {selectedNote && (
        <div className="note-modal-overlay" onClick={closeNoteModal}>
          <div 
            className="note-modal"
            style={{ backgroundColor: selectedNote.color }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{selectedNote.title}</h3>
              <button onClick={closeNoteModal} className="close-modal">×</button>
            </div>
            <div className="modal-content">
              <p>{selectedNote.content}</p>
              <small className="note-date">{selectedNote.date}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notepad; 