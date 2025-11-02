import mongoose, { Schema, Document, model, Query } from 'mongoose';

// 1. Define the Interface for our Project document
export interface IProject extends Document {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubLink?: string; // Optional
  liveDemoLink?: string; // Optional
   isDeleted?: boolean; 
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
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // 3. Add index for faster queries
    },
    // We don't need a 'user' field *unless* you plan to have
    // multiple users posting projects. For a personal portfolio,
    // this is simpler.
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);
ProjectSchema.pre(/^find/, function (this: Query<IProject, Document<IProject>>, next) {
  // 'this' refers to the Mongoose query
  
  // Only find documents that are not soft-deleted
  this.where({ isDeleted: false });
  
  next();
});
// 3. Create and export the model
const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;