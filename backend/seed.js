const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {}).then(() => {
  console.log('Connected to MongoDB for seeding');
}).catch((err) => {
  console.error('MongoDB connection failed', err);
});

// Sample products to insert

const products = [
    {
      name: 'Real Madrid Home Kit 2024/25',
      price: 99.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/07/10/UoqvrLYPULl7Cns.jpg',
      description: 'Official 2024/25 Real Madrid home kit.',
      tags: {
        league: 'La Liga',
        manufacturer: 'Adidas',
        europeanCompetition: 'Champions League',
      },
    },
    {
      name: 'Manchester United Away Kit 2024/25',
      price: 89.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/07/25/b4nF3YsZcetpGhe.jpg',
      description: 'Official 2024/25 Manchester United away kit.',
      tags: {
        league: 'Premier League',
        manufacturer: 'Adidas',
        europeanCompetition: 'Europa League',
      },
    },
    {
      name: 'Paris Saint-Germain Third Kit 2024/25',
      price: 94.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2023/09/20/QFEWSMZWQ0dmR3V.jpg',
      description: 'Official 2024/25 PSG third kit featuring a sleek black design with gold accents.',
      tags: {
        league: 'Ligue 1',
        manufacturer: 'Nike',
        europeanCompetition: 'Champions League',
      },
    },
    {
      name: 'Bayern Munich Home Kit 2024/25',
      price: 99.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/05/06/zsJI7EFeYR2bxEa.jpg',
      description: 'Official 2024/25 Bayern Munich home kit.',
      tags: {
        league: 'Bundesliga',
        manufacturer: 'Adidas',
        europeanCompetition: 'Champions League',
      },
    },
    {
      name: 'Inter Milan Away Kit 2024/25',
      price: 89.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/08/08/VIYziwdeWlNME5P.jpg',
      description: 'Official 2024/25 Inter Milan away kit.',
      tags: {
        league: 'Serie A',
        manufacturer: 'Nike',
        europeanCompetition: 'Champions League',
      },
    },
    {
      name: 'Newcastle United Home Kit 2024/25',
      price: 79.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/06/07/2N5ypE1OHxoWbWH.jpg',
      description: 'Official 2024/25 Newcastle United home kit.',
      tags: {
        league: 'Premier League',
        manufacturer: 'Castore',
        europeanCompetition: 'Conference League',
      },
    },
    {
      name: 'Celtic Third Kit 2024/25',
      price: 69.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/08/21/2YMvkfAIfMO1ccE.jpg',
      description: 'Official 2024/25 Celtic third kit.',
      tags: {
        league: 'Other Leagues',
        manufacturer: 'Adidas',
        europeanCompetition: 'Champions League',
      },
    },
    {
      name: 'AS Roma Home Kit 2024/25',
      price: 89.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/07/18/VyouBXWX4nuoYX0.jpg',
      description: 'Official 2024/25 AS Roma home kit.',
      tags: {
        league: 'Serie A',
        manufacturer: 'Nike',
        europeanCompetition: 'Europa League',
      },
    },
    {
      name: 'Rangers FC Away Kit 2024/25',
      price: 79.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/05/31/rF9yRzCDrUcAAxV.jpg',
      description: 'Official 2024/25 Rangers FC away kit.',
      tags: {
        league: 'Other Leagues',
        manufacturer: 'Castore',
        europeanCompetition: 'Europa League',
      },
    },
    {
      name: 'Marseille Home Kit 2024/25',
      price: 89.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/07/03/bIFL0okXditchwe.jpg',
      description: 'Official 2024/25 Marseille home kit.',
      tags: {
        league: 'Ligue 1',
        manufacturer: 'Puma',
        europeanCompetition: 'Conference League',
      },
    },
    {
      name: 'VfB Stuttgart Third Kit 2024/25',
      price: 79.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2023/08/25/S8dEXFr2Fpsv8lx.jpg',
      description: 'Official 2024/25 Stuttgart third kit.',
      tags: {
        league: 'Bundesliga',
        manufacturer: 'Other Manufacturers',
        europeanCompetition: 'No European Football',
      },
    },
    {
      name: 'Lazio Away Kit 2024/25',
      price: 89.99,
      imageUrl: 'https://cdn.footballkitarchive.com/2024/08/07/BHhCZtCOA5iAseW.jpg',
      description: 'Official 2024/25 Lazio away kit.',
      tags: {
        league: 'Serie A',
        manufacturer: 'Other Manufacturers',
        europeanCompetition: 'Europa League',
      },
    }
  ];

// Insert sample products into the database
Product.insertMany(products)
  .then(() => {
    console.log('Sample products inserted successfully');
    mongoose.connection.close(); // Close the connection after seeding
  })
  .catch((err) => {
    console.error('Failed to insert products', err);
  });
