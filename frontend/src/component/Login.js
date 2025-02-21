import React, { useState } from 'react';
import axios from 'axios'; // Import axios to make HTTP requests

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend for login
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // On success, store the token (if any) and navigate
      console.log(response.data);
      localStorage.setItem('token', response.data.token); // example: saving token in local storage
      // redirect or update UI after successful login
    } catch (err) {
      setError('Invalid credentials or something went wrong!');
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
