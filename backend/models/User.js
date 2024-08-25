const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'staff'], // Restrict role to customer or staff
    default: 'customer', // Default role is 'customer'
  },
  resetPasswordToken: { type: String }, // Optional field for password reset token
  resetPasswordExpires: { type: Date }
});

// Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    try {
      // Only hash the password if it has been modified and is not already hashed
      if (!this.isModified('password')) {
        return next();
      }
  
      // If the password is already hashed, don't hash it again
      const isAlreadyHashed = this.password.startsWith('$2b$');
      if (!isAlreadyHashed) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
  
      next();
    } catch (err) {
      return next(err);
    }
  });
  

// Method to compare input password with the stored hashed password
userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
