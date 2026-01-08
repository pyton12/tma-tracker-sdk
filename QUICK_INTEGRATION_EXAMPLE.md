# 🚀 Quick Integration Example

## Your Production Setup

**API URL:** `https://tma-trackerserver-production.up.railway.app`  
**Client API Key:** `5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed`  
**Agency API Key:** `32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c`  
**Your TMA Bot:** `https://t.me/playdiceebot/app`

---

## Option 1: Copy SDK File (Fastest) ⚡

### Step 1: Copy the SDK to your TMA project

```bash
# Copy UMD build (works everywhere)
cp /home/deploy/tma-tracker-sdk/packages/client/dist/index.umd.js /path/to/your/tma/public/tma-tracker.js
```

### Step 2: Add to your HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>Your TMA</title>
</head>
<body>
  <div id="app">Your TMA content</div>

  <!-- Load SDK -->
  <script src="/tma-tracker.js"></script>
  
  <!-- Initialize -->
  <script>
    // Initialize on page load
    window.addEventListener('DOMContentLoaded', async () => {
      try {
        await TMATracks.init({
          apiKey: '5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed',
          apiEndpoint: 'https://tma-trackerserver-production.up.railway.app',
          debug: true // Set to false in production
        });

        console.log('✅ TMA Tracker initialized');
        console.log('📊 UTM parameter:', TMATracks.getUtmParameter());
      } catch (error) {
        console.error('❌ Failed to init tracker:', error);
      }
    });

    // Track payment when user pays
    async function onPaymentSuccess(amount, paymentId) {
      try {
        await TMATracks.trackPayment({
          amount: amount,
          paymentId: paymentId
        });
        console.log('✅ Payment tracked');
      } catch (error) {
        console.error('❌ Failed to track payment:', error);
      }
    }
  </script>
</body>
</html>
```

---

## Option 2: ES Module Import (Modern)

### Step 1: Copy ESM build

```bash
cp /home/deploy/tma-tracker-sdk/packages/client/dist/index.esm.js /path/to/your/tma/src/lib/tma-tracker.js
```

### Step 2: Import in your code

```javascript
// main.js or app.js
import TMATracks from './lib/tma-tracker.js';

// Initialize
async function initTracker() {
  try {
    await TMATracks.init({
      apiKey: '5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed',
      apiEndpoint: 'https://tma-trackerserver-production.up.railway.app',
      debug: false
    });

    console.log('✅ Tracker ready');
    console.log('📊 Campaign:', TMATracks.getUtmParameter());
  } catch (error) {
    console.error('❌ Init failed:', error);
  }
}

initTracker();

// Track payment
export async function trackPayment(amount, paymentId) {
  await TMATracks.trackPayment({ amount, paymentId });
}
```

---

## Option 3: React/Vite Integration

### Step 1: Copy to public folder

```bash
cp /home/deploy/tma-tracker-sdk/packages/client/dist/index.esm.js /path/to/your/tma/src/lib/tma-tracker.js
```

### Step 2: Create hook

```typescript
// src/hooks/useTMATracker.ts
import { useEffect } from 'react';
import TMATracks from '../lib/tma-tracker.js';

export function useTMATracker() {
  useEffect(() => {
    TMATracks.init({
      apiKey: '5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed',
      apiEndpoint: 'https://tma-trackerserver-production.up.railway.app',
      debug: import.meta.env.DEV
    }).catch(console.error);
  }, []);

  return {
    trackPayment: TMATracks.trackPayment,
    getUtmParameter: TMATracks.getUtmParameter
  };
}
```

### Step 3: Use in App

```typescript
// src/App.tsx
import { useTMATracker } from './hooks/useTMATracker';

function App() {
  const { trackPayment, getUtmParameter } = useTMATracker();

  const handlePayment = async () => {
    // Your payment logic
    const result = await processPayment();
    
    if (result.success) {
      await trackPayment({
        amount: 100,
        paymentId: result.id
      });
    }
  };

  return (
    <div>
      <h1>Campaign: {getUtmParameter()}</h1>
      <button onClick={handlePayment}>Pay 100 Stars</button>
    </div>
  );
}
```

---

## Test Your Integration

### Test Links

1. **Campaign 1:**
   ```
   https://t.me/playdiceebot/app?startapp=campaign_1
   ```

2. **Campaign 2:**
   ```
   https://t.me/playdiceebot/app?startapp=campaign_2
   ```

3. **Campaign 3:**
   ```
   https://t.me/playdiceebot/app?startapp=campaign_3
   ```

### Check Console

Open Telegram Desktop → Open your TMA → Press `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac)

You should see:
```
✅ TMA Tracker initialized
📊 UTM parameter: campaign_1
```

### Check Network Tab

You should see POST request to:
```
https://tma-trackerserver-production.up.railway.app/api/v1/events
```

Response:
```json
{"success":true,"message":"App open tracked successfully"}
```

---

## Get Analytics

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: 32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c" \
  -H "Content-Type: application/json" \
  -d '{"utm_parameters": ["campaign_1", "campaign_2", "campaign_3"]}'
```

---

## ✅ Done!

Your TMA is now tracking:
- ✅ App opens per campaign
- ✅ Payments per campaign
- ✅ Conversion rates
- ✅ Revenue in Telegram Stars

