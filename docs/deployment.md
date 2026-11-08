# PaperTrail — Production Deployment Runbook

**Environment:** Production Multi-Cloud  
**Target Hosts:** Vercel (Frontend) • Railway / Render (Backend) • Neon (Database) • Google Play (Mobile)  

---

## 1. Production Architecture Matrix

| Service Tier | Production Provider | Region | Protocol |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | [Vercel](https://vercel.com/) | Global Edge CDN | HTTPS / HTTP/3 |
| **Backend API** | [Railway](https://railway.app/) / Render | AWS `us-east` | HTTPS / TLS 1.3 |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) | AWS `us-east-2` | Pooled Postgres (5432) |
| **Authentication** | [Clerk](https://clerk.com/) | Global | OAuth 2.0 / JWT |
| **Mobile App** | Google Play Store (Capacitor 8) | Global | Native Android APK / AAB |

---

## 2. Database Setup: Neon PostgreSQL

1. **Create a Production Project** on [Neon Console](https://console.neon.tech).
2. **Retrieve the Connection Pooler String:**
   Ensure you select the **Pooled connection** string (contains `-pooler`):
   ```
   postgresql://<username>:<password>@ep-muddy-forest-beeyuukm-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
3. **Execute Production Schema Deployment:**
   From your local development machine or CI pipeline:
   ```bash
   pnpm --filter @papertrail/api prisma:push
   ```
   Or for migration histories:
   ```bash
   npx prisma migrate deploy
   ```

---

## 3. Backend API Deployment (`apps/api`)

Deploy as a containerized Node.js service on Railway, Render, or AWS ECS:

### Build & Start Configurations
* **Root Directory:** `.` (Monorepo root)
* **Build Command:**
  ```bash
  pnpm install && pnpm --filter @papertrail/contracts build && pnpm --filter @papertrail/api build
  ```
* **Start Command:**
  ```bash
  node apps/api/dist/main.js
  ```
* **Port:** Injected via `$PORT` environment variable (defaults to `8000`).

### Production Environment Variables Checklist
```env
NODE_ENV=production
PORT=8000
DATABASE_URL="postgresql://<user>:<pass>@ep-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require"
VAULT_MASTER_KEY="<generate-random-high-entropy-64-character-hex-string>"
CLERK_SECRET_KEY="sk_live_..."
CLERK_PUBLISHABLE_KEY="pk_live_..."
FRONTEND_URL="https://papertrail.app"
```

### Health Check Configuration
* **Health Check Path:** `/api/v1/health`
* **Interval:** 30 seconds
* **Timeout:** 5 seconds
* **Expected Status:** `200 OK`

---

## 4. Frontend Web Deployment (`apps/web`)

Deploy the React 19 SPA to Vercel:

### Vercel Project Settings
* **Framework Preset:** `Vite`
* **Root Directory:** `apps/web`
* **Build Command:** `pnpm build`
* **Output Directory:** `dist`
* **Install Command:** `pnpm install`

### Frontend Environment Variables
```env
VITE_API_URL="https://api.papertrail.app"
VITE_CLERK_PUBLISHABLE_KEY="pk_live_..."
```

### SPA Routing Rule (`vercel.json`)
Ensure all incoming routes fallback to `index.html`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 5. Android Mobile Application Deployment (Capacitor 8)

### Prerequisites
* Android Studio Ladybug or later with Android SDK 35 installed.
* Java 21 JDK configured.

### 1. Compile Web Assets & Sync Native Bridge
```bash
cd apps/web
pnpm build
npx cap sync android
```

### 2. Generate Release Keystore (One-Time)
```bash
keytool -genkey -v -keystore papertrail-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias papertrail
```

### 3. Build Signed Android App Bundle (AAB)
Inside Android Studio:
1. Open folder: `apps/web/android`.
2. Navigate to **Build > Generate Signed Bundle / APK**.
3. Choose **Android App Bundle (.aab)**.
4. Select your `papertrail-release.jks` keystore and supply credentials.
5. Build output target: `release`.
6. Output bundle location: `apps/web/android/app/release/app-release.aab`.

Upload the generated `.aab` file directly to the **Google Play Console** under Production Track.
