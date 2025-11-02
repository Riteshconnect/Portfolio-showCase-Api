import request from 'supertest';
import { httpServer } from '../../app'; // Import our app
import mongoose from 'mongoose';
import User from '../../models/User';
import Experience from '../../models/experienceModel'; // Import the Experience model
import jwt from 'jsonwebtoken';

let token: string;
let testExperienceId: string;

// --- 1. SETUP: Connect to DB and get auth token ---
beforeAll(async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI as string);

  // Create a test user
  const user = await User.create({
    name: 'Experience Test User',
    email: 'exp-test@example.com',
    password: 'password123',
  });

  // Generate a token for this user
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
});

// --- 2. TEARDOWN: Clean up ---
afterEach(async () => {
  // Clean up experiences after each test
  await Experience.deleteMany({});
});

afterAll(async () => {
  // Clean up the test user
  await User.deleteMany({});
  await Experience.deleteMany({});
});

// --- 3. WRITE THE TESTS ---
describe('Experience API: /api/experience', () => {

  // Test 1: GET (Public)
  it('should get all experiences', async () => {
    const res = await request(httpServer).get('/api/experience');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test 2: POST (Private - No Token)
  it('should fail to create an experience if not authenticated', async () => {
    const res = await request(httpServer)
      .post('/api/experience')
      .send({ title: 'No Token Test', company: 'Test Co' });

    expect(res.statusCode).toBe(401);
  });

  // Test 3: POST (Private - With Token)
  it('should create a new experience', async () => {
    const newExp = {
      title: 'Test Developer',
      company: 'Test Co',
      startDate: '2023-01-01',
      description: ['Built a test suite'],
    };

    const res = await request(httpServer)
      .post('/api/experience')
      .set('Authorization', `Bearer ${token}`) // Set the auth header
      .send(newExp); // Send JSON data

    // Check response
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Developer');
    expect(res.body.company).toBe('Test Co');

    // Check database
    const dbExp = await Experience.findOne({ company: 'Test Co' });
    expect(dbExp).not.toBeNull();
    
    // Save ID for other tests
    testExperienceId = res.body._id;
  });

  // Test 4: PUT (Private - Update)
  it('should update an experience', async () => {
    // First, create an experience
    const exp = await Experience.create({
      title: 'Old Title',
      company: 'Old Co',
      startDate: '2022-01-01',
      description: ['Old desc'],
    });

    const res = await request(httpServer)
      .put(`/api/experience/${exp._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Updated Title' }); // Send update data
      
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('New Updated Title');
  });

  // Test 5: DELETE (Private - Delete)
  it('should delete an experience', async () => {
    // First, create an experience
    const exp = await Experience.create({
      title: 'To Be Deleted',
      company: 'Delete Co',
      startDate: '2022-01-01',
      description: ['...'],
    });
    
    const res = await request(httpServer)
      .delete(`/api/experience/${exp._id}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Experience removed');
    
    // Verify it's gone from the DB
    const deleted = await Experience.findById(exp._id);
    expect(deleted).toBeNull();
  });
});