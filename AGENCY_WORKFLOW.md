# 🏢 Agency Workflow - How to Onboard TMA Clients

## Overview

This guide explains how to onboard new TMA clients and provide them with tracking capabilities.

---

## 🔑 How Client ID Works

Each client gets a **unique Client ID** that is embedded in their API key. This allows:

1. **Data Isolation:** Multiple clients can use the same UTM parameter names (e.g., "campaign_111") without data mixing
2. **Automatic Filtering:** When client sends events, their `client_id` is automatically extracted from API key
3. **Analytics Separation:** Agency can request analytics for specific clients using `client_id` parameter

**Example:**
- Client A (clientId: "playdice") has campaign "promo_2024"
- Client B (clientId: "cryptogame") has campaign "promo_2024"
- Both campaigns are tracked separately in the database
- Analytics requests must specify `client_id` to get correct data

---

## 📋 Onboarding Process

### Step 1: Generate API Key for New Client

When a new client wants to integrate tracking, generate a unique API key with a **unique client_id**:

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "client",
    "clientId": "playdice",
    "name": "Play Dice - TMA Bot"
  }'
```

**Important:**
- `clientId` must be **unique** for each client (e.g., "playdice", "cryptogame", "nftapp")
- This allows multiple clients to use the same UTM parameter names (e.g., "campaign_111") without data mixing
- Use lowercase, no spaces (e.g., "my-client" or "myclient")

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "key": "abc123def456...",
    "type": "client",
    "clientId": "playdice",
    "name": "Play Dice - TMA Bot",
    "active": true,
    "createdAt": "2026-01-08T18:00:00.000Z"
  }
}
```

**Save the key** - you'll give this to the client.

---

### Step 2: Provide Integration Instructions to Client

Send the client this information:

**Email Template:**

```
Subject: Your TMA Tracker Integration Details

Hi [Client Name],

Here are your integration details for TMA Tracker:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 YOUR API KEY:
abc123def456...

📚 INTEGRATION GUIDE:
https://github.com/pyton12/tma-tracker-sdk/blob/main/CLIENT_INTEGRATION_GUIDE.md

⚡ QUICK START:

Add this to your TMA's HTML (before </body>):

<script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
<script>
  TMATracks.init({
    apiKey: 'abc123def456...',
    apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
  });
</script>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

That's it! Your app opens will be tracked automatically.

To track payments, call:
TMATracks.trackPayment({ amount: 100 });

Need help? Reply to this email.

Best regards,
Your Agency Team
```

---

### Step 3: Test Client Integration

After client integrates, test their setup:

1. **Check app opens:**
   ```bash
   curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
     -H "x-api-key: 32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c" \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "playdice",
       "utm_parameters": ["test_campaign"]
     }'
   ```

2. **Verify data is coming in:**
   - Check if `unique_users` > 0
   - Check if events are being tracked

**Important:** Always specify `client_id` when requesting analytics to filter data for specific client.

---

### Step 4: Provide Analytics Access

Give client access to their analytics:

**Option A: API Access (for technical clients)**

Provide them with analytics endpoint:
```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: THEIR_AGENCY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "playdice",
    "utm_parameters": ["campaign_1", "campaign_2"]
  }'
```

**Option B: Dashboard (recommended)**

Create a simple dashboard for them (see DASHBOARD_EXAMPLE.md)

---

## 🔧 Client Management

### List All Clients

```bash
curl https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/list \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792"
```

### Deactivate Client Key

If client stops service or violates terms:

```bash
curl -X DELETE https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/delete \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792" \
  -H "Content-Type: application/json" \
  -d '{"key": "client_key_to_deactivate"}'
```

### Generate Agency Key for Client

If client wants to access analytics programmatically:

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "agency",
    "clientId": "playdice",
    "name": "Play Dice - Analytics Access"
  }'
```

**Note:** Agency keys can access analytics for their specific `client_id` only.

---

## 📊 Monitoring

### Check System Health

```bash
curl https://tma-trackerserver-production.up.railway.app/health
```

### Monitor Client Activity

Check which clients are actively using the service:

```bash
curl https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/list \
  -H "x-admin-secret: YOUR_ADMIN_SECRET" | grep lastUsedAt
```

---

## 💰 Pricing Tiers (Example)

You can create different pricing based on usage:

- **Starter:** Up to 10,000 events/month
- **Pro:** Up to 100,000 events/month  
- **Enterprise:** Unlimited

Track usage by monitoring events per API key.

---

## 🎯 Best Practices

1. **Name keys clearly:** Use format "ClientName - BotName"
2. **Document everything:** Keep track of which key belongs to which client
3. **Test before delivery:** Always test integration before sending to client
4. **Provide support:** Be ready to help with integration issues
5. **Monitor usage:** Check for unusual activity or abuse

---

## 📞 Support Workflow

When client has issues:

1. **Check their API key is active:**
   ```bash
   curl https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/list \
     -H "x-admin-secret: YOUR_SECRET" | grep "client_key"
   ```

2. **Check server logs** (Railway dashboard)

3. **Test their integration** with their API key

4. **Provide solution** or escalate to development

---

## 🔐 Security

- **Never share ADMIN_SECRET** with clients
- **Generate unique keys** for each client
- **Deactivate keys** immediately when client leaves
- **Monitor for abuse** (excessive requests, invalid data)
- **Use HTTPS only** for all communications

---

## ✅ Checklist for New Client

- [ ] Generate unique Client API key
- [ ] Send integration instructions
- [ ] Client integrates SDK
- [ ] Test integration (check analytics)
- [ ] Provide analytics access
- [ ] Add to client database/CRM
- [ ] Set up billing (if applicable)
- [ ] Schedule follow-up

---

**Your Production URLs:**

- API: `https://tma-trackerserver-production.up.railway.app`
- SDK CDN: `https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js`
- Admin Secret: `ed713a9e168f12583f3760c3a1dd190cf9e54cd2f334c4cd65a62e0d8f1eb792`
- Agency Key: `32b52648554665f51f92b6f49dc6bade9e72e6d4351eb9fd9445403d4002118c`

