const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// POST request to place an order
router.post('/orders', async (req, res) => {
  const { forename, surname, addressLine1, addressLine2, town, country, email, phone, cartItems, totalPrice } = req.body;

  try {
    // Convert totalPrice to a number, removing any commas
    const parsedTotalPrice = parseFloat(totalPrice.replace(/,/g, ''));

    if (isNaN(parsedTotalPrice)) {
      return res.status(400).json({ message: 'Invalid total price format.' });
    }

    // Create and save the order in the database
    const newOrder = new Order({
      forename,
      surname,
      addressLine1,
      addressLine2,
      town,
      country,
      email,
      phone,
      cartItems,
      totalPrice: parsedTotalPrice,
      orderDate: Date.now(),
    });

    const savedOrder = await newOrder.save();
    console.log('Order saved to database:', savedOrder);

    // Create the email content
    const orderSummary = cartItems.map(item => `<li>${item.quantity} x ${item.name} - €${item.price.toFixed(2)} each</li>`).join('');
    const emailContent = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order, ${forename} ${surname}!</p>
      <h2>Shipping Details:</h2>
      <p>${addressLine1}</p>
      <p>${addressLine2 ? addressLine2 + '<br>' : ''}${town}, ${country}</p>
      <h2>Contact Information:</h2>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <h2>Order Summary:</h2>
      <ul>${orderSummary}</ul>
      <p>Total Price: €${parsedTotalPrice.toFixed(2)}</p>
    `;

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: process.env.OUTLOOK_EMAIL,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    });

    // Set up email options
    const mailOptions = {
      from: '"Football Kits Shop" <' + process.env.OUTLOOK_EMAIL + '>',
      to: email,
      subject: 'Your Order Confirmation',
      html: emailContent,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Failed to send order confirmation email.' });
      }
      console.log('Order confirmation email sent:', info.response);
      return res.status(200).json({ message: 'Order placed successfully. A confirmation email has been sent.' });
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Failed to place order.', error });
  }
});

module.exports = router;
