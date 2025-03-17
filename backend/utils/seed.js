// seed.js
import dotenv from 'dotenv';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { connectDB } from './db.js';
dotenv.config();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});

    await User.findOneAndDelete({ email: 'admin@example.com' });

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    // Create 19 regular user
    const users = [];
    for (let i = 1; i <= 19; i++) {
      users.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: 'password123',
        role: 'user',
      });
    }

    // Insert regular users
    // await User.insertMany(users);
    // console.log('Users have been seeded');

    // Create 20 tickets for the admin user
    const tickets = [];
    for (let i = 1; i <= 20; i++) {
      tickets.push({
        user: adminUser._id,
        title: `Ticket ${i}`,
        description: `This is the description for ticket ${i}.`,
        status: i % 2 === 0 ? 'In Progress' : 'Open',
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
