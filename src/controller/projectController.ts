import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Project from '../models/projectModel';
// We might need 'fs' (File System) to delete old images
import fs from 'fs';
import path from 'path';

// === GET (No Change) ===
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.status(200).json(projects);
});

// === CREATE (Updated) ===
export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, tags, githubLink, liveDemoLink } = req.body;

    // 1. Multer adds the 'file' object to 'req'
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    // 2. Validation
    if (!title || !description || !imageUrl) {
      res.status(400);
      throw new Error(
        'Please add all required fields: title, description, and an image'
      );
    }

    const project = new Project({
      title,
      description,
      imageUrl, // 3. Save the path to the image
      tags: tags ? tags.split(',') : [], // Handle tags if they're a comma-separated string
      githubLink,
      liveDemoLink,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  }
);

// === UPDATE (Updated) ===
export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, tags, githubLink, liveDemoLink } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // 1. Keep track of the old image path
    const oldImagePath = project.imageUrl;

    // 2. Check if a new file was uploaded
    let newImageUrl;
    if (req.file) {
      newImageUrl = `/uploads/${req.file.filename}`;
      project.imageUrl = newImageUrl; // Update the project's imageUrl
    }

    // 3. Update other fields
    project.title = title || project.title;
    project.description = description || project.description;
    project.tags = tags ? tags.split(',') : project.tags;
    project.githubLink = githubLink || project.githubLink;
    project.liveDemoLink = liveDemoLink || project.liveDemoLink;

    const updatedProject = await project.save();

    // 4. If a new image was uploaded, delete the old one
    if (req.file && oldImagePath) {
      // Construct the full path to the old file
      const oldFilePath = path.join(process.cwd(), oldImagePath);
      // Check if it exists and delete it
      if (fs.existsSync(oldFilePath)) {
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    }

    res.status(200).json(updatedProject);
  }
);

// === DELETE (Updated slightly to remove image) ===
export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    project.isDeleted = true;
    await project.save();
  

    res.status(200).json({ id: project._id, message: 'Project removed' });
  }
);