# 🎯 TMA Tracker - For TMA Owners

## What is this?

TMA Tracker helps you track which marketing campaigns bring users and revenue to your Telegram Mini App.

**What you get:**
- ✅ Track app opens per campaign
- ✅ Track payments per campaign  
- ✅ See conversion rates
- ✅ Measure ROI for each marketing channel

---

## 🚀 Integration (5 minutes)

### Step 1: Get your API key

Contact your analytics agency to get your unique API key.

### Step 2: Add SDK to your TMA

Add these 2 lines to your HTML file (before closing `</body>` tag):

```html
<!-- TMA Tracker SDK -->
<script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
<script>
  TMATracks.init({
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your key
    apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
  });
</script>
```

**That's it!** App opens are now tracked automatically.

### Step 3: Track payments (optional)

When user completes a payment, add this:

```javascript
await TMATracks.trackPayment({
  amount: 100, // Amount in Telegram Stars
  paymentId: 'optional_transaction_id'
});
```

---

## 📊 How to use campaigns

### Create campaign links

Instead of sharing:
```
https://t.me/YOUR_BOT/app
```

Share campaign-specific links:
```
https://t.me/YOUR_BOT/app?startapp=instagram_story
https://t.me/YOUR_BOT/app?startapp=youtube_video
https://t.me/YOUR_BOT/app?startapp=telegram_channel
```

### Track results

Ask your agency for analytics, or use the API:

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: YOUR_ANALYTICS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"utm_parameters": ["instagram_story", "youtube_video"]}'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "utm_parameter": "instagram_story",
      "unique_users": 1523,
      "paying_users": 87,
      "total_revenue_stars": 12400,
      "conversion_rate": 5.71
    },
    {
      "utm_parameter": "youtube_video",
      "unique_users": 892,
      "paying_users": 34,
      "total_revenue_stars": 5100,
      "conversion_rate": 3.81
    }
  ]
}
```

---

## 💡 Use Cases

### 1. Test different influencers

```
https://t.me/YOUR_BOT/app?startapp=influencer_john
https://t.me/YOUR_BOT/app?startapp=influencer_mary
```

See which influencer brings more paying users.

### 2. Test different ad platforms

```
https://t.me/YOUR_BOT/app?startapp=facebook_ads
https://t.me/YOUR_BOT/app?startapp=google_ads
https://t.me/YOUR_BOT/app?startapp=tiktok_ads
```

Compare ROI across platforms.

### 3. Test different creatives

```
https://t.me/YOUR_BOT/app?startapp=video_ad_v1
https://t.me/YOUR_BOT/app?startapp=video_ad_v2
```

A/B test your marketing materials.

---

## 🔧 Complete Example

See `examples/client-ready-example.html` for a complete working example.

**Quick test:**

1. Download the example file
2. Replace `YOUR_API_KEY_HERE` with your actual key
3. Upload to your server
4. Open in Telegram

---

## 📱 Framework-Specific Examples

### React

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize tracker
    if (window.TMATracks) {
      window.TMATracks.init({
        apiKey: 'YOUR_API_KEY',
        apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
      });
    }
  }, []);

  const handlePayment = async (amount) => {
    // Your payment logic
    const result = await processPayment(amount);
    
    if (result.success) {
      await window.TMATracks.trackPayment({
        amount: amount,
        paymentId: result.id
      });
    }
  };

  return <YourApp />;
}
```

### Vue

```vue
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  window.TMATracks.init({
    apiKey: 'YOUR_API_KEY',
    apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
  });
});

const handlePayment = async (amount) => {
  // Your payment logic
  const result = await processPayment(amount);
  
  if (result.success) {
    await window.TMATracks.trackPayment({
      amount: amount,
      paymentId: result.id
    });
  }
};
</script>
```

### Next.js

```jsx
// pages/_app.js
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.TMATracks) {
      window.TMATracks.init({
        apiKey: 'YOUR_API_KEY',
        apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
      });
    }
  }, []);

  return <Component {...pageProps} />;
}
```

---

## ❓ FAQ

**Q: Does this slow down my app?**  
A: No. SDK is ~4KB and loads asynchronously.

**Q: What data is collected?**  
A: Only: Telegram User ID, campaign name, and payment amounts. No personal data.

**Q: Is it GDPR compliant?**  
A: Yes. Minimal data collection, no cookies, no personal information.

**Q: Can I self-host?**  
A: Yes! See `DEPLOYMENT_GUIDE.md` for instructions.

**Q: How much does it cost?**  
A: Contact your analytics agency for pricing.

**Q: Can I see the source code?**  
A: Yes! It's open source: https://github.com/pyton12/tma-tracker-sdk

---

## 🔐 Security

- ✅ HTTPS only
- ✅ No cookies
- ✅ No localStorage
- ✅ No personal data
- ✅ Open source code

---

## 📞 Support

- **Documentation:** https://github.com/pyton12/tma-tracker-sdk
- **Issues:** https://github.com/pyton12/tma-tracker-sdk/issues
- **Agency Support:** Contact your analytics provider

---

## ✅ Quick Checklist

Before going live:

- [ ] SDK script tag added to HTML
- [ ] API key configured
- [ ] Tested with at least 2 different campaigns
- [ ] Payment tracking implemented (if applicable)
- [ ] Verified data appears in analytics

---

**Ready to track your campaigns? Add the SDK and start measuring! 🚀**

