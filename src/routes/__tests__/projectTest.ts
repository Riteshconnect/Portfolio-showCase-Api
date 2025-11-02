import request from 'supertest';
import { httpServer } from '../../app'; // Import our app
import mongoose from 'mongoose';
import User from '../../models/User';
import Project from '../../models/projectModel';
import sequelize from '../../config/dbMysql';
import jwt from 'jsonwebtoken';
import path from 'path'; // We'll need this to attach a file
import fs from 'fs'; // We'll need this to clean up

let token: string; // We'll store our auth token here
let testProjectId: string;

// --- 1. SETUP: Connect to DB and get auth token ---
beforeAll(async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI as string);

  // Create a test user
  const user = await User.create({
    name: 'Test User',
    email: 'project-test@example.com',
    password: 'password123',
  });

  // Generate a token for this user
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
});

// --- 2. TEARDOWN: Clean up DBs and close connections ---
afterEach(async () => {
  // Clean up projects after each test
  await Project.deleteMany({});
  // Clean up any files in the uploads folder
  const uploadDir = path.join(process.cwd(), 'uploads');
  const files = fs.readdirSync(uploadDir);
  for (const file of files) {
    if (file !== '.gitkeep') { // Don't delete a .gitkeep file
      fs.unlinkSync(path.join(uploadDir, file));
    }
  }
});

afterAll(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  
  await mongoose.connection.close();
  await sequelize.close();
  httpServer.close();
});

// --- 3. WRITE THE TESTS ---
describe('Projects API: /api/projects', () => {

  // Test 1: GET (Public)
  it('should get all projects', async () => {
    const res = await request(httpServer).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test 2: POST (Private - No Token)
  it('should fail to create a project if not authenticated', async () => {
    const res = await request(httpServer)
      .post('/api/projects')
      .field('title', 'No Token Test'); // Use .field for text

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Not authorized, no token');
  });

  // Test 3: POST (Private - With Token & File)
  it('should create a new project with a file upload', async () => {
    const res = await request(httpServer)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`) // Set the auth header
      .field('title', 'My Test Project') // Use .field() for text
      .field('description', 'This is a test.')
      .field('tags', 'test,jest,supertest')
      .attach( // Use .attach() for files
        'imageUrl', // This is the 'name' of the form field
        path.join(__dirname, 'test-image.png') // Path to a test file
      );
    
    // Check response
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('My Test Project');
    expect(res.body.imageUrl).toContain('/uploads/imageUrl-');
    
    // Check if file was saved
    const fileName = res.body.imageUrl.split('/')[2];
    const filePath = path.join(process.cwd(), 'uploads', fileName);
    expect(fs.existsSync(filePath)).toBe(true);

    // Save ID for delete test
    testProjectId = res.body._id;
  });

  // Test 4: DELETE (Private - With Token)
  it('should delete a project', async () => {
    // First, create a project to delete
    const project = await Project.create({
      title: 'To Be Deleted',
      description: '...',
      imageUrl: '/uploads/fake-image.jpg'
    });
    
    const res = await request(httpServer)
      .delete(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Project removed');
    
    // Verify it's gone from the DB
    const deleted = await Project.findById(project._id);
    expect(deleted).toBeNull();
  });
});