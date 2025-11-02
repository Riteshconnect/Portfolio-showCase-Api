
import request from 'supertest';
import { httpServer } from '../../app'; // Import our new, non-listening server
import mongoose from 'mongoose';
import User from '../../models/User'; 
import sequelize from '../../config/dbMysql';

// Load env vars for the test environment

// 1. --- SETUP: Connect to the Database ---
beforeAll(async () => {
  // Use your existing MongoDB connection string
  await mongoose.connect(process.env.MONGO_URI as string);
});

// 2. --- TEARDOWN: Clean up after tests ---
afterEach(async () => {
  // Delete all users after each test
  await User.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
});

// 3. --- WRITE THE TEST ---
describe('Auth API: POST /api/auth/register', () => {
  // Test Case 1: Successful registration
  it('should register a new user successfully', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(httpServer)
      .post('/api/auth/register')
      .send(newUser);

    // Check 1: HTTP Status Code
    expect(res.statusCode).toBe(201);

    // Check 2: Response body
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe('Test User');
    expect(res.body.user.email).toBe('test@example.com');

    // Check 3: Database
    const dbUser = await User.findOne({ email: 'test@example.com' });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.name).toBe('Test User');
  });

  // Test Case 2: Duplicate email
  it('should return a 400 error if email already exists', async () => {
    // First, create a user
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    await User.create(newUser);

    // Then, try to register with the same email
    const res = await request(httpServer)
      .post('/api/auth/register')
      .send(newUser);

    // Check: HTTP Status Code
    expect(res.statusCode).toBe(400);

    // Check: Response body
    expect(res.body.message).toBe('User already exists');
  });
});