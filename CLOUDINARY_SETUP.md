# Cloudinary Integration Setup Guide

This guide will help you set up Cloudinary for image storage in your dating app, replacing the long base64 URLs with short, optimized image URLs.

## Prerequisites

- A Cloudinary account (free tier available)
- Node.js and npm installed
- Your React application running

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After signing up, you'll get your credentials from the Dashboard

## Step 2: Get Your Cloudinary Credentials

1. Log in to your Cloudinary Dashboard
2. Copy your credentials:
   - **Cloud Name** (found in the Dashboard URL)
   - **API Key** (found in the Dashboard)
   - **API Secret** (found in the Dashboard)

## Step 3: Create Upload Preset

1. In your Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Set the following:
   - **Preset name**: `dating-app-uploads`
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `dating-app` (optional)
5. Click **Save**

## Step 4: Set Up Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Cloudinary credentials:

```env
# Backend URL
VITE_BACKEND_URL=http://localhost:3000

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_API_KEY=your_api_key_here
VITE_CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important**: Replace `your_cloud_name_here`, `your_api_key_here`, and `your_api_secret_here` with your actual Cloudinary credentials.

## Step 5: Install Dependencies

The required packages have already been installed:

```bash
npm install browser-image-compression
```

**Note**: We removed the `cloudinary` package since it's designed for Node.js and causes issues in browser environments.

## Step 6: How It Works

### Image Upload Flow:
1. User selects an image in the form
2. Image is compressed on the frontend using `browser-image-compression`
3. Image is uploaded directly to Cloudinary using their REST API
4. Cloudinary returns a short URL (e.g., `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/dating-app/profiles/image.jpg`)
5. The short URL is stored in your database instead of the long base64 string
6. Images are automatically optimized by Cloudinary

### Benefits:
- **Short URLs**: No more "request header too long" errors
- **Automatic Optimization**: Cloudinary automatically compresses and optimizes images
- **CDN**: Images are served from Cloudinary's global CDN for fast loading
- **Transformations**: Easy to resize, crop, or apply filters to images
- **Storage**: No need to store large base64 strings in your database
- **Browser Compatible**: Uses direct API calls instead of Node.js SDK

## Step 7: Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to the admin panel and try to create/edit a model with images
3. Check that images are uploaded to Cloudinary and short URLs are stored
4. Verify that images display correctly in the frontend

## Step 8: Backend Changes Required

Your backend should now expect image URLs instead of base64 strings or file uploads. Update your backend to:

1. Accept image URLs in the request body
2. Store the URLs in your database
3. Return the URLs when fetching models

## File Structure

The following files have been updated:

- `src/services/cloudinary.ts` - Cloudinary service functions (browser-compatible)
- `src/services/models/index.ts` - Updated to use Cloudinary for uploads
- `src/components/admin/ModelForm.tsx` - Updated to handle Cloudinary URLs
- `src/pages/admin/Models.tsx` - Updated to display Cloudinary images
- `src/components/ProfileCard.tsx` - Updated to handle Cloudinary URLs

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my-cloud-name` |
| `VITE_CLOUDINARY_API_KEY` | Your Cloudinary API key | `123456789012345` |
| `VITE_CLOUDINARY_API_SECRET` | Your Cloudinary API secret | `abcdefghijklmnop` |

## Troubleshooting

### Common Issues:

1. **"Cloudinary config error"**: Check your environment variables are set correctly
2. **"Upload failed"**: Verify your API credentials and upload preset
3. **"Image not displaying"**: Check that the URL is accessible and not blocked by CORS
4. **"process is not defined"**: This error is now fixed by removing the Node.js SDK

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded correctly
3. Test Cloudinary credentials in the Cloudinary dashboard
4. Check network tab for failed requests
5. Verify upload preset is created and set to "Unsigned"

## Security Notes

- Never commit your `.env` file to version control
- Use unsigned uploads for public images (this is safe for public uploads)
- Consider implementing upload presets for more security
- Use signed uploads for private images if needed

## Cloudinary Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Uploads**: 25,000/month

For most dating apps, the free tier should be sufficient to start with.

## Support

If you encounter any issues:
1. Check the Cloudinary documentation: https://cloudinary.com/documentation
2. Review the browser console for error messages
3. Verify your environment variables are correctly set
4. Check that your upload preset is configured correctly 