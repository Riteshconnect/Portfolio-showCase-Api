import mongoose, { Schema, Document ,Types} from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Define the Interface for our User document
// This tells TypeScript what properties our User document will have.
export interface IUser extends Document {
  _id: Types.ObjectId; // <-- 2. ADD THIS LINE
  name: string;
  email: string;
  password: string;
  // A function to compare passwords
  comparePassword(password: string): Promise<boolean>;
}

// 2. Define the Mongoose Schema
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// 3. Add a "pre-save" hook (middleware)
// This function runs *before* a new user is saved to the database.
UserSchema.pre<IUser>('save', async function (next) {
  // 'this' refers to the user document being saved
  
  // Only hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a "salt"
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // Pass the error to the next middleware
    if (error instanceof Error) {
      return next(error);
    }
    return next(new Error('Error hashing password'));
  }
});

// 4. Add a method to the schema for comparing passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5. Create and export the model
// Mongoose will create a collection named "users" (lowercase, plural)
const User = mongoose.model<IUser>('User', UserSchema);

export default User;