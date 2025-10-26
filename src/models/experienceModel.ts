import mongoose, { Schema, Document, Types } from 'mongoose';

// 1. Define the Interface for our Experience document
export interface IExperience extends Document {
  _id: Types.ObjectId;
  title: string;
  company: string;
  location?: string; // Optional
  startDate: Date;
  endDate?: Date; // Optional (will be null if current job)
  isCurrent: boolean;
  description: string[]; // An array of strings for bullet points
}

// 2. Define the Mongoose Schema
const ExperienceSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    location: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date, // This will be null if isCurrent is true
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: [String], // Array of strings for bullet points
      required: [true, 'Please add a description'],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// 3. Create and export the model
const Experience = mongoose.model<IExperience>(
  'Experience',
  ExperienceSchema
);

export default Experience;