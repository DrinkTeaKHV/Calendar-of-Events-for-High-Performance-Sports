import React, {useState, ChangeEvent, FormEvent} from 'react';
import {setCredentials, setLoading, setError} from '../../store/slices/authSlice';
import {TAuthCredentials} from '../../definitions/types/TAuthCredentials';
import {useLoginMutation} from '../../store/slices/apiSlice';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {useNavigate} from 'react-router-dom';
import styles from './styles.module.css';

const LoginPage: React.FC = () => {
  const [credentials, setCredentialsState] = useState<TAuthCredentials>({ email: '', password: '' });
  const [login, { data, isLoading, isSuccess, isError, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentialsState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading());
    try {
      const response = await login(credentials).unwrap();

      dispatch(setCredentials(response));

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'An error occurred during login.';

      dispatch(setError(errorMessage));

      console.error('Failed to login:', err);
    }
  };

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