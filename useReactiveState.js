import { useState } from 'react';

const getRightPayload = (type, value) => ({
  object: () => value,
  string: () => ({ value }),
  number: () => ({ value }),
  function: () => ({ value }),
}[type]);

const getTypeForValue = obj => typeof obj;

export function useReactiveState(value) {
  const loadPayload = getRightPayload(getTypeForValue(value), value);
  const payload = loadPayload && loadPayload();
  if (!payload) {
    console.warn('Pass one of this value types - object, string, number of function');
  }
  const [data, setData] = useState(payload || {});

  const reactiveObject = new Proxy(data, {
    get(target, property) {
      return target[property];
    },
    set(_, property, value) {
      setData({ [property]: value });
      return true;
    }
  });

  return reactiveObject;
};