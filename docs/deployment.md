# PaperTrail — Production Deployment Guide

This guide covers deployment instructions for all three PaperTrail applications and their supporting infrastructure.

---

## 1. Infrastructure Requirements

1. **Database**: [Neon Serverless PostgreSQL](https://neon.tech/)
2. **Object Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) (S3-compatible API)
3. **Authentication**: [Clerk](https://clerk.com/)
4. **Backend Hosting**: [Railway](https://railway.app/), Render, or AWS ECS
5. **Web Hosting**: [Vercel](https://vercel.com/) or Cloudflare Pages
6. **Mobile Builds**: [Capacitor](https://capacitorjs.com/) & Android Studio / Gradle
7. **Email Delivery**: [Resend](https://resend.com/)

---

## 2. Cloudflare R2 Bucket Configuration

1. Create a private R2 bucket named `papertrail-vault`.
2. Generate an **R2 API Token** with `Object Read & Write` permissions.
3. Configure the **CORS Policy** in the Cloudflare Dashboard to permit direct client uploads:

```json
[
  {
    "AllowedOrigins": [
      "https://papertrail.app",
      "http://localhost:5173"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-Length", "Authorization"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 3. Database Deployment (Neon PostgreSQL)

1. Provision a Neon project and copy the connection string.
2. In the monorepo root, set `DATABASE_URL` in your environment:
   ```bash
   DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/papertrail?sslmode=require"
   ```
3. Run the Prisma migration:
   ```bash
   pnpm --filter @papertrail/api prisma:push
   ```

---

## 4. Backend API Deployment (`apps/api`)

Deploy to Railway, Render, or any Docker/Node.js host:

- **Build Command**: `pnpm --filter @papertrail/api build`
- **Start Command**: `node apps/api/dist/main.js`
- **Port**: `8000` (or injected `PORT`)
- **Required Environment Variables**:
  - `DATABASE_URL`
  - `CLOUDFLARE_R2_ACCOUNT_ID`
  - `CLOUDFLARE_R2_ACCESS_KEY_ID`
  - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
  - `CLOUDFLARE_R2_BUCKET_NAME`
  - `CLERK_SECRET_KEY`
  - `GEMINI_API_KEY`

---

## 5. Web Application Deployment (`apps/web`)

Deploy the React SPA to Vercel or Cloudflare Pages:

- **Framework Preset**: Vite
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://api.papertrail.app`
  - `VITE_CLERK_PUBLISHABLE_KEY`: `pk_live_...`

---

## 6. Android Mobile Application Builds (`apps/web/android`)

PaperTrail packages natively for Android via **Capacitor**:

### Prerequisites
- Android Studio Ladybug or later with Android SDK Platform 35
- Java 21 JDK configured (`JAVA_HOME`)

### Sync Web Assets & Plugins
Build the web bundle and sync assets to the native Android container:
```bash
cd apps/web
pnpm build
npx cap sync android
```

### Build Android Standalone APK (Debug / Testing)
```bash
cd apps/web/android
./gradlew assembleDebug
```
The installable APK will be generated at:
`apps/web/android/app/build/outputs/apk/debug/app-debug.apk`

### Build Production Android App Bundle (.aab for Google Play Store)
```bash
cd apps/web/android
./gradlew bundleRelease
```
The production bundle will be generated at:
`apps/web/android/app/build/outputs/bundle/release/app-release.aab`
