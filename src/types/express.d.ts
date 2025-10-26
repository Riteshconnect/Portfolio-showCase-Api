// File: src/types/express/index.d.ts

// Make sure this import path is correct
import { IUser } from '../../models/User';

// This file merges our new property with the original Express types
declare global {
  namespace Express {
    export interface Request {
      user?: IUser; // Adds the 'user' property (optional)
    }
  }
}