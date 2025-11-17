import React, {useEffect, useState} from 'react';
import {generateUUID} from '../generateUUID';

type OneStateKey = `${string}-${string | number}`;
const BoundMaps = new Map();
const BoundListenersMaps = new Map<string, Map<string, React.Dispatch<any>>>();

export const getBoundedValue = (Key: OneStateKey) => BoundMaps.get(Key);
export const setBoundedValue = (Key: OneStateKey) => (value: any) => {
  const NextValue =
    'function' == typeof value ? value(getBoundedValue(Key)) : value;
  BoundMaps.set(Key, NextValue);
  if (BoundListenersMaps.has(Key)) {
    BoundListenersMaps.get(Key)?.forEach(stateCallback => {
      stateCallback(NextValue);
    });
  }
};

export const useObjectState = (
  ObjectType: string,
  ObjectID: number | string,
  initialValue: any,
) => {
  const Key: OneStateKey = `${ObjectType}-${ObjectID}`;
  const [Value, setValue] = useState(initialValue || getBoundedValue(Key));
  useEffect(() => {
    BoundMaps.set(Key, initialValue);
    const id = generateUUID();
    if (!BoundListenersMaps.has(Key)) {
      const newMap = new Map();
      BoundListenersMaps.set(Key, newMap);
    }
    BoundListenersMaps.get(Key)?.set(id, setValue);
    return () => {
      BoundListenersMaps.get(Key)?.delete(id);
    };
  }, [Key]);

  useEffect(() => {
    if (!!initialValue) {
      setBoundedValue(Key)(initialValue);
    }
  }, [initialValue]);

  return [Value, setBoundedValue(Key)];
};