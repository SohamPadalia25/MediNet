import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String, // cloudinary url
    required: false,
  },
  coverImage: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
  // ==== NEW FIELDS ====
  role: {
    type: String,
    enum: ["doctor", "patient", "admin"],
    default: "patient",
    required: true,
  },
  profile: {
    specialization: { type: String, trim: true },  // For doctors
    licenseNumber: { type: String, trim: true },   // For doctors
    hospital: { type: String, trim: true },        // For doctors
    dateOfBirth: { type: Date },                    // For patients
    gender: { type: String, enum: ["male", "female", "other"] }, // For patients
    phone: { type: String, trim: true },            // Optional contact info
    address: { type: String, trim: true },          // Optional contact info
  }
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
      role: this.role,  // Included role in token payload
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
