export const formatDate = (dateString: string): string => {
  const date: Date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat('ru-RU', options);
  let formattedDate = formatter.format(date);

  if (formattedDate.endsWith(' г.')) {
    formattedDate = formattedDate.slice(0, -3);
  }

  return formattedDate;
};
