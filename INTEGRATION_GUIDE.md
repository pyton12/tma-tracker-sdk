# TMA Tracker SDK - Integration Guide

## Quick Start

### 1. Add SDK to your HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your TMA App</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
  <!-- Your app content -->
  
  <!-- TMA Tracker SDK -->
  <script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
  
  <script>
    // Initialize Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // Initialize TMA Tracker (Non-blocking for fast app launch)
    function initTracker() {
      // Check if SDK is loaded
      if (typeof TMATracks === 'undefined') {
        console.warn('⚠️ TMATracks SDK not loaded, retrying...');
        setTimeout(initTracker, 100); // Retry after 100ms
        return;
      }

      // Fire-and-forget initialization (doesn't block app)
      TMATracks.init({
        apiKey: 'YOUR_API_KEY_HERE',
        apiEndpoint: 'https://tma-trackerserver-production.up.railway.app',
        debug: true // Enable debug logging
      })
        .then(() => {
          console.log('✅ TMA Tracker initialized');
        })
        .catch(error => {
          console.error('❌ Failed to initialize TMA Tracker:', error);
          // App continues working even if tracking fails
        });
    }

    // Start initialization immediately (non-blocking)
    initTracker();
  </script>
</body>
</html>
```

### 2. Track Payments

```javascript
async function handlePayment(amount, paymentId) {
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
```

## Performance Optimization

### 🚀 Fast App Launch (Recommended)

**Don't block app launch waiting for tracker:**

```javascript
// ❌ BAD - Blocks app launch
async function init() {
  await initTracker(); // Waits for tracker
  showApp(); // App shows only after tracker is ready
}

// ✅ GOOD - Non-blocking
function init() {
  initTracker(); // Runs in background
  showApp(); // App shows immediately
}
```

### Key optimizations:

1. **Use `defer`** on script tag - doesn't block HTML parsing
2. **Fire-and-forget** - Don't `await` tracker initialization
3. **Retry logic** - Auto-retry if SDK not loaded yet
4. **Graceful degradation** - App works even if tracking fails

## Important Notes

### ✅ DO:
- Load SDK script **before** calling `TMATracks.init()`
- Check `typeof TMATracks !== 'undefined'` before using
- Use **fire-and-forget** pattern for non-blocking init
- Enable `debug: true` during development
- Use `defer` attribute on script tag

### ❌ DON'T:
- Don't call `window.TMATracks` - use `TMATracks` directly
- Don't `await` tracker init in app startup flow
- Don't block app launch waiting for tracker
- Don't forget to replace `YOUR_API_KEY_HERE`

## Testing

1. Open your TMA with UTM parameter:
   ```
   https://t.me/YourBot/app?startapp=test123
   ```

2. Open Web Inspector (Console)

3. Look for:
   ```
   [TMA Tracker] Initializing TMA Tracker SDK
   [TMA Tracker] UTM Parameter: test123
   [TMA Tracker] Tracking app open: {...}
   [TMA Tracker] App open tracked successfully
   [TMA Tracker] SDK initialized successfully
   ```

## Troubleshooting

### Error: `TMATracks is not defined`
**Solution:** SDK script not loaded yet. Add `async defer` to script tag and wait for load.

### Error: `TMATracks.init is not a function`
**Solution:** Check if SDK loaded: `typeof TMATracks !== 'undefined'`

### No UTM parameter tracked
**Solution:** Make sure you open TMA with `?startapp=YOUR_UTM` parameter

## Get API Key

Contact admin to get your API key or use Admin API:

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/api-keys \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET" \
  -d '{
    "type": "client",
    "name": "My TMA App"
  }'
```

## Support

For issues, check:
- Railway logs: https://railway.app
- GitHub: https://github.com/pyton12/tma-tracker-sdk

