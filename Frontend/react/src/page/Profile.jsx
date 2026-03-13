import React, { useEffect, useState } from 'react';
import Api from "../Api"; 
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  const [title, setTitle] = useState("");
  const [discription, setDiscription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get("profile/");
        setTasks(response.data.tasks || []);
        setUser({ username: response.data.username }); 
      } catch (error) {
        console.error("Fetch error. Global interceptor handles 401s.");
      }
    };
    fetchData();
  }, []);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await Api.put("profile/", { id: editingId, title, discription });
        setTasks(tasks.map((t) => (t.id === editingId ? response.data : t)));
        setEditingId(null);
      } else {
        const response = await Api.post("profile/", { title, discription });
        setTasks([response.data, ...tasks]);
      }
      setTitle("");
      setDiscription("");
    } catch (error) {
      console.error("Save error", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await Api.delete("profile/", { data: { id: id } });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const response = await Api.patch("profile/", { id: task.id, completed: !task.completed });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
    } catch (error) {
      console.error("Toggle error", error);
    }
  };

  if (!user) return <div style={{color: 'white', textAlign: 'center'}}>Loading Profile...</div>;

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard - Welcome, {user.username}</h2>
        <Link to="/Logout" style={{ color: '#ff4d4d', textDecoration: 'none', fontWeight: 'bold' }}>Logout</Link>
      </div>
      <hr style={{ borderColor: '#333' }} />

      <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
        <h3 style={{ color: '#4db8ff' }}>{editingId ? "✏️ Update Task" : "➕ Create Task"}</h3>
        <form onSubmit={handleTaskSubmit}>
          <input 
            type="text" placeholder="Title" value={title} 
            onChange={(e) => setTitle(e.target.value)} required 
            style={inputStyle}
          />
          <textarea 
            placeholder="Description" value={discription} 
            onChange={(e) => setDiscription(e.target.value)} required 
            style={{ ...inputStyle, height: '80px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={submitBtn}>{editingId ? "Update" : "Add Task"}</button>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setTitle(""); setDiscription("");}} style={cancelBtn}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3>Your Tasks</h3>
      {tasks.map((task) => (
        <div key={task.id} style={{ 
          background: '#1e1e1e', padding: '15px', marginBottom: '15px', borderRadius: '10px',
          borderLeft: task.completed ? '5px solid #2ecc71' : '5px solid #4db8ff'
        }}>
          <h4 style={{ margin: '0 0 10px 0', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h4>
          <p style={{ color: '#bbb' }}>{task.discription}</p>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => toggleComplete(task)} style={actionBtn}>
              {task.completed ? "Undo" : "Done"}
            </button>
            <button onClick={() => { setEditingId(task.id); setTitle(task.title); setDiscription(task.discription); }} style={actionBtn}>
              Edit
            </button>
            <button onClick={() => deleteTask(task.id)} style={{ ...actionBtn, backgroundColor: '#c0392b' }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #333', background: '#121212', color: 'white', boxSizing: 'border-box' };
const submitBtn = { padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelBtn = { padding: '10px 20px', background: '#444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const actionBtn = { padding: '6px 12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };



Link