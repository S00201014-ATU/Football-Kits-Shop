const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST request to place an order
router.post('/orders', async (req, res) => {
  const { forename, surname, addressLine1, addressLine2, town, country, email, phone, cartItems, totalPrice } = req.body;

  try {
    // Create the order summary for the email
    const orderSummary = cartItems.map(item => {
      return `<li>${item.quantity} x ${item.name} - €${item.price.toFixed(2)} each</li>`;
    }).join('');

    const emailContent = `
  <h1>Order Confirmation</h1>
  <p>Thank you for your order, ${forename} ${surname}!</p>
  <h2>Shipping Details:</h2>
  <p>${addressLine1}</p>
  ${addressLine2 ? `<p>${addressLine2}</p>` : ''}
  <p>${town}, ${country}</p>
  <h2>Contact Information:</h2>
  <p>Email: ${email}</p>
  <p>Phone: ${phone}</p>
  <h2>Order Summary:</h2>
  <ul>${orderSummary}</ul>
  <p>Total Price: €${totalPrice}</p>
`;


    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: 'Outlook', // Change to your email provider
      auth: {
        user: process.env.OUTLOOK_EMAIL, // Your email
        pass: process.env.OUTLOOK_PASSWORD, // Your email password
      },
    });

    // Email options
    const mailOptions = {
      from: '"Football Kits Shop" <' + process.env.OUTLOOK_EMAIL + '>',
      to: email, // Recipient's email address
      subject: 'Your Order Confirmation',
      html: emailContent, // Email content in HTML format
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
    console.error('Error processing order:', error);
    return res.status(500).json({ message: 'Failed to process order.' });
  }
});

module.exports = router;
