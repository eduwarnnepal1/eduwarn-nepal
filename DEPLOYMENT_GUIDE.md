# EduWarn Nepal - Complete Deployment & Setup Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 2. Build & Test Locally
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Test production build
npm start
```

### 3. Performance Verification
- Run Lighthouse audit: Open DevTools > Lighthouse
- Target scores:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 100+

### 4. Mobile Testing
Test on actual devices or use:
- Chrome DevTools mobile emulation
- Safari mobile simulator
- Real iPhone/Android devices

---

## Deployment Steps

### Step 1: Choose Hosting Platform

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Option B: Other Platforms
The build output is in `.next` directory:
```bash
# Standard Node.js server
npm run build
npm start

# Or use Docker
docker build -t eduwarn .
docker run -p 3000:3000 eduwarn
```

### Step 2: Configure Production Domain

1. Update `metadata.metadataBase` in `/app/layout.tsx`
2. Update OpenGraph URLs
3. Configure DNS records
4. Enable HTTPS (required for PWA)

### Step 3: Set Up Monitoring

#### Sentry Integration (Optional)
```bash
npm install @sentry/nextjs
```

#### Vercel Analytics
Already included via `@vercel/analytics`

#### Custom Monitoring
Monitor these metrics:
- Page load time
- Time to interactive
- Core Web Vitals
- Error rates
- User engagement

### Step 4: Database & Auth Setup

1. Verify Supabase project is active
2. Check Row Level Security (RLS) policies
3. Test Google OAuth configuration
4. Verify email verification emails work
5. Test password reset flow

### Step 5: Content Delivery

#### CDN Configuration
For images and static assets:
```
cloudflare.com or AWS CloudFront
```

#### Image Optimization
Already configured in `next.config.mjs`:
- AVIF format support
- WebP fallback
- Responsive sizes
- Automatic compression

### Step 6: Security Audit

#### Required Headers (Configured)
- ✓ X-Content-Type-Options: nosniff
- ✓ X-Frame-Options: DENY
- ✓ X-XSS-Protection: 1; mode=block
- ✓ Referrer-Policy: strict-origin-when-cross-origin

#### Additional Security (Recommended)
- Enable HTTPS Strict Transport Security (HSTS)
- Configure Content Security Policy (CSP)
- Enable CORS properly
- Set secure cookie flags

#### HTTPS Setup
```
# Vercel: Automatic
# Others: Use Let's Encrypt (certbot)
certbot certonly --standalone -d yourdomain.com
```

### Step 7: PWA Verification

```bash
# Test PWA capabilities
1. Open Chrome DevTools
2. Go to Application > Manifest
3. Verify manifest.json loads correctly
4. Check "Add to Home Screen" option available
5. Verify Service Worker registered
6. Test offline functionality
```

### Step 8: Email Configuration

Verify Supabase email settings:
1. Go to Supabase Dashboard
2. Settings > Email
3. Configure email templates
4. Test email delivery

---

## Post-Deployment Tasks

### 1. Monitoring Setup
```javascript
// Monitor Core Web Vitals
// Already implemented in PerformanceMonitor component
```

### 2. Error Tracking
Set up error monitoring:
- Sentry or similar service
- Custom error logging
- Alert thresholds

### 3. Analytics
Enable Google Analytics:
```
Add GA tracking code to layout
Monitor user behavior
Track conversion events
```

### 4. Testing
- Run full end-to-end tests
- Test on actual devices
- Verify all auth flows
- Check all data submissions
- Validate all API calls

### 5. Backup Strategy
- Daily database backups
- Regular content backups
- Version control setup
- Disaster recovery plan

---

## Performance Optimization Checklist

- [ ] Images optimized (use WebP/AVIF)
- [ ] CSS is minified
- [ ] JavaScript is minified
- [ ] Unused code removed
- [ ] HTTP/2 enabled
- [ ] Gzip compression enabled
- [ ] Brotli compression enabled
- [ ] CDN configured
- [ ] Cache headers set properly
- [ ] Service Worker working
- [ ] Lazy loading implemented
- [ ] Code splitting verified
- [ ] Bundle size analyzed
- [ ] Lighthouse score 90+
- [ ] Mobile score 90+

---

## Maintenance Plan

### Daily
- Monitor error logs
- Check uptime status
- Review user feedback

### Weekly
- Analyze performance metrics
- Check security logs
- Review database size

### Monthly
- Full security audit
- Performance review
- Content updates
- Backup verification
- Dependency updates

### Quarterly
- Major version updates
- Comprehensive audit
- User feedback analysis
- Strategy review

---

## Troubleshooting

### PWA Not Installing
1. Check HTTPS is enabled
2. Verify manifest.json is accessible
3. Check service worker registration
4. Look at console for errors

### Performance Issues
1. Check images are optimized
2. Verify cache headers
3. Check database queries
4. Analyze bundle size
5. Monitor API calls

### Auth Issues
1. Verify Supabase keys
2. Check OAuth configuration
3. Test email delivery
4. Verify redirects

### Mobile Issues
1. Test viewport settings
2. Check touch targets (44px+)
3. Verify responsive images
4. Test on actual devices

---

## Rollback Plan

If issues occur:
```bash
# Revert to previous version
git revert <commit-hash>
npm run build
vercel --prod

# Or use version control
git checkout <branch-name>
```

---

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- PWA Docs: https://web.dev/progressive-web-apps/

---

## Success Metrics

After deployment, track:
- Page load time < 2.5s
- Time to interactive < 3.5s
- Zero 404 errors
- Auth success rate > 99%
- Uptime > 99.9%
- Error rate < 0.1%
- Core Web Vitals passing

---

## Post-Launch Review

Schedule a review 1 week after launch to:
- Analyze performance data
- Review error logs
- Gather user feedback
- Plan improvements
- Document lessons learned

---

**Deployment Status**: Ready for Production
**Last Updated**: 2026-02-06
**Version**: 1.0.0
