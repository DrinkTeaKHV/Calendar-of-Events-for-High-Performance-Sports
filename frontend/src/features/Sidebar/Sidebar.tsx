import React from 'react';
import {
  List,
  Drawer,
  Select,
  MenuItem,
  ListItem,
  InputLabel,
  FormControl,
  ListSubheader,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import {setSport, setLocation, setParticipantsCount} from '../../store/slices/filtersSlice';
import {useGetFiltersQuery} from '../../store/slices/apiSlice';
import {useAppSelector} from '../../hooks/useAppSelector';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {RootState} from '../../store/store';

const Sidebar: React.FC = () => {
  const { data: filtersData, isLoading } = useGetFiltersQuery();
  const dispatch = useAppDispatch();
  const participantOptions = filtersData?.participants_counts || [];
  const sportsOptions = filtersData?.sports || [];
  const locationsOptions = filtersData?.locations || [];
  const filters = useAppSelector((state: RootState) => state.filters);

  const handleSportChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    dispatch(setSport(value === '' ? null : value));
  };

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    dispatch(setLocation(value === '' ? null : value));
  };

  const handleParticipantsChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const numericValue = value === '' ? null : Number(value);
    dispatch(setParticipantsCount(numericValue));
  };

  if (isLoading) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <CircularProgress />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px',
        },
      }}
    >
      <List subheader={<ListSubheader>Фильтр по категориям</ListSubheader>}>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="sports-label">Дисциплина</InputLabel>
            <Select
              labelId="sports-label"
              value={filters.sport || ''}
              label="Дисциплина"
              onChange={handleSportChange}
              sx={{ fontSize: '14px' }}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 200, fontSize: '12px' },
                },
              }}
            >
              {sportsOptions.map((sport) => (
                <MenuItem
                  key={sport}
                  value={sport}
                  style={{ fontSize: '12px' }}
                >
                  {sport}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="locations-label">Место проведения</InputLabel>
            <Select
              labelId="locations-label"
              value={filters.location || ''}
              label="Место проведения"
              onChange={handleLocationChange}
              sx={{ fontSize: '14px' }}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 200, fontSize: '12px' },
                },
              }}
            >
              {locationsOptions.map((location) => (
                <MenuItem
                  key={location}
                  value={location}
                  style={{ fontSize: '12px' }}
                >
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="participants-label">Количество участников</InputLabel>
            <Select
              labelId="participants-label"
              value={filters.participantsCount !== null ? String(filters.participantsCount) : ''}
              label="Количество участников"
              onChange={handleParticipantsChange}
              sx={{ fontSize: '14px' }}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 200, fontSize: '12px' },
                },
              }}
            >
              {participantOptions.map((option) => (
                <MenuItem
                  key={option.participants_count}
                  value={String(option.participants_count)}
                  style={{ fontSize: '12px' }}
                >
                  до {option.participants_count} человек
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;