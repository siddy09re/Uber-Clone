const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

module.exports.paymement = async (req, res, next) => {
  try {
    const rideDetails = req.body;
    console.log("The ride detaqils are " , rideDetails)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Ride from ${rideDetails.Pickup} to ${rideDetails.Destination}`,
            },
            unit_amount: rideDetails.Fare * 100, // Stripe expects amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/User-riding', 
      cancel_url: 'http://localhost:5173/User-riding',
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url, // ✅ send the URL so user can redirect
    });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ message: 'Payment session creation failed' });
  }
};
