# Testing the Announcement Banner

## Quick Test Steps

### 1. Clear Old Banner State (Important!)
Since we renamed from "construction-banner" to "announcement-banner", you need to clear the old localStorage:

**In your browser console:**
```javascript
localStorage.removeItem('construction-banner-dismissed');
localStorage.removeItem('announcement-banner-dismissed');
```

Or simply open the site in an incognito/private window.

### 2. Create a Test Announcement in Sanity Studio

1. Go to `http://localhost:3000/studio`
2. Click on "Banner de Anuncios" (📢) in the sidebar
3. Click "Create" to make a new announcement
4. Fill in the fields:

**Test 1: Simple Announcement (No Link)**
```
Message: "Web en construcción — gracias por tu paciencia."
Link Type: No Link
Active: ✓ (checked)
```
Click **Publish**

**Test 2: Internal Link to Artists**
```
Message: "Conoce a nuestros artistas — Haz clic aquí"
Link Type: Internal Page
Internal Page: Artists
Active: ✓ (checked)
```
Click **Publish**

**Test 3: Link to Specific Artist**
```
Message: "Nueva exposición: Miguel Aguirre — Ver obras"
Link Type: Internal Page
Link to Artist: [Select Miguel Aguirre]
Active: ✓ (checked)
```
Click **Publish**

**Test 4: External Link**
```
Message: "Síguenos en Instagram @mueve.galeria"
Link Type: External URL
External URL: https://www.instagram.com/mueve.galeria/
Active: ✓ (checked)
```
Click **Publish**

### 3. Test on the Website

1. **Refresh the page** (the banner fetches data on page load)
2. **Verify the banner appears** at the bottom of the page
3. **Test the scrolling animation** - text should scroll from right to left
4. **Test clicking** (if you set a link):
   - Hover over the banner - should see subtle background change
   - Click anywhere on the banner (except the X button)
   - Should navigate to the specified page/URL
5. **Test the close button**:
   - Click the X button
   - Banner should disappear
   - Refresh the page - banner should stay hidden
6. **Test on mobile**:
   - Resize browser to mobile width (< 600px)
   - Banner should be shorter (2.5rem instead of 3rem)
   - Text should be smaller
   - Close button should be smaller

### 4. Test Toggling Active State

1. Go back to Sanity Studio
2. Edit your announcement
3. Uncheck "Active"
4. Click **Publish**
5. Refresh the website
6. Banner should not appear

### 5. Test Multiple Announcements

1. Create 2-3 announcements in Sanity
2. Mark ALL of them as "Active"
3. Refresh the website
4. **All active announcements should appear** in the scrolling banner
5. They should scroll together in sequence
6. Each announcement can have its own link (or no link)
7. Clicking on a linked announcement should navigate to its specific page

## Expected Behavior

✅ **Banner appears** at bottom of all pages except homepage and /studio
✅ **Text scrolls** continuously from right to left
✅ **Multiple announcements** scroll together in sequence
✅ **Individual links** - each announcement can have its own link
✅ **Clickable announcements** show hover effect (opacity change)
✅ **Close button** dismisses banner permanently (until localStorage is cleared)
✅ **Responsive** - smaller on mobile devices
✅ **Dynamic** - fetches latest announcements from Sanity on page load

## Troubleshooting

### Banner doesn't appear
- Check that announcement is marked as "Active" in Sanity
- Clear localStorage: `localStorage.removeItem('announcement-banner-dismissed')`
- Check browser console for errors
- Make sure you refreshed the page after publishing in Sanity

### Link doesn't work
- Verify "Link Type" is set correctly (not "No Link")
- For internal links, verify the page/artist exists
- For external links, verify URL includes `https://`

### Styling issues
- Check that `AnnouncementBanner.module.css` was created correctly
- Verify no CSS conflicts with other components
- Check browser console for CSS errors

### "createContext is not a function" error
- This should be fixed with the dynamic import
- If it persists, check that `"use client"` is at the top of `AnnouncementBanner.js`
- Verify the Sanity client is being imported dynamically

## Notes

- **Multiple announcements** can be active at the same time - they all appear in the scrolling banner
- Announcements are ordered by creation date (newest first)
- Changes in Sanity require a page refresh to appear
- Banner state is stored in localStorage as `announcement-banner-dismissed`
- External links open in a new tab automatically
- Each announcement can have its own link, or no link at all
