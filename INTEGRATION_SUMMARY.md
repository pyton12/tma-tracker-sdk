# 🎯 TMA Tracker - Integration Summary

## For TMA Owners: How to Integrate

### The Simplest Way (Copy-Paste)

Add this to your TMA's HTML file (before `</body>`):

```html
<!-- TMA Tracker SDK -->
<script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
<script>
  TMATracks.init({
    apiKey: 'YOUR_API_KEY_HERE',
    apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
  });
</script>
```

**That's it!** ✅

---

## What Happens Automatically

When user opens your TMA via campaign link:
```
https://t.me/YOUR_BOT/app?startapp=campaign_name
```

The SDK automatically:
1. ✅ Extracts campaign name (`campaign_name`)
2. ✅ Gets Telegram User ID
3. ✅ Sends "app open" event to analytics server
4. ✅ Stores data for analytics

---

## Track Payments (Optional)

When user pays, add this line:

```javascript
await TMATracks.trackPayment({
  amount: 100, // Telegram Stars
  paymentId: 'optional_id'
});
```

---

## Example: Complete Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My TMA</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
  <h1>My Telegram Mini App</h1>
  <button onclick="buyPremium()">Buy Premium - 100 ⭐</button>

  <!-- TMA Tracker SDK -->
  <script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
  <script>
    // Initialize
    TMATracks.init({
      apiKey: 'YOUR_API_KEY_HERE',
      apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
    });

    // Track payment
    async function buyPremium() {
      // Your payment logic
      const result = await Telegram.WebApp.openInvoice('invoice_link');
      
      if (result.status === 'paid') {
        await TMATracks.trackPayment({
          amount: 100,
          paymentId: result.invoice_id
        });
      }
    }
  </script>
</body>
</html>
```

---

## For Agencies: How to Onboard Clients

### Step 1: Generate API Key

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "client",
    "name": "Client Name - Bot Name"
  }'
```

### Step 2: Send Client Integration Code

Email template:

```
Subject: Your TMA Tracker Integration

Hi [Client],

Add this to your TMA's HTML:

<script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
<script>
  TMATracks.init({
    apiKey: 'abc123...',
    apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
  });
</script>

Done! Your campaigns will be tracked automatically.

Full guide: https://github.com/pyton12/tma-tracker-sdk/blob/main/FOR_TMA_OWNERS.md
```

### Step 3: Provide Analytics Access

Generate agency key for client:

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "agency",
    "name": "Client Name - Analytics Access"
  }'
```

Send them analytics endpoint:

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: THEIR_ANALYTICS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"utm_parameters": ["campaign1", "campaign2"]}'
```

---

## Production URLs

| Resource | URL |
|----------|-----|
| **API Server** | `https://tma-trackerserver-production.up.railway.app` |
| **SDK CDN** | `https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js` |
| **Health Check** | `https://tma-trackerserver-production.up.railway.app/health` |

---

## API Keys (Your Agency)

| Type | Key | Purpose |
|------|-----|---------|
| **Admin Secret** | `ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792` | Manage API keys |
| **Agency Key** | `32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c` | Get analytics |
| **Client Key** | `5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed` | Send events (demo) |

---

## Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| `FOR_TMA_OWNERS.md` | Simple integration guide | TMA owners |
| `CLIENT_INTEGRATION_GUIDE.md` | Detailed integration | TMA developers |
| `AGENCY_WORKFLOW.md` | Client onboarding | Agency team |
| `DEPLOYMENT_GUIDE.md` | Deploy your own | Self-hosters |
| `QUICK_START_ADMIN.md` | Admin API usage | Agency admins |

---

## Quick Test

### 1. Test SDK CDN

```bash
curl -I https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js
```

Should return `200 OK`

### 2. Test Event Tracking

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/events \
  -H "x-api-key: 5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "app_open",
    "data": {
      "utmParameter": "test_campaign",
      "telegramUserId": 123456789
    }
  }'
```

Should return `{"success":true}`

### 3. Test Analytics

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: 32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c" \
  -H "Content-Type: application/json" \
  -d '{"utm_parameters": ["test_campaign"]}'
```

Should return campaign stats

---

## ✅ System Status

- ✅ Server deployed on Railway
- ✅ SDK available via CDN
- ✅ Database configured (SQLite)
- ✅ API keys generated
- ✅ CORS enabled
- ✅ HTTPS enabled
- ✅ Health check working

---

## 🚀 Next Steps

1. **For TMA Owners:** Read `FOR_TMA_OWNERS.md` and integrate
2. **For Agencies:** Read `AGENCY_WORKFLOW.md` to onboard clients
3. **For Self-Hosting:** Read `DEPLOYMENT_GUIDE.md` to deploy your own

---

**Everything is ready for production! 🎉**

