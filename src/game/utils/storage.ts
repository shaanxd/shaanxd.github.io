export const getFromStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const putToStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
