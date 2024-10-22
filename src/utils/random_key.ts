import { randomBytes } from 'crypto';

export const createWindowKey = () => randomBytes(16).toString('hex');
