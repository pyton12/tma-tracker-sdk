# 📊 TMA Tracker SDK

**Automated tracking SDK for Telegram Mini Apps advertising campaign effectiveness**

Track unique users, monitor Telegram Stars payments, and get detailed analytics for your TMA advertising campaigns.

---

## ✨ Features

- 📈 **Track unique users** via UTM parameters
- 💰 **Monitor Telegram Stars payments** automatically
- 📊 **Analytics API** for agencies without direct database access
- 🔐 **Secure access** via API keys
- 🔗 **Base64 encoded UTM** support for clean links
- 🌐 **CDN-hosted SDK** for easy integration
- 🚀 **Production-ready** with Railway deployment

---

## 🏗️ Project Structure

```
tma-tracker-sdk/
├── packages/
│   ├── client/     # Browser SDK (UMD, ESM, CJS)
│   └── server/     # API Server (Express + Prisma)
├── examples/       # Integration examples
└── docs/          # Documentation
```

**Monorepo architecture:**
- **Client SDK**: Lightweight JavaScript library (~4KB) for TMA integration
- **Server API**: Backend service for data collection and analytics
- **CDN Endpoint**: Hosted SDK for easy integration

---

## 🚀 Quick Start

### For TMA Owners (5-minute integration)

Add this to your TMA's HTML:

```html
<script src="https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js"></script>
<script>
  TMATracks.init({
    apiKey: 'YOUR_API_KEY',
    apiEndpoint: 'https://tma-trackerserver-production.up.railway.app'
  });
</script>
```

**That's it!** See [TMA_INTEGRATION_GUIDE.md](./TMA_INTEGRATION_GUIDE.md) for complete guide.

### For Agencies (Client onboarding)

See [AGENCY_WORKFLOW.md](./AGENCY_WORKFLOW.md) for how to onboard TMA clients.

### For Developers (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Setup server environment
cp packages/server/.env.example packages/server/.env
# Edit .env with your settings

# 3. Generate Prisma client
npm run prisma:generate

# 4. Run database migrations
npm run prisma:migrate

# 5. Build all packages
npm run build

# 6. Start development server
npm run dev:server
```

---

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
# Install all monorepo dependencies
npm install
```

### 2. Configure Server

```bash
# Copy environment example
cp packages/server/.env.example packages/server/.env

# Edit .env file with your configuration

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

### 3. Build

```bash
# Build all packages
npm run build

# Or build individually
npm run build -w packages/client
npm run build -w packages/server
```

---

## 🛠️ Development

```bash
# Run client in dev mode
npm run dev:client

# Run server in dev mode
npm run dev:server
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific package
npm test -w packages/client
npm test -w packages/server
```

---

## 🎨 Linting & Formatting

```bash
# Check code
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

---

## 📚 Documentation

### 🎯 For TMA Owners:
- **[TMA_INTEGRATION_GUIDE.md](./TMA_INTEGRATION_GUIDE.md)** - Complete integration guide (start here!)

### 🏢 For Agencies:
- **[AGENCY_WORKFLOW.md](./AGENCY_WORKFLOW.md)** - Client onboarding workflow

### 🚀 For Deployment:
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy to Railway/VPS

### 🛠️ For Developers:
- **[TESTING_PLAN.md](./TESTING_PLAN.md)** - Testing strategy

---

## ✅ Production Status

- ✅ **Server deployed** on Railway
- ✅ **SDK available via CDN** (`https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js`)
- ✅ **Client SDK built** (UMD, ESM, CJS formats)
- ✅ **API endpoints verified** and working
- ✅ **Database configured** (SQLite with Prisma)
- ✅ **API keys generated** (Admin, Agency, Client)
- ✅ **App open tracking** working
- ✅ **Payment tracking** working
- ✅ **Analytics API** returning correct data
- ✅ **CORS enabled** for Telegram WebApp
- ✅ **HTTPS enabled** via Railway

**Status:** 🚀 Production-ready and deployed!

### Production URLs:
- **API Server:** `https://tma-trackerserver-production.up.railway.app`
- **SDK CDN:** `https://tma-trackerserver-production.up.railway.app/sdk/tma-tracker.min.js`
- **Health Check:** `https://tma-trackerserver-production.up.railway.app/health`

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build all packages |
| `npm run dev:client` | Run client in dev mode |
| `npm run dev:server` | Run server in dev mode |
| `npm test` | Run all tests |
| `npm run lint` | Check code quality |
| `npm run format` | Format code |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues and questions, please open an issue on GitHub.
