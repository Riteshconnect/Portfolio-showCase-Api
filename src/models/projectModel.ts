import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the Interface for our Project document
export interface IProject extends Document {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubLink?: string; // Optional
  liveDemoLink?: string; // Optional
}

// 2. Define the Mongoose Schema
const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    tags: {
      type: [String], // An array of strings
      default: [],
    },
    githubLink: {
      type: String,
    },
    liveDemoLink: {
      type: String,
    },
    // We don't need a 'user' field *unless* you plan to have
    // multiple users posting projects. For a personal portfolio,
    // this is simpler.
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// 3. Create and export the model
const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;