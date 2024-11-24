export const getRandomColor = (): string => {
  const colors = ["#D94141", "#D9D941", "#56D941"];
  const randomIndex = Math.floor(Math.random() * colors.length);

  return colors[randomIndex];
};
