# 🎯 TMA Tracker - For TMA Owners

## What is this?

TMA Tracker is a simple SDK that tracks user activity in your Telegram Mini App.

**What it does:**
- ✅ Automatically tracks when users open your app
- ✅ Tracks payments when users buy something
- ✅ Sends data to your analytics agency

**What you need to do:**
- ✅ Add 2 lines of code to your TMA
- ✅ Call one function when user pays

That's it! Your agency handles everything else.

---

## 🚀 Integration (5 minutes)

### Step 1: Add SDK to your TMA

Your agency provided you with an **API key**. Add these 2 lines to your HTML file (before closing `</body>` tag):

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

**That's it!** App opens are now tracked automatically. ✅

### Step 2: Track payments (optional)

When user completes a payment, add this:

```javascript
await TMATracks.trackPayment({
  amount: 100, // Amount in Telegram Stars
  paymentId: 'optional_transaction_id'
});
```

---

## ✅ What Happens Next

Once integrated:

1. **SDK tracks automatically** - App opens are sent to your agency
2. **Agency creates campaign links** - They'll give you special links for different marketing channels
3. **You get reports** - Your agency provides analytics and insights
4. **You optimize** - Focus on channels that bring the best results

**You don't need to:**
- ❌ Manage campaigns yourself
- ❌ Access analytics directly
- ❌ Generate tracking links
- ❌ Understand the technical details

Your agency handles all of that! 🎯

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
A: No. SDK is ~4KB and loads asynchronously. No impact on performance.

**Q: What data is collected?**
A: Only: Telegram User ID (anonymous), and payment amounts. No personal data.

**Q: Is it GDPR compliant?**
A: Yes. Minimal data collection, no cookies, no personal information.

**Q: Do I need to manage campaigns?**
A: No. Your agency creates and manages all campaign links for you.

**Q: How do I see analytics?**
A: Your agency provides reports. You don't need direct access.

**Q: What if I have issues?**
A: Contact your agency support team.

---

## 🔐 Security

- ✅ HTTPS only
- ✅ No cookies
- ✅ No localStorage
- ✅ No personal data
- ✅ Open source code

---

## 📞 Support

**Need help?** Contact your analytics agency.

They will help you with:
- Integration issues
- Testing and verification
- Payment tracking setup
- Any technical questions

---

## ✅ Quick Checklist

Before going live:

- [ ] SDK script tag added to HTML
- [ ] API key configured (provided by agency)
- [ ] Payment tracking implemented (if you have payments)
- [ ] Tested in Telegram (open your TMA and check console)
- [ ] Notified your agency that integration is complete

---

**That's all you need to do! Your agency will handle the rest. 🚀**

