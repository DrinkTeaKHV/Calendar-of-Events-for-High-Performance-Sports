import React, { useState, useEffect } from 'react';
import {
    Box,
    Checkbox,
    FormControlLabel,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent,
} from '@mui/material';
import {
    useGetNotificationSettingsQuery, useGetSportsQuery,
    useUpdateNotificationSettingsMutation,
} from "../../store/slices/apiSlice";
import { TNotificationSettings } from "../../definitions/types/TNotificationSettings";

const NotificationSettingsPage: React.FC = () => {
    const { data: settings, isLoading, isError } = useGetNotificationSettingsQuery();
    const { data: sports, isLoading: isSportsLoading, isError: isSportsError } = useGetSportsQuery();
    const [updateSettings, { isLoading: isUpdating, isError: updateError }] = useUpdateNotificationSettingsMutation();

    const [notificationSettings, setNotificationSettings] = useState<TNotificationSettings>({
        receive_new_event_notifications: false,
        receive_event_update_notifications: false,
        receive_event_reminders: false,
        favorite_sports: [], // Тип теперь `number[]`
    });

    // Загружаем настройки уведомлений
    useEffect(() => {
        if (settings) {
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

    // Обработка выбора любимых видов спорта
    const handleSportsChange = (e: SelectChangeEvent<number[]>) => {
        const value = e.target.value as number[]; // Приведение типа
        setNotificationSettings((prev) => ({
            ...prev,
            favorite_sports: value,
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

    if (isLoading || isSportsLoading) return <CircularProgress />;
    if (isError || isSportsError) return <Alert severity="error">Не удалось загрузить настройки</Alert>;

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

            {/* Секция выбора любимых видов спорта */}
            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="favorite-sports-label">Любимые виды спорта</InputLabel>
                <Select
                    labelId="favorite-sports-label"
                    multiple
                    value={notificationSettings.favorite_sports}
                    onChange={handleSportsChange}
                    renderValue={(selected) =>
                        selected.map((sportId) => sports?.find((sport) => sport.id === sportId)?.name).join(', ')
                    }
                >
                    {sports?.map((sport) => (
                        <MenuItem key={sport.id} value={sport.id}>
                            {sport.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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
