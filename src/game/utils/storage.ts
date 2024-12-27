export const getFromLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const putToLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
