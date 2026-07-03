# Payment Integration Setup Guide

## Overview
Your checkout page now supports **Stripe** and **PayPal** payment options. Currently set up with placeholder values—follow these steps to activate real payments.

---

## Current Flow
1. Customer fills shipping form
2. Customer selects payment method (Stripe or PayPal)
3. Customer clicks "Proceed to Payment"
4. Order details are formatted and sent to your contact form
5. **You manually send the payment link** to the customer via email

This approach requires **no backend** and keeps things simple while providing two payment options.

---

## Setup Instructions

### Step 1: Get Your API Keys

#### Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable Key** (starts with `pk_live_` or `pk_test_`)
3. In `checkout.html`, find line ~248:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_live_PLACEHOLDER_YOUR_STRIPE_PUBLISHABLE_KEY';
   ```
4. Replace with your actual key:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_ACTUAL_KEY_HERE';
   ```

**Note:** For testing, use your test publishable key (`pk_test_...`)

#### PayPal Setup
1. Go to [PayPal Developer Portal](https://developer.paypal.com)
2. Copy your **Client ID** from your app credentials
3. In `checkout.html`, find line ~249:
   ```javascript
   const PAYPAL_CLIENT_ID = 'PLACEHOLDER_YOUR_PAYPAL_CLIENT_ID';
   ```
4. Replace with your actual key:
   ```javascript
   const PAYPAL_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE';
   ```

#### Your Email Setup
1. In `checkout.html`, find line ~250:
   ```javascript
   const MERCHANT_EMAIL = 'your-email@kabulart.com';
   ```
2. Replace with your actual email address:
   ```javascript
   const MERCHANT_EMAIL = 'farhad@kabulart.com';
   ```

---

## How It Works

### Stripe Path
1. Customer selects "Stripe"
2. Order summary is formatted with payment method noted
3. Pre-filled contact form sends order to you
4. **You send Stripe Payment Link** to customer via email
   - Create a one-time Payment Link: https://dashboard.stripe.com/payment-links
   - Set amount to customer's order total
   - Send link to customer

### PayPal Path
1. Customer selects "PayPal"
2. Order summary is formatted with payment method noted
3. Pre-filled contact form sends order to you
4. **You send PayPal payment request** to customer via email
   - Use PayPal.me link: `https://www.paypal.me/yourusername/AMOUNT`
   - Or create a PayPal invoice in your dashboard
   - Send to customer

---

## Future Enhancements (Backend Required)

These require a server/backend to implement fully:

### Direct Stripe Integration
- Real-time Payment Link generation
- Automatic webhook handling for payment confirmation
- Direct redirect to Stripe Checkout

### Direct PayPal Integration  
- PayPal Commerce Platform buttons
- Automatic payment confirmation
- Real-time order status updates

---

## Testing

### Test with Stripe
1. Use test publishable key: `pk_test_...`
2. Use test card: `4242 4242 4242 4242`
3. Any future expiration date and any 3-digit CVC

### Test with PayPal
1. Use test Client ID from PayPal sandbox
2. Use sandbox test account for payment

---

## File Locations

- **Payment Configuration:** `checkout.html` (lines 248-250)
- **Payment Styling:** `styles.css` (payment-options section)
- **Payment Logic:** `checkout.html` (handleStripePayment, handlePayPalPayment functions)
- **Order Formatting:** `checkout.html` (buildOrderSummary function)

---

## Troubleshooting

**Payment links not generating?**
- Check that all API keys are correctly copied
- Verify email configuration is set
- Check browser console for JavaScript errors

**Contact form not pre-filling?**
- Ensure `pending-order` localStorage is being set (check DevTools > Application > Storage)
- Verify contact form IDs match: `#name`, `#email`, `#message`

**Customer didn't receive order email?**
- Check your email spam folder
- Verify contact form is properly configured to send emails
- Test the contact form directly from `Kabul-Art.html#contact`

---

## Next Steps

1. ✅ Update Stripe publishable key
2. ✅ Update PayPal Client ID
3. ✅ Update your merchant email
4. ✅ Test checkout flow
5. ✅ Send test orders to yourself
6. ✅ Set up email notification workflow

Once you have both keys configured, customers can select their preferred payment method and you'll receive their order details via the contact form. From there, you send them the payment link via email.

