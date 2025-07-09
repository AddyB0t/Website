# Razorpay Payment Integration Setup

## Overview

This guide explains how to set up Razorpay payment integration for ZapUp's subscription system. The integration supports both monthly and annual billing cycles with secure payment processing.

## Prerequisites

1. Razorpay account (create at https://razorpay.com)
2. Business verification completed on Razorpay
3. Next.js application with authentication (Clerk) already set up

## Setup Instructions

### 1. Get Razorpay API Keys

1. **Create Razorpay Account**
   - Visit https://razorpay.com and sign up
   - Complete business verification process
   - This may take 1-2 business days

2. **Generate API Keys**
   - Log in to Razorpay Dashboard
   - Go to **Settings** → **API Keys**
   - Generate new API key pair
   - Copy both **Key ID** and **Key Secret**

3. **Test vs Live Keys**
   - Use **Test Keys** for development
   - Switch to **Live Keys** only for production
   - Test keys start with `rzp_test_`
   - Live keys start with `rzp_live_`

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# For production, use live keys:
# RAZORPAY_KEY_ID=rzp_live_your_key_id_here
# RAZORPAY_KEY_SECRET=your_live_key_secret_here
```

### 3. Database Setup

The integration requires two additional tables in your Supabase database:

```sql
-- Create payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  plan_id TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add subscription fields to user_preferences table
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT 'explorer';

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX idx_user_preferences_subscription ON user_preferences(subscription_type, subscription_end_date);
```

### 4. Webhook Configuration (Optional but Recommended)

For production, set up webhooks to handle payment status updates:

1. **In Razorpay Dashboard**
   - Go to **Settings** → **Webhooks**
   - Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
   - Select events: `payment.captured`, `payment.failed`, `order.paid`

2. **Webhook Secret**
   - Copy the webhook secret from Razorpay dashboard
   - Add to environment variables:
   ```bash
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
   ```

## Features Implemented

### 1. Payment Flow
- **Order Creation**: Secure order creation with user authentication
- **Checkout Integration**: Razorpay checkout modal with custom branding
- **Payment Verification**: Server-side signature verification
- **Subscription Update**: Automatic subscription activation on successful payment

### 2. Security Features
- **Signature Verification**: All payments verified using HMAC SHA256
- **Authentication Required**: Only authenticated users can initiate payments
- **Amount Validation**: Server-side amount validation
- **Error Handling**: Comprehensive error handling with user feedback

### 3. User Experience
- **Loading States**: Visual feedback during payment processing
- **Toast Notifications**: Success/error messages
- **Responsive Design**: Works on all devices
- **Billing Cycle Toggle**: Easy switching between monthly/annual

### 4. Subscription Management
- **Plan Mapping**: Automatic mapping of payment plans to subscription types
- **Expiry Calculation**: Automatic calculation of subscription end dates
- **Status Tracking**: Real-time subscription status updates

## Testing

### 1. Test Card Details

Use these test card numbers in development:

```
# Successful Payment
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date

# Failed Payment
Card Number: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

### 2. Test UPI

```
UPI ID: success@razorpay
UPI ID: failure@razorpay
```

### 3. Test Amounts

```
₹100 = Success
₹200 = Failure
₹300 = Success after retry
```

## Troubleshooting

### Common Issues

1. **"Payment service not configured"**
   - Check if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
   - Verify environment variables are loaded correctly

2. **"Authentication required"**
   - Ensure user is signed in before initiating payment
   - Check Clerk authentication setup

3. **"Invalid payment signature"**
   - Verify `RAZORPAY_KEY_SECRET` is correct
   - Check if webhook secret matches (if using webhooks)

4. **Payment successful but subscription not updated**
   - Check database connection
   - Verify `user_preferences` table structure
   - Check server logs for detailed error messages

### Debug Mode

Enable debug logging by adding:

```bash
DEBUG=razorpay*
```

## Security Considerations

1. **Never expose Key Secret**: Keep `RAZORPAY_KEY_SECRET` server-side only
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate Signatures**: Always verify payment signatures
4. **Log Transactions**: Keep detailed logs for audit purposes
5. **Regular Key Rotation**: Rotate API keys periodically

## Production Checklist

- [ ] Switch to live Razorpay keys
- [ ] Set up webhook endpoints
- [ ] Configure proper error monitoring
- [ ] Test all payment flows
- [ ] Verify subscription logic
- [ ] Set up payment reconciliation
- [ ] Configure backup payment methods
- [ ] Test refund process (if applicable)

## Support

For issues related to:
- **Razorpay API**: Contact Razorpay support
- **Integration**: Check this documentation or contact development team
- **Business queries**: Contact business team

## API Endpoints

The integration provides these endpoints:

- `POST /api/razorpay/create-order` - Create payment order
- `POST /api/razorpay/verify-payment` - Verify payment completion
- `POST /api/razorpay/webhook` - Handle webhook events (optional)

## Cost Considerations

Razorpay charges:
- **Domestic Cards**: 2% + GST
- **International Cards**: 3% + GST
- **UPI**: 0.5% + GST
- **Net Banking**: 1.5% + GST

Calculate pricing accordingly and consider these fees in your subscription prices. 