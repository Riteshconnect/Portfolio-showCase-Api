import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Experience from '../models/experienceModel'; // Our new Experience model

// === @desc:   Get all experiences ===
// === @route:  GET /api/experience ===
// === @access: Public ===
export const getExperiences = asyncHandler(
  async (req: Request, res: Response) => {
    // Get all, sorted by start date (most recent first)
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.status(200).json(experiences);
  }
);

// === @desc:   Create a new experience ===
// === @route:  POST /api/experience ===
// === @access: Private (Protected) ===
export const createExperience = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      company,
      location,
      startDate,
      endDate,
      isCurrent,
      description,
    } = req.body;

    // Basic validation
    if (!title || !company || !startDate || !description) {
      res.status(400);
      throw new Error(
        'Please add all required fields: title, company, startDate, description'
      );
    }

    const experience = new Experience({
      title,
      company,
      location,
      startDate,
      // If 'isCurrent' is true, set endDate to null
      endDate: isCurrent ? null : endDate,
      isCurrent,
      description,
    });

    const createdExperience = await experience.save();
    res.status(201).json(createdExperience);
  }
);

// === @desc:   Update an experience ===
// === @route:  PUT /api/experience/:id ===
// === @access: Private (Protected) ===
export const updateExperience = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...fields } = req.body; // Capture all fields from the body

    const experience = await Experience.findById(id);

    if (!experience) {
      res.status(404);
      throw new Error('Experience not found');
    }

    // If 'isCurrent' is being set to true, clear the endDate
    if (fields.isCurrent === true) {
      fields.endDate = null;
    }

    // Update the document
    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      { $set: fields }, // Use $set to update only the fields provided
      { new: true, runValidators: true } // Return the new doc and run schema validators
    );

    res.status(200).json(updatedExperience);
  }
);

// === @desc:   Delete an experience ===
// === @route:  DELETE /api/experience/:id ===
// === @access: Private (Protected) ===
export const deleteExperience = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const experience = await Experience.findById(id);

    if (!experience) {
      res.status(404);
      throw new Error('Experience not found');
    }

    await experience.deleteOne();

    res.status(200).json({ id: experience._id, message: 'Experience removed' });
  }
);