// seed.js
import { connectDB } from '../utils/db.js';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});

    // Hash password for users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    // Create regular user
    await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
    });

    console.log('Users have been seeded');

    // Create 20 tickets for the admin user
    const tickets = [];
    for (let i = 1; i <= 20; i++) {
      tickets.push({
        user: adminUser._id,
        title: `Ticket ${i}`,
        description: `This is the description for ticket ${i}.`,
        status: i % 2 === 0 ? 'In Progress' : 'Open', // Alternating status for demo
      });
    }

    // Insert tickets into the database
    await Ticket.insertMany(tickets);

    console.log('Tickets have been seeded');
    process.exit(); // Exit after seeding is complete
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Connect to DB and seed
connectDB().then(() => {
  seedData();
});
// Seed users
