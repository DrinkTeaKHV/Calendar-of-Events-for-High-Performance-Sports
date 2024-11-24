import React, { useState, ChangeEvent, FormEvent } from 'react';
import { setCredentials, setLoading, setError } from '../../store/slices/authSlice';
import { TAuthCredentials } from '../../definitions/types/TAuthCredentials';
import { useLoginMutation } from '../../store/slices/apiSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, TextField, Alert } from '@mui/material';
import styles from './styles.module.css';

const Login: React.FC = () => {
    const [credentials, setCredentialsState] = useState<TAuthCredentials>({ username: 'telegram_id', telegram_id: '', password: '' });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setCredentialsState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAcceptedTerms(e.target.checked);
    };

    const handleTelegramRegistration = () => {
        // Логика для редиректа на регистрацию через Telegram
        window.location.href = 'https://t.me/true_fsp_bot?start=register';
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!acceptedTerms) {
            alert('Please accept the Terms and Conditions to continue.');
            return;
        }

        dispatch(setLoading());

        try {
            const response = await login(credentials).unwrap();

            dispatch(setCredentials(response));

            navigate('/');
        } catch (err: any) {
            const errorMessage = err?.data?.message || 'An error occurred during login.';

            dispatch(setError(errorMessage));

            console.error('Failed to login:', err);
        }
    };

    return (
        <Box className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <TextField
                    className={styles.textField}
                    variant="outlined"
                    size="medium"
                    label="Telegram ID"
                    type="text"
                    name="telegram_id"
                    value={credentials.telegram_id}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    className={styles.textField}
                    variant="outlined"
                    size="medium"
                    label="Password"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <FormControlLabel
                    control={<Checkbox checked={acceptedTerms} onChange={handleCheckboxChange} />}
                    label="I accept the Terms and Conditions"
                />
                <Box className={styles.buttonGroup}>
                    <Button
                        size="large"
                        variant="contained"
                        color="inherit"
                        onClick={handleTelegramRegistration}
                        fullWidth
                        className={styles.telegramButton}
                    >
                        Регистрация через Telegram
                    </Button>
                    <Button
                        size="large"
                        variant="contained"
                        type="submit"
                        color="primary"
                        disabled={isLoading || !acceptedTerms}
                        fullWidth
                    >
                        Войти
                    </Button>
                </Box>
                {isError && (
                    <Alert severity="error" className={styles.errorAlert}>
                        {(error as any)?.data?.message || 'An error occurred during login.'}
                    </Alert>
                )}
            </form>
        </Box>
    );
};

export default Login;
