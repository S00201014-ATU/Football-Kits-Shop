const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcrypt');

//Load the environment variables from the .env file
dotenv.config();

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {}).then(async () => {
    console.log('Connected to MongoDB');

    try{
        //Check if user already exists
        const existingUsers = await User.find();
        if (existingUsers.length > 0) {
            console.log('User already exists in the database.');
            // Exit without seeding
            process.exit(0);
        }

        // Hash passwords
        const staffPassword = await bcrypt.hash('staffpassword123', 10);
        const customerPassword = await bcrypt.hash('customerpassword123', 10);

        // Create the initial users
        const users = [
            {
                username: 'admin',
                email: 'mmurphy123@hotmail.co.uk',
                password: staffPassword,
                role: 'staff',
            },
            {
                username: 'b0bby',
                email: 'S00201014@atu.ie',
                password: customerPassword,
                role: 'customer'
            },
        ];

        // Insert users into the database
        await User.insertMany(users);
        console.log('Users seeded successfully.');
    } catch(err) {
        console.error('Error seeding users:', err);
    } finally {
        process.exit(0);
    }
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});