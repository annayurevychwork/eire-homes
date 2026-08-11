import React, { useState } from 'react';
import { registerUser } from '../api/auth';

export const RegisterModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerUser({ email, password, name });
      alert('Успішна реєстрація! ID агентства: ' + data.agencyId);
    } catch (err) {
      alert('Помилка при реєстрації');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">Agent registration</h2>
      <input 
        type="text" placeholder="Назва агенції" value={name} 
        onChange={e => setName(e.target.value)} className="border p-2 mb-2 w-full" 
      />
      <input 
        type="email" placeholder="Email" value={email} 
        onChange={e => setEmail(e.target.value)} className="border p-2 mb-2 w-full" 
      />
      <input 
        type="password" placeholder="Пароль" value={password} 
        onChange={e => setPassword(e.target.value)} className="border p-2 mb-2 w-full" 
      />
      <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">Register</button>
    </form>
  );
};