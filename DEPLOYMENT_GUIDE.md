# 🚀 Sitemap Deployment Guide

## Problem

The production sitemap at https://pokkoo.in/sitemap.xml is only showing 7 locations instead of all 151 locations from your database.

## Solution

The updated `sitemap.ts` file now:

- ✅ Fetches ALL 151 locations from your API
- ✅ Uses direct API calls instead of service functions
- ✅ Has better error handling and timeouts
- ✅ Processes all locations for the sitemap

## Deployment Steps

### 1. Build the Project

```bash
npm run build
```

### 2. Deploy to Production

Depending on your hosting platform:

#### For Vercel:

```bash
vercel --prod
```

#### For Netlify:

```bash
netlify deploy --prod
```

#### For Custom Server:

```bash
npm run build
# Upload the .next folder to your server
```

### 3. Verify Deployment

After deployment, test the sitemap:

```bash
npm run test:production-sitemap
```

## Expected Results

### Before Deployment:

- ❌ Only 7 locations in sitemap
- ❌ Missing 144+ locations from database

### After Deployment:

- ✅ All 151 locations in sitemap
- ✅ Location pages like:
  - https://pokkoo.in/delhi-call-girls
  - https://pokkoo.in/mumbai-hot-girls
  - https://pokkoo.in/bangalore-call-girls
  - ... and 148 more locations

## Troubleshooting

### If sitemap still shows few locations:

1. **Check Production Logs**

   - Look for sitemap generation errors
   - Check if API calls are timing out

2. **Verify API Access**

   ```bash
   curl -s "https://api.pokkoo.in/states" | jq 'length'
   # Should return 151
   ```

3. **Check Environment Variables**

   - Ensure production has correct API URLs
   - Verify no CORS issues

4. **Force Cache Clear**
   - Clear any CDN caches
   - Wait 5-10 minutes for changes to propagate

## Testing Commands

```bash
# Test production sitemap
npm run test:production-sitemap

# Test local sitemap (if dev server running)
curl -s "http://localhost:3000/sitemap.xml" | grep -c "<loc>"

# Test API directly
curl -s "https://api.pokkoo.in/states" | jq 'length'
```

## Success Indicators

✅ **Sitemap contains 150+ URLs**
✅ **All your database locations are included**
✅ **Model pages are generated for first 10 locations**
✅ **No timeout or API errors in logs**

## Need Help?

If the sitemap still doesn't work after deployment:

1. Check production server logs
2. Verify the updated code is deployed
3. Test API endpoints from production server
4. Contact hosting provider for server-side issues
