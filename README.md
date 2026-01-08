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
- 🚀 **Production-ready** with Railway deployment guide

---

## 🏗️ Project Structure

```
tma-tracker-sdk/
├── packages/
│   ├── client/     # Browser SDK (UMD, ESM, CJS)
│   └── server/     # API Server (Express + Prisma)
```

**Monorepo architecture:**
- **Client SDK**: Lightweight JavaScript library for TMA integration
- **Server API**: Backend service for data collection and analytics

---

## 🚀 Quick Start

### For TMA Owners (Integration)

If you already have a TMA bot and want to add tracking:

1. **Deploy the server** → See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. **Integrate SDK into your TMA** → See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

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

### For Developers:
- **[QUICK_START.md](./QUICK_START.md)** - Quick start for local development
- **[TMA_Tracker_SDK_Technical_Specification.md](./TMA_Tracker_SDK_Technical_Specification.md)** - Technical specification

### For Production:
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step production deployment guide
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed SDK implementation guide for your TMA bot

### Testing:
- **[TESTING_PLAN.md](./TESTING_PLAN.md)** - Testing strategy and plan
- **[test-tma.html](./test-tma.html)** - Interactive test page for SDK verification

---

## ✅ Project Status

- ✅ Server running and tested
- ✅ Client SDK built (UMD, ESM, CJS formats)
- ✅ API endpoints verified
- ✅ Database configured (SQLite)
- ✅ API keys generated
- ✅ `app_open` tracking working
- ✅ Payment tracking working
- ✅ Analytics API returning correct data

**Status:** Production-ready ✨

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
