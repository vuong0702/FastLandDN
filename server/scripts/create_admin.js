require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const username = 'admin';
    const plainPassword = 'vuong123';
    const email = 'admin@example.com';

    let user = await User.findOne({ ten_dang_nhap: username });

    if (user) {
      console.log('Admin user exists, updating role to quan_tri');
      user.vai_tro = 'quan_tri';
      if (!user.mat_khau || user.mat_khau === '') {
        const salt = await bcrypt.genSalt(10);
        user.mat_khau = await bcrypt.hash(plainPassword, salt);
      }
      user.email = email;
      await user.save();
      console.log('Admin user updated:', user.ten_dang_nhap);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(plainPassword, salt);
      user = new User({
        ten_dang_nhap: username,
        mat_khau: hashed,
        email,
        ho_ten: 'Admin',
        vai_tro: 'quan_tri'
      });
      await user.save();
      console.log('Admin user created:', user.ten_dang_nhap);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
