import React, {useState, ChangeEvent, FormEvent} from 'react';
import {TAuthCredentials} from '../../definitions/types/TAuthCredentials';
import {useAppSelector} from '../../hooks/useAppSelector';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import styles from './styles.module.css';

const LoginPage: React.FC = () => {
  const authState = useAppSelector((state) => state.auth);
  const [credentials, setCredentials] = useState<TAuthCredentials>({ email: '', password: '' });
  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        required
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        required
        placeholder="Password"
      />
      <button type="submit" disabled={authState.loading}>
        {authState.loading ? 'Loading...' : 'Login'}
      </button>
      {authState.error && <p className={styles.error}>{authState.error}</p>}
    </form>
  );
};

export default LoginPage;