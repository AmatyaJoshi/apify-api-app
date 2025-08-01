# Deployment Guide

This Next.js application can be deployed to various platforms. Here are the recommended options:

## Vercel (Recommended) ⭐

Vercel is the creators of Next.js and provides the best deployment experience.

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings (auto-detected for Next.js)
   - Click "Deploy"

3. **Configuration**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Environment Variables**
   - No environment variables required
   - Users input their API keys directly in the app

**✅ Benefits:**
- Zero configuration required
- Automatic deployments on git push
- Global CDN and edge functions
- Perfect Next.js integration

## Netlify

Great alternative with excellent GitHub integration.

### Steps:

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18+

3. **Deploy**
   - Click "Deploy site"
   - Automatic deployments on git push

**✅ Benefits:**
- Simple setup process
- Great for static sites
- Built-in forms and functions
- Free tier available

## Railway

Perfect for developers who want a simple deployment process.

### Steps:

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configuration**
   - Railway auto-detects Next.js projects
   - No additional configuration needed
   - Automatic deployments enabled

**✅ Benefits:**
- Zero configuration
- Automatic HTTPS
- Easy database integration (if needed later)
- Developer-friendly interface

## Manual Deployment

For traditional hosting providers:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Copy files**
   - Upload the `.next` folder
   - Upload `package.json` and `package-lock.json`
   - Upload `next.config.ts`

3. **Install dependencies on server**
   ```bash
   npm install --production
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## Environment Variables

The application doesn't require any environment variables for basic functionality:

- **API Keys**: Users input their Apify API tokens directly in the application
- **Configuration**: All settings are handled client-side or through Next.js defaults

## Performance Optimization

For production deployments:

1. **Enable compression** (most platforms do this automatically)
2. **Use CDN** for static assets (Vercel and Netlify provide this)
3. **Monitor performance** with built-in analytics

## Security Considerations

- **API Keys**: Never stored server-side, handled securely through the app
- **HTTPS**: Required for production (all recommended platforms provide this)
- **Headers**: Security headers configured in `next.config.ts`

## Troubleshooting

### Build Errors
- Ensure Node.js version is 18+
- Check for missing dependencies: `npm install`
- Verify TypeScript compilation: `npm run type-check`

### Runtime Errors
- Check browser console for client-side errors
- Verify API endpoints are accessible
- Test with different Apify API keys

## Monitoring

Once deployed, monitor your application:

- **Vercel**: Built-in analytics and monitoring
- **Netlify**: Analytics and form submissions
- **Railway**: Application metrics and logs

Choose the platform that best fits your needs. For most users, **Vercel** provides the smoothest experience with Next.js applications.

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Run `npm run build` locally first

2. **Runtime Errors**
   - Check browser console for client-side errors
   - Verify Apify API accessibility
   - Check CORS configuration if needed

3. **Performance Issues**
   - Enable platform-specific optimizations
   - Check bundle size with `npm run build`
   - Monitor Core Web Vitals

### Support:
- Check platform-specific documentation
- Review deployment logs
- Test locally with `npm run build && npm start`

---

**Ready to deploy? Choose your preferred platform and follow the steps above!** 🚀
