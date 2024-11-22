import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import {TAuthCredentials} from '../../definitions/types/TAuthCredentials';
import {useLoginMutation} from '../../store/slices/apiSlice';
import {useNavigate} from 'react-router-dom';
import styles from './styles.module.css';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<TAuthCredentials>({ email: '', password: '' });
  const [login, { data, isLoading, isSuccess, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(credentials).unwrap();
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      const { token } = data;

      if (token) {
        localStorage.setItem('token', token);

        navigate('/dashboard');
      }
    }
  }, [isSuccess, data, navigate]);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" disabled={isLoading} className={styles.submitButton}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {isError && (
        <p className={styles.error}>
          {(error as any)?.data?.message || 'An error occurred during login.'}
        </p>
      )}
    </form>
  );
};

export default LoginPage;