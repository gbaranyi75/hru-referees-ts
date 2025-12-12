# Deployment Checklist

## Pre-deployment Steps

### 1. Delete old ESLint config file

**Recommended (Cross-platform - Works on Windows, macOS, Linux):**
```bash
npm run cleanup:eslint
```

**Alternative Methods:**

**Windows (Command Prompt/PowerShell):**
```bash
del eslint.config.mjs
```
Or run the batch script:
```bash
cleanup-eslint.bat
```

**Unix/Linux/macOS (Terminal):**
```bash
rm eslint.config.mjs
```
Or run the shell script:
```bash
chmod +x cleanup-eslint.sh
./cleanup-eslint.sh
```

**Manual (Any Platform):**
Simply delete the `eslint.config.mjs` file from your project root using your file explorer or IDE.

### 2. Install dependencies
```bash
npm install
```

### 3. Run TypeScript type check
```bash
npx tsc --noEmit
```

### 4. Run ESLint
```bash
npm run lint
```

### 5. Build the project
```bash
npm run build
```

## Fixed Issues

### TypeScript Errors Fixed:
1. ✅ `DeleteButton` - Updated `onClick` prop type to accept optional MouseEvent parameter
2. ✅ `NavbarMobileMenu` - Fixed `motion.path` component typing with proper ComponentProps
3. ✅ `ProfileMetaCard` - Fixed CloudinaryUploadWidget result handling
4. ✅ `NavbarUserIcon` - Already accepts optional image and username props

### Documentation Updates:
1. ✅ All Hungarian comments in `lib/actions/` translated to English
2. ✅ `typeGuards.ts` - All comments translated to English
3. ✅ `errorHandling.ts` - All comments translated to English
4. ✅ `updateProfileData.ts` - Comment "Validálás" changed to "Validation"

### Dynamic Routes:
All pages that use `headers()` or other dynamic features already have:
```typescript
export const dynamic = 'force-dynamic';
```
This is present in:
- `app/layout.tsx`
- `app/page.tsx`
- `app/profil/page.tsx`
- `app/tablazat/page.tsx`

### ESLint Configuration:
- ✅ Removed `eslint.config.mjs` (flat config format causing conflicts)
- ✅ Using `.eslintrc.json` (compatible with ESLint 8.57.0)

## Vercel Deployment

### Prerequisites:
- Vercel account connected to GitHub repository
- Environment variables configured in Vercel dashboard

### Deploy Command:
```bash
vercel
```

### Production Deploy:
```bash
vercel --prod
```

### Build Output:
Next.js will create optimized production build in `.next` directory

## Environment Variables to Configure in Vercel:
- `MONGODB_URI`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Any other custom environment variables

## Post-deployment:
1. Test all routes
2. Verify authentication works
3. Check image uploads
4. Test database connections
5. Monitor error logs in Vercel dashboard

## Notes:
- The project uses Next.js 15.5.3 with App Router
- Dynamic rendering is enabled for pages using server-side features
- Clerk is configured with Hungarian localization
- Cloudinary is used for image uploads

## Cross-Platform Cleanup Scripts:
The project includes multiple cleanup options:
- `cleanup-eslint.js` - Node.js script (works on all platforms)
- `cleanup-eslint.bat` - Windows batch file
- `cleanup-eslint.sh` - Unix/Linux/macOS shell script
- `npm run cleanup:eslint` - NPM script (recommended, works everywhere)
