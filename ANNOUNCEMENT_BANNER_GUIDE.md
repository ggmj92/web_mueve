# Announcement Banner Guide

## Overview
The announcement banner is a permanent feature that displays scrolling messages at the bottom of the website. It can be managed through Sanity Studio and supports clickable links.

## Managing the Banner in Sanity Studio

### Accessing the Banner Settings
1. Go to `/studio` in your browser
2. Look for "Announcement Banner" in the document types list
3. Create a new announcement or edit an existing one

### Banner Fields

#### 1. **Announcement Message** (Required)
- The text that will scroll across the banner
- Maximum 200 characters
- Example: "Nueva exposición: Miguel Aguirre - Abre el 15 de Noviembre"

#### 2. **Link** (Optional)
Choose one of three link types:

##### No Link
- Select "No Link" if the announcement should not be clickable
- Users can still close the banner with the X button

##### Internal Page
- Select "Internal Page" to link to a page on your website
- Choose from:
  - **Home** - Links to the homepage (/)
  - **Artists** - Links to the artists listing (/artistas)
  - **About** - Links to the about page (/about)
- Or select **Link to Artist** to link to a specific artist's page
  - This will show a dropdown of all artists
  - The link will be: `/artistas/[artist-slug]`

##### External URL
- Select "External URL" to link to any website
- Enter the full URL including `https://`
- Examples:
  - `https://www.instagram.com/mueve.galeria/`
  - `https://example.com/event`
- External links will open in a new tab

#### 3. **Active** (Toggle)
- Turn the banner on or off
- When inactive, the banner will not appear on the website
- Default: Active (on)

## User Experience

### For Visitors
- The banner appears at the bottom of all pages (except homepage and studio)
- Text scrolls continuously from right to left
- **Multiple announcements**: All active announcements scroll together in sequence
- If an announcement has a link:
  - That specific message is clickable
  - Hovering shows a subtle opacity change
  - Clicking redirects to the specified page/URL
- Users can close the banner by clicking the X button
- Once closed, the banner won't appear again until they clear their browser data

### Technical Details
- The banner state is saved in `localStorage` as `announcement-banner-dismissed`
- **All active announcements** are shown in the scrolling banner
- Announcements are ordered by creation date (newest first)
- The banner fetches data from Sanity on page load
- Changes in Sanity Studio appear immediately after page refresh

## Examples

### Example 1: Exhibition Announcement with Artist Link
```
Message: "Nueva exposición: Miguel Aguirre - Visítanos"
Link Type: Internal Page
Link to Artist: Miguel Aguirre
Active: Yes
```

### Example 2: External Event Link
```
Message: "Participa en nuestra subasta benéfica — Más información"
Link Type: External URL
External URL: https://example.com/auction
Active: Yes
```

### Example 3: Simple Announcement (No Link)
```
Message: "Cerrado por vacaciones del 20 al 30 de diciembre"
Link Type: No Link
Active: Yes
```

### Example 4: Multiple Announcements
You can have multiple announcements active at the same time. They will all scroll together:

**Announcement 1:**
```
Message: "Nueva exposición: Miguel Aguirre — Ver obras"
Link Type: Internal Page
Link to Artist: Miguel Aguirre
Active: Yes
```

**Announcement 2:**
```
Message: "Work in progress — thanks for your patience."
Link Type: No Link
Active: Yes
```

Both will appear in the scrolling banner, separated by space. Each clickable announcement can link to a different page.

## Migration Notes
- The old "Under Construction" banner has been replaced with this new system
- Old localStorage key `construction-banner-dismissed` is now `announcement-banner-dismissed`
- Users who previously dismissed the construction banner will need to dismiss the new announcement banner separately
