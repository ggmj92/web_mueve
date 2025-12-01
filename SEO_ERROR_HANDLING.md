# SEO & Error Handling Documentation

## Comprehensive SEO Implementation

### 1. Metadata & Meta Tags

#### Root Layout (`src/app/layout.js`)
- **Title Template**: Dynamic titles for all pages
- **Description**: Comprehensive, keyword-rich description
- **Keywords**: Extensive list targeting local and international searches
- **OpenGraph**: Full social media integration (Facebook, LinkedIn)
- **Twitter Cards**: Optimized for Twitter sharing
- **Geo-location**: Lima, Peru coordinates for local SEO
- **Language Alternates**: Spanish (Peru, Spain) and English support
- **Canonical URLs**: Prevent duplicate content issues

#### Page-Specific Metadata
Each major section has its own layout with targeted metadata:
- `/artistas/layout.js` - Artist listing page
- `/exposiciones/layout.js` - Exhibitions page
- `/publicaciones/layout.js` - Publications page
- `/ferias/layout.js` - Art fairs page
- `/mueve-estar/layout.js` - Mueve Estar space
- `/nosotros/page.js` - About page

### 2. Structured Data (JSON-LD)

Located in `src/components/StructuredData.js`:

#### Organization Schema
- **Type**: ArtGallery
- **Complete address**: Jr. General Borgoño 770, Miraflores, Lima
- **Geo-coordinates**: -12.120000, -77.030000
- **Contact information**: Email, phone, languages
- **Opening hours**: Monday-Saturday, 11:00-17:00
- **Social media**: Instagram integration
- **Payment methods**: Cash, Credit Card, Bank Transfer
- **Service area**: Lima, Peru

#### Website Schema
- Search functionality integration
- Publisher information
- Logo and branding

### 3. Technical SEO

#### Sitemap (`src/app/sitemap.js`)
- Dynamic generation of all pages
- Artist pages with individual slugs
- Exhibition pages with individual slugs
- Static pages (home, about, etc.)
- Last modified dates
- Priority and change frequency

#### Robots.txt (`src/app/robots.js`)
- Allow all crawlers
- Disallow /studio/ (Sanity CMS)
- Disallow /api/ (API routes)
- Sitemap reference

#### Security Headers (`next.config.mjs`)
- **HSTS**: Strict Transport Security
- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing
- **X-XSS-Protection**: Cross-site scripting protection
- **Referrer-Policy**: Control referrer information
- **Permissions-Policy**: Restrict browser features
- **DNS Prefetch**: Faster DNS resolution

#### Caching Strategy
- **Images**: 1 year immutable cache
- **Fonts**: 1 year immutable cache
- **Sitemap**: 24 hours with stale-while-revalidate
- **Robots.txt**: 24 hours with stale-while-revalidate

### 4. Performance Optimization

#### Image Optimization
- WebP and AVIF formats
- Responsive image sizes
- Lazy loading on carousel images
- 30-day minimum cache TTL
- Sanity CDN integration

#### Font Optimization
- Local font loading
- Variable font support
- Preload critical fonts

### 5. PWA Support

#### Manifest (`public/manifest.json`)
- Installable web app
- Standalone display mode
- Custom icons (16x16, 32x32, 180x180, 512x512)
- Theme colors
- Language and direction settings

## Comprehensive Error Handling

### 1. Global Error Boundary

#### Error Page (`src/app/error.js`)
- Client-side error catching
- User-friendly error messages
- Retry functionality
- Navigation to home
- Development mode: Stack trace display
- Production mode: Clean error UI
- Error logging for monitoring

#### 404 Not Found (`src/app/not-found.js`)
- Custom 404 page
- Navigation to key sections
- SEO-friendly metadata
- Consistent branding

### 2. Data Fetching Error Handling

#### Mueve Estar Page (`src/app/mueve-estar/page.js`)
- Try-catch blocks around all async operations
- Data validation and sanitization
- Fallback to safe default values
- Detailed error logging with stack traces
- Filter invalid images and artists
- Type checking for all data fields

#### Carousel Component (`src/app/mueve-estar/MueveEstarCarousel.js`)
- Image load error handling
- Graceful degradation for failed images
- Scroll error catching
- Ref validation before DOM operations
- State management for error tracking
- Lazy loading with error callbacks

### 3. Error Logging Strategy

All errors are logged with:
- Error message
- Stack trace
- Error name/type
- Context (function name, operation)
- Timestamp (automatic via console)

### 4. User Experience

#### Error States
- Loading states for async operations
- Empty states when no data
- Error states with recovery options
- Consistent styling across all error UIs

#### Graceful Degradation
- Missing images: Skip rendering
- Missing data: Show empty state
- API failures: Show cached data or fallback
- Invalid data: Filter and continue

## SEO Best Practices Implemented

### Content
✅ Unique, descriptive titles for each page
✅ Meta descriptions under 160 characters
✅ Keyword-rich content without stuffing
✅ Proper heading hierarchy (H1, H2, H3)
✅ Alt text for all images
✅ Semantic HTML structure

### Technical
✅ Mobile-responsive design
✅ Fast page load times
✅ HTTPS (enforced via HSTS)
✅ Clean URL structure
✅ Canonical URLs
✅ XML sitemap
✅ Robots.txt
✅ Structured data (JSON-LD)

### Local SEO
✅ Location-specific keywords
✅ Geo-coordinates in metadata
✅ Local business schema
✅ Address and contact information
✅ Opening hours

### Social Media
✅ OpenGraph tags
✅ Twitter Cards
✅ Social media links
✅ Shareable content

## Monitoring & Maintenance

### Recommended Tools
1. **Google Search Console**: Monitor indexing and search performance
2. **Google Analytics**: Track user behavior
3. **Lighthouse**: Performance and SEO audits
4. **Schema.org Validator**: Verify structured data
5. **Mobile-Friendly Test**: Ensure mobile compatibility

### Regular Checks
- [ ] Verify sitemap is accessible
- [ ] Check robots.txt is working
- [ ] Validate structured data
- [ ] Monitor Core Web Vitals
- [ ] Review error logs
- [ ] Test 404 pages
- [ ] Verify canonical URLs
- [ ] Check mobile responsiveness

### Future Enhancements
- [ ] Integrate error tracking service (e.g., Sentry)
- [ ] Add analytics tracking
- [ ] Implement A/B testing
- [ ] Add breadcrumb navigation
- [ ] Create FAQ schema
- [ ] Add review/rating schema for exhibitions
- [ ] Implement internationalization (i18n)
- [ ] Add service worker for offline support

## Contact & Support

For questions or issues related to SEO or error handling:
- Review this documentation
- Check Next.js documentation
- Consult Google Search Central
- Review Sanity.io best practices
