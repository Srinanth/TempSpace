import { nanoid } from 'nanoid';

export const generateRandomToken = (size: number = 21): string => {
  return nanoid(size);
};