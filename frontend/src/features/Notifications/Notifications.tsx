import React, { useState, useEffect } from 'react';
import { Box, Checkbox, FormControlLabel, Typography, Button, CircularProgress, Alert } from '@mui/material';
import {useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation} from "../../store/slices/apiSlice";

const NotificationSettingsPage: React.FC = () => {
    const { data: settings, isLoading, isError } = useGetNotificationSettingsQuery();
    const [updateSettings, { isLoading: isUpdating, isError: updateError }] = useUpdateNotificationSettingsMutation();

    const [notificationSettings, setNotificationSettings] = useState({
        receive_new_event_notifications: false,
        receive_event_update_notifications: false,
        receive_event_reminders: false,
    });

    useEffect(() => {
        if (settings) {
            // Обновляем состояние из полученных данных
            setNotificationSettings(settings);
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotificationSettings((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSave = async () => {
        try {
            await updateSettings(notificationSettings).unwrap();
            alert('Настройки сохранены!');
        } catch (err) {
            console.error('Ошибка сохранения настроек:', err);
        }
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">Не удалось загрузить настройки</Alert>;

    return (
        <Box
            sx={{
                maxWidth: 500,
                margin: '24px auto',
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'self-start',
                gap: 2,
            }}
        >
            <Typography variant="h5" component="h1" gutterBottom>
                Настройка уведомлений Telegram
            </Typography>
            <Typography variant="body1" component="p" align="left" sx={{ width: '100%', fontWeight: 600 }}>
                Типы уведомлений
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={notificationSettings.receive_new_event_notifications}
                            onChange={handleChange}
                            name="receive_new_event_notifications"
                        />
                    }
                    label="Получать уведомления о новых мероприятиях"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={notificationSettings.receive_event_update_notifications}
                            onChange={handleChange}
                            name="receive_event_update_notifications"
                        />
                    }
                    label="Получать уведомления об изменениях в мероприятиях"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={notificationSettings.receive_event_reminders}
                            onChange={handleChange}
                            name="receive_event_reminders"
                        />
                    }
                    label="Получать напоминания о мероприятиях"
                />
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isUpdating}
                sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginTop: 2,
                }}
            >
                {isUpdating ? <CircularProgress size={24} /> : 'Сохранить'}
            </Button>
            {updateError && <Alert severity="error">Ошибка сохранения настроек</Alert>}
        </Box>
    );
};

export default NotificationSettingsPage;
