'use client';

import { useEffect, useRef, useState } from 'react';

export function useDebounce<T>(
  externalValue: T,
  onChange: (value: T) => void,
  delay: number,
): [T, (value: T) => void] {
  const [localValue, setLocalValue] = useState(externalValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (value: T) => {
    setLocalValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(value);
    }, delay);
  };

  return [localValue, handleChange];
}
