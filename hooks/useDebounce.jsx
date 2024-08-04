import { useState, useEffect } from "react";

export const useDebounce = (value, milliSeconds) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, milliSeconds);

    return () => {
      clearTimeout(handler);
    };
  }, [value, milliSeconds, firstRender]);

  return debouncedValue;
};
