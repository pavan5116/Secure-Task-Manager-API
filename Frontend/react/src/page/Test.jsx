import React, { useState } from 'react';

export default function Test() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "", discription: "" });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setTasks(tasks.map(t => t.id === editingId ? { ...t, ...formData } : t));
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        completed: false,
        created_at: new Date().toLocaleString() 
      };
      setTasks([newTask, ...tasks]); // Adds new task to the TOP
    }
    setFormData({ title: "", discription: "" });
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '650px', margin: 'auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#4db8ff', marginBottom: '10px' }}>Task Dashboard</h1>
          <p style={{ color: '#888' }}>Final Year B.Sc Data Science Project</p>
        </header>

        {/* --- FORM SECTION --- */}
        <section style={cardStyle}>
          <h3 style={{ marginTop: 0, color: '#4db8ff' }}>
            {editingId ? "📝 Edit Task" : "🆕 Create Task"}
          </h3>
          <form onSubmit={handleSubmit}>
            <input 
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={inputStyle}
              required 
            />
            <textarea 
              placeholder="Description"
              value={formData.discription}
              onChange={(e) => setFormData({...formData, discription: e.target.value})}
              style={{ ...inputStyle, height: '100px', resize: 'none' }}
              required 
            />
            <button type="submit" style={{ 
              ...btnBase, 
              backgroundColor: editingId ? '#f39c12' : '#007bff',
              width: '100%',
              fontSize: '1rem'
            }}>
              {editingId ? "Update Task Details" : "Add to My List"}
            </button>
          </form>
        </section>

        {/* --- LIST SECTION --- */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            Active Tasks ({tasks.length})
          </h3>

          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>Your task list is empty. Start by adding one above!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} style={{ 
                ...cardStyle, 
                borderLeft: task.completed ? '6px solid #2ecc71' : '6px solid #3498db',
                opacity: task.completed ? 0.8 : 1,
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ 
                      margin: 0, 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#2ecc71' : '#fff'
                    }}>
                      {task.title}
                    </h4>
                    <p style={{ color: '#bbb', fontSize: '0.95rem', margin: '8px 0' }}>{task.discription}</p>
                    <small style={{ color: '#666', fontSize: '0.8rem' }}>Created: {task.created_at}</small>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => toggleComplete(task.id)} style={{ ...btnAction, backgroundColor: '#2c3e50' }}>
                    {task.completed ? "↩️ Reopen" : "✅ Done"}
                  </button>
                  <button onClick={() => { setEditingId(task.id); setFormData({ title: task.title, discription: task.discription }); }} 
                          style={{ ...btnAction, backgroundColor: '#2c3e50' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task.id)} style={{ ...btnAction, backgroundColor: '#c0392b' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- STYLES OBJECTS ---
const containerStyle = {
  backgroundColor: '#121212',
  color: '#e0e0e0',
  minHeight: '100vh',
  padding: '20px',
  boxSizing: 'border-box'
};

const cardStyle = {
  background: '#1e1e1e',
  padding: '25px',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
};

const inputStyle = {
  width: '100%',
  padding: '15px',
  marginBottom: '15px',
  borderRadius: '8px',
  border: '1px solid #333',
  backgroundColor: '#262626',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const btnBase = {
  padding: '15px',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

const btnAction = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '500'
};