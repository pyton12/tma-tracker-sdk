# 🎯 TMA Tracker - Integration Guide for TMA Owners

## Quick Start (5 minutes)

### Step 1: Add SDK to your TMA

Add this **single line** to your TMA's HTML file (before closing `</body>` tag):

```html
<script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
```

### Step 2: Initialize with your API key

Add this script **after** the SDK:

```html
<script>
  TMATracks.init({
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your key
    apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
  });
</script>
```

### Step 3: Track payments (optional)

When user completes a payment, call:

```javascript
TMATracks.trackPayment({
  amount: 100, // Amount in Telegram Stars
  paymentId: 'optional_transaction_id'
});
```

---

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Your TMA</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
  <!-- Your TMA content -->
  <div id="app">
    <h1>My Telegram Mini App</h1>
    <button onclick="handlePayment()">Buy 100 Stars</button>
  </div>

  <!-- TMA Tracker SDK -->
  <script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
  <script>
    // Initialize tracker
    TMATracks.init({
      apiKey: 'YOUR_API_KEY_HERE',
      apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
    });

    // Track payment when user pays
    async function handlePayment() {
      // Your payment logic here
      const result = await Telegram.WebApp.openInvoice('your_invoice_link');
      
      if (result.status === 'paid') {
        // Track the payment
        await TMATracks.trackPayment({
          amount: 100,
          paymentId: result.invoice_id
        });
        
        alert('Payment tracked! ✅');
      }
    }
  </script>
</body>
</html>
```

---

## What Gets Tracked Automatically

✅ **App Opens** - Tracked automatically when user opens your TMA  
✅ **UTM Campaigns** - Extracted from `?startapp=campaign_name`  
✅ **User ID** - From Telegram WebApp  
✅ **Payments** - When you call `trackPayment()`

---

## Testing Your Integration

### Test with different campaigns:

1. **Campaign 1:**
   ```
   https://t.me/YOUR_BOT/app?startapp=campaign_1
   ```

2. **Campaign 2:**
   ```
   https://t.me/YOUR_BOT/app?startapp=campaign_2
   ```

3. **Campaign 3:**
   ```
   https://t.me/YOUR_BOT/app?startapp=promo_summer
   ```

### Check if it works:

1. Open Telegram Desktop
2. Open your TMA
3. Press `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac)
4. Check Console - you should see:
   ```
   ✅ TMA Tracker initialized
   📊 Campaign: campaign_1
   ```

---

## API Reference

### `TMATracks.init(config)`

Initialize the SDK.

**Parameters:**
- `apiKey` (string, required) - Your unique API key
- `apiEndpoint` (string, required) - API endpoint URL
- `debug` (boolean, optional) - Enable debug logs (default: false)

**Example:**
```javascript
TMATracks.init({
  apiKey: 'your_key_here',
  apiEndpoint: 'https://tma-trackerserver-production.up.railway.app',
  debug: false
});
```

### `TMATracks.trackPayment(params)`

Track a payment.

**Parameters:**
- `amount` (number, required) - Amount in Telegram Stars
- `paymentId` (string, optional) - Transaction ID

**Example:**
```javascript
await TMATracks.trackPayment({
  amount: 100,
  paymentId: 'txn_123456'
});
```

### `TMATracks.getUtmParameter()`

Get current UTM campaign parameter.

**Returns:** `string | null`

**Example:**
```javascript
const campaign = TMATracks.getUtmParameter();
console.log('Current campaign:', campaign); // "campaign_1"
```

---

## Security & Privacy

✅ **No personal data stored** - Only Telegram User ID and campaign info  
✅ **HTTPS only** - All data transmitted securely  
✅ **GDPR compliant** - Minimal data collection  
✅ **No cookies** - Uses Telegram WebApp data only  

---

## Troubleshooting

### SDK not loading

**Problem:** Script tag doesn't load SDK

**Solution:** Check your internet connection and CDN availability:
```bash
curl https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js
```

### Events not tracked

**Problem:** No data appears in analytics

**Solution:** 
1. Check API key is correct
2. Check browser console for errors
3. Verify CORS is enabled (should work automatically)

### UTM parameter is null

**Problem:** `getUtmParameter()` returns null

**Solution:** Make sure your TMA link includes `?startapp=campaign_name`:
```
https://t.me/YOUR_BOT/app?startapp=my_campaign
```

---

## Support

Need help? Contact your agency or check:
- GitHub Issues: https://github.com/pyton12/tma-tracker-sdk/issues
- Documentation: https://github.com/pyton12/tma-tracker-sdk

---

## License

This SDK is provided by your analytics agency. Usage is subject to your service agreement.

