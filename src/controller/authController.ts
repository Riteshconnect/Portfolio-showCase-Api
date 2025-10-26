import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // <-- 1. Import asyncHandler

// --- Helper Function to Generate JWT ---
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};

// === @desc:   Register a new user (admin) ===
// === @route:  POST /api/auth/register ===
// === @access: Public ===
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // Notice we wrap the whole function in asyncHandler!
  // No more try...catch!

  const { name, email, password } = req.body;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // This is how we throw errors now
    res.status(400); // Set the status code
    throw new Error('User already exists'); // Throw an error
  }

  // 2. Create a new user
  const user = new User({
    name,
    email,
    password,
  });

  // 3. Save the user
  await user.save();

  // 4. Generate token and respond
  const token = generateToken(user._id.toString());
  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// === @desc:   Authenticate user and get token ===
// === @route:  POST /api/auth/login ===
// === @access: Public ===
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. Check user and compare passwords
  if (user && (await user.comparePassword(password))) {
    // 3. User is valid, generate token and respond
    const token = generateToken(user._id.toString());
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    // If no user or password doesn't match
    res.status(401); // Unauthorized
    throw new Error('Invalid credentials');
  }
});

// Export our functions
export { registerUser, loginUser };