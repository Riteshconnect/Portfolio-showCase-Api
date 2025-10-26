import mongoose, { Schema, Document, Types } from 'mongoose';

// 1. Define the Interface for our Skill document
export interface ISkill extends Document {
  _id: Types.ObjectId;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Other';
  // You could add an 'icon' or 'percentage' field here later if you want
}

// 2. Define the Mongoose Schema
const SkillSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a skill name'],
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Other'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// 3. Create and export the model
const Skill = mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;