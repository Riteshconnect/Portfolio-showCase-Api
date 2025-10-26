import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
// Make sure this import path matches your file name (e.g., User.model.ts)
import User, { IUser } from '../models/User';

// This interface defines the shape of our decoded token
interface JwtPayload {
  id: string;
}

// This is our 'protect' middleware
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];

        if (!token) {
          res.status(401);
          throw new Error('Not authorized, token format is invalid');
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as unknown as JwtPayload;

        // --- TEMPORARY BYPASS ---
        // Use (req as any) to force TypeScript to allow this
        (req as any).user = await User.findById(decoded.id).select(
          '-password'
        );

        // --- TEMPORARY BYPASS ---
        // Use (req as any) here as well
        if (!(req as any).user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }

        next(); // Call next() to move to the actual route
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);