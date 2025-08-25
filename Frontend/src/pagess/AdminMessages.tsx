import { useEffect, useState } from 'react';
import { apiFetch } from '../utilss/apifetch'; // Adjust the import path as necessary

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    apiFetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">📨 Contact Form Submissions</h2>
      {messages.map((msg) => (
        <div key={msg._id} className="border p-4 rounded mb-4 shadow-md">
          <p><strong>Name:</strong> {msg.name}</p>
          <p><strong>Email:</strong> {msg.email}</p>
          <p><strong>Message:</strong> {msg.message}</p>
          <p className="text-gray-500 text-sm">📅 {new Date(msg.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
