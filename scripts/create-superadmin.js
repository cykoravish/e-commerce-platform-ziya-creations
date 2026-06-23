const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const userCollection = mongoose.connection.collection('users');
    
    await userCollection.insertOne({
      email: 'superadmin@ziyacreations.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'super_admin',
      phone: '9876543210',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Super Admin created successfully!');
    console.log('Email: superadmin@ziyacreations.com');
    console.log('Password: superadmin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSuperAdmin();

// node --require dotenv/config scripts/create-superadmin.js