# 🚀 Agency Cheatsheet - Quick Reference

## 📋 Onboarding New Client (3 steps)

### Step 1: Generate API Key

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "client",
    "name": "ClientName - BotName"
  }'
```

**Save the key from response!**

---

### Step 2: Send Client Integration Instructions

**Email Template:**

```
Subject: TMA Tracker Integration - Your API Key

Hi [Client Name],

Here's your API key for TMA Tracker:

🔑 API Key: [PASTE_KEY_HERE]

📚 Integration Guide:
https://github.com/pyton12/tma-tracker-sdk/blob/main/FOR_TMA_OWNERS.md

⚡ Quick Start:
Add this to your TMA's HTML (before </body>):

<script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
<script>
  TMATracks.init({
    apiKey: '[PASTE_KEY_HERE]',
    apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
  });
</script>

That's it! Let us know when it's live.

Best regards,
[Your Agency]
```

---

### Step 3: Create Campaign Links for Client

When client is ready to launch campaigns:

```
Base link: https://t.me/CLIENT_BOT/app

Campaign links:
https://t.me/CLIENT_BOT/app?startapp=instagram_promo
https://t.me/CLIENT_BOT/app?startapp=youtube_video
https://t.me/CLIENT_BOT/app?startapp=telegram_channel
https://t.me/CLIENT_BOT/app?startapp=influencer_john
```

**Naming convention:**
- Use lowercase
- Use underscores (not spaces)
- Be descriptive: `platform_campaign_variant`

---

## 📊 Get Analytics for Client

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: 32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c" \
  -H "Content-Type: application/json" \
  -d '{
    "utm_parameters": ["instagram_promo", "youtube_video", "telegram_channel"]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "utm_parameter": "instagram_promo",
      "unique_users": 1523,
      "paying_users": 87,
      "total_revenue_stars": 12400,
      "conversion_rate": 5.71
    }
  ]
}
```

---

## 🔧 Client Management

### List All Clients

```bash
curl https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/list \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792"
```

### Deactivate Client

```bash
curl -X DELETE https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/delete \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792" \
  -H "Content-Type: application/json" \
  -d '{"key": "CLIENT_KEY_TO_REMOVE"}'
```

---

## 🧪 Test Client Integration

### 1. Check if SDK loads

Ask client to:
1. Open TMA in Telegram Desktop
2. Press `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac)
3. Check Console for: `✅ TMA Tracker initialized`

### 2. Test with campaign link

```
https://t.me/CLIENT_BOT/app?startapp=test_campaign
```

### 3. Verify data

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: 32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c" \
  -H "Content-Type: application/json" \
  -d '{"utm_parameters": ["test_campaign"]}'
```

Should show `unique_users: 1` or more.

---

## 🔐 Your Production Credentials

| Type | Value | Usage |
|------|-------|-------|
| **Admin Secret** | `ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792` | Generate/manage keys |
| **Agency Key** | `32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c` | Get analytics |
| **API URL** | `https://tma-trackerserver-production.up.railway.app` | All endpoints |
| **SDK CDN** | `https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js` | Client integration |

**⚠️ NEVER share Admin Secret with clients!**

---

## 📊 Campaign Best Practices

### Naming Conventions

✅ **Good:**
- `instagram_story_jan2026`
- `youtube_tutorial_v1`
- `influencer_john_promo`
- `telegram_channel_announcement`

❌ **Bad:**
- `Campaign 1` (spaces, not descriptive)
- `test` (too generic)
- `INSTAGRAM` (use lowercase)

### Recommended Campaign Structure

```
Platform_Source_Variant_Date

Examples:
- instagram_story_v1_jan2026
- youtube_video_tutorial_jan2026
- telegram_channel_main_jan2026
- influencer_john_story_jan2026
```

---

## 🎯 Client Deliverables

### Weekly Report Template

```
Campaign Performance Report
Week: [Date Range]

Campaign: instagram_promo
- Unique Users: 1,523
- Paying Users: 87
- Revenue: 12,400 Stars
- Conversion Rate: 5.71%
- Cost per User: [Your calculation]
- ROI: [Your calculation]

Top Performing Campaign: [Name]
Recommendation: [Your insights]
```

---

## 🆘 Troubleshooting

### Client says "SDK not working"

1. **Check API key is active:**
   ```bash
   curl https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/list \
     -H "x-admin-secret: YOUR_SECRET" | grep "client_key"
   ```

2. **Check server health:**
   ```bash
   curl https://tma-trackerserver-production.up.railway.app/health
   ```

3. **Ask client to check browser console** for errors

### No data in analytics

1. **Verify client integrated SDK** (check their HTML source)
2. **Test campaign link yourself**
3. **Check if events are being sent** (Railway logs)

---

## ✅ Quick Checklist

For each new client:

- [ ] Generate unique Client API key
- [ ] Send integration email with key
- [ ] Client confirms integration complete
- [ ] Test with campaign link
- [ ] Verify data appears in analytics
- [ ] Create campaign links for client
- [ ] Set up reporting schedule
- [ ] Add to client database/CRM

---

**Everything you need to onboard and manage clients! 🚀**

