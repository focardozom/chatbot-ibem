import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Please provide a name'],
      trim: true 
    },
    username: { 
      type: String, 
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters']
    },
    password: { 
      type: String, 
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if model is already defined to prevent overwrite error in development with hot reloads
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 