import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Skill from '../models/skillModel'; // Our new Skill model

// === @desc:   Get all skills ===
// === @route:  GET /api/skills ===
// === @access: Public ===
export const getSkills = asyncHandler(async (req: Request, res: Response) => {
  // Get all, sorted by category, then name
  const skills = await Skill.find().sort({ category: 1, name: 1 });
  res.status(200).json(skills);
});

// === @desc:   Create a new skill ===
// === @route:  POST /api/skills ===
// === @access: Private (Protected) ===
export const createSkill = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, category } = req.body;

    // Basic validation
    if (!name || !category) {
      res.status(400);
      throw new Error('Please add all required fields: name, category');
    }

    // Check if skill already exists (case-insensitive)
    const skillExists = await Skill.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (skillExists) {
      res.status(400);
      throw new Error('Skill already exists');
    }

    const skill = new Skill({
      name,
      category,
    });

    const createdSkill = await skill.save();
    res.status(201).json(createdSkill);
  }
);

// === @desc:   Update a skill ===
// === @route:  PUT /api/skills/:id ===
// === @access: Private (Protected) ===
export const updateSkill = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category } = req.body;

    const skill = await Skill.findById(id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    // Update fields if they were provided
    skill.name = name || skill.name;
    skill.category = category || skill.category;

    const updatedSkill = await skill.save();
    res.status(200).json(updatedSkill);
  }
);

// === @desc:   Delete a skill ===
// === @route:  DELETE /api/skills/:id ===
// === @access: Private (Protected) ===
export const deleteSkill = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    await skill.deleteOne();

    res.status(200).json({ id: skill._id, message: 'Skill removed' });
  }
);