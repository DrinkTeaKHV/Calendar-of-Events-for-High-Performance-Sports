export const formatDate = (dateString: string): string => {
  const date: Date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('ru-RU', options);

  return formatter.format(date);
};