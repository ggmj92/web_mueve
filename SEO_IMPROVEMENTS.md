# SEO Improvements for Mueve Galería

## Problem
When searching "alice wagner mueve" or similar artist + gallery name combinations in Google, the artist pages weren't appearing in search results.

## Root Cause
1. **Missing Page Metadata**: Artist and exposicion pages had no SEO metadata (titles, descriptions, Open Graph tags)
2. **Incomplete Sitemap**: The sitemap only included static pages, not individual artist/exposicion pages
3. **No Structured Data**: Pages weren't properly telling Google what content they contained

## Changes Made

### 1. Artist Pages SEO (`/artistas/[slug]/page.js`)
Added `generateMetadata()` function that includes:
- **Page Title**: Artist name (e.g., "Alice Wagner | Mueve")
- **Description**: First 160 characters of artist bio
- **Keywords**: Artist name, "artista", "arte contemporáneo", "Mueve", "Mueve Galería"
- **Open Graph Tags**: For social media sharing with featured artwork image
- **Twitter Card**: For Twitter/X sharing
- **Canonical URL**: Proper URL structure

### 2. Exposición Pages SEO (`/exposiciones/[slug]/page.js`)
Added `generateMetadata()` function that includes:
- **Page Title**: Exhibition title + artist names (e.g., "Norte y Cuerpo Celeste - Alice Wagner | Mueve")
- **Description**: First 160 characters of exhibition description
- **Keywords**: Exhibition title, artist names, "exposición", "arte contemporáneo", "Mueve"
- **Open Graph Tags**: With featured exhibition image
- **Twitter Card**: For social sharing

### 3. Dynamic Sitemap (`/sitemap.js`)
Updated to include:
- All artist pages (`/artistas/alice-wagner`, etc.)
- All exposición pages (`/exposiciones/norte-y-cuerpo-celeste`, etc.)
- All mueve-estar project pages
- Proper priority and change frequency for each page type
- Last modified dates from Sanity CMS

## Next Steps for Google Indexing

### Immediate Actions (Do These Now):

1. **Submit Sitemap to Google Search Console**
   - Go to: https://search.google.com/search-console
   - Add property: `muevegaleria.com`
   - Go to "Sitemaps" in left menu
   - Submit: `https://muevegaleria.com/sitemap.xml`

2. **Request Indexing for Key Pages**
   - In Google Search Console, use "URL Inspection" tool
   - Enter URLs like:
     - `https://muevegaleria.com/artistas/alice-wagner`
     - `https://muevegaleria.com/exposiciones/norte-y-cuerpo-celeste`
   - Click "Request Indexing" for each

3. **Verify robots.txt**
   - Check: `https://muevegaleria.com/robots.txt`
   - Should allow Googlebot to crawl all pages

### Medium-term (1-2 weeks):

4. **Add Structured Data (JSON-LD)**
   - Consider adding Schema.org markup for:
     - Person (for artists)
     - Event (for exhibitions)
     - Organization (for Mueve Galería)

5. **Internal Linking**
   - Link to artist pages from homepage
   - Link between related exhibitions and artists
   - Add breadcrumbs navigation

6. **Content Optimization**
   - Ensure artist bios are at least 150-200 words
   - Add alt text to all images (already using artist/artwork names)
   - Use H1, H2 tags properly (already done)

### Long-term (Ongoing):

7. **Monitor Performance**
   - Check Google Search Console weekly
   - Track impressions and clicks for artist pages
   - Monitor "alice wagner mueve" and similar queries

8. **Build Backlinks**
   - Get listed in art directories
   - Press releases for exhibitions
   - Artist features on art blogs/magazines

9. **Social Signals**
   - Share artist pages on Instagram (@mueve.galeria)
   - Tag artists in posts
   - Encourage artists to link to their Mueve pages

## Expected Timeline

- **24-48 hours**: Google discovers new sitemap
- **1-2 weeks**: Pages start appearing in search results
- **1-2 months**: Full indexing and ranking improvement
- **3-6 months**: Optimal search visibility for "artist + mueve" queries

## Technical Details

All metadata is now:
- ✅ Dynamic (pulls from Sanity CMS)
- ✅ Unique per page (no duplicate content)
- ✅ Mobile-friendly (responsive meta tags)
- ✅ Social media optimized (OG tags, Twitter cards)
- ✅ Search engine optimized (proper keywords, descriptions)

## Testing

To verify the changes are working:

1. **View Page Source**: Right-click on artist page → "View Page Source"
   - Look for `<meta property="og:title"` tags
   - Should see artist name and "Mueve Galería"

2. **Test Social Sharing**:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

3. **Test Rich Results**:
   - Google: https://search.google.com/test/rich-results
   - Enter artist page URL

## Questions?

If searches still don't show results after 2 weeks, check:
1. Is the site verified in Google Search Console?
2. Are there any crawl errors reported?
3. Is the sitemap successfully processed?
4. Are pages being indexed? (Use `site:muevegaleria.com alice wagner` in Google)
