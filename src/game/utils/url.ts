export const getUrlSearchParam = (
  param: string,
  defaultValue: string | null = null,
  validate?: (value: string) => boolean
) => {
  const value = new URLSearchParams(window.location.search).get(param);

  if (value) {
    if (validate) {
      return validate(value) ? value : defaultValue;
    }
    return value;
  }

  return defaultValue;
};

export const setUrlSearchParam = (param: string, value: string) => {
  const params = new URLSearchParams(window.location.search);
  params.set(param, value);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
};
