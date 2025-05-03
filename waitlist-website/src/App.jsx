import { useState } from 'react';
import supabase from '../utils/supabase'
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Basic validation
    if (!name || !email) {
      setMessage('Please enter both name and email.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([{ name, email }]);

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '23505') {
           setMessage('This email is already on the waitlist.');
        } else {
           setMessage(`Error signing up: ${error.message}`);
        }
      } else {
        setMessage('Thanks for joining the waitlist!');
        setName('');
        setEmail('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Swolemate Waitlist</h1>
      <p>Be the first to know when Swolemate launches!</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Joining...' : 'Join Waitlist'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
