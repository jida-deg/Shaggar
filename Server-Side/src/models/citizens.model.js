import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const citizenSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
      required: false,
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      required: false,
    },

    password: {
      type: String,
      select: false,
      required: true,
      minlength: 8,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    adress:{
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, result) {
        delete result.password;
        delete result.__v;
        return result;
      },
    },
  }
);

// Hash the password before saving a new password.
citizenSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

const Citizen = mongoose.model("Citizen", citizenSchema);

export default Citizen;
