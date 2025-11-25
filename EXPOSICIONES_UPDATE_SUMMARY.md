# Exposiciones Page Update Summary

## Overview
The exposiciones pages have been converted to match the artist page structure with featured images, carousel navigation, and individual image pages.

## Changes Made

### 1. Sanity Schema Updates (`src/sanity/schemaTypes/exposicion.js`)
- **Added `slug` field** to each artwork/image in the exposiciones
  - Auto-generates unique slugs for routing to individual image pages
- **Added `featured` boolean field** to mark the main exhibition page image
  - Marked images show with a ⭐ in the Sanity Studio preview
  - This is the "Destacado (Página de Exposición) - Imagen Principal"

### 2. Main Exposicion Page (`src/app/exposiciones/[slug]/page.js`)
**New Layout Structure:**
- **Hero Section**: Displays the featured image (or first image if none marked as featured)
- **Info Section**: 
  - Artist names (left aligned)
  - "Portafolio" link (right aligned)
  - Exhibition description below
- **Cards Section**: 5-card carousel of all exhibition images
  - Desktop: Infinite scrolling carousel if more than 5 images
  - Mobile: Vertical stack with full image info

### 3. New Components

#### ExposicionCarousel (`src/app/exposiciones/[slug]/ExposicionCarousel.js`)
- Similar to ArtworkCarousel
- Displays 5 cards across on desktop
- Infinite scroll when more than 5 images
- Links to individual image pages: `/exposiciones/{slug}/imagenes/{imageSlug}`
- Mobile: Shows all artwork info below each image (stacked if multiple artworks per image)

#### ExposicionImageViewer (`src/components/ExposicionImageViewer.js`)
- Viewer for individual exhibition images
- **Key Feature**: Supports multiple artwork info blocks per image
  - Each artwork info is stacked vertically with spacing
  - Displays: artist name, title, year, technique, dimensions
- Desktop: Info fixed on left side, arrows for navigation
- Mobile: Info below image, swipe navigation disabled (returns to main page)

### 4. New Route
**Individual Image Page**: `/exposiciones/[slug]/imagenes/[imageId]/page.js`
- Shows full-screen image with navigation arrows
- Displays all artwork information for that image
- Desktop only (mobile users see stacked layout on main page)

### 5. Styling (`src/app/exposiciones/[slug]/exposicion.module.css`)
- Completely rewritten to match artist page styles
- Responsive breakpoints for desktop/tablet/mobile
- Carousel navigation arrows
- Mobile: vertical stacking with full info display

## How to Use in Sanity Studio

### For Each Exposición:

1. **Upload Images**: Add images to "Imágenes de la Exposición"

2. **Generate Slugs**: Click the "Generate" button next to the slug field for each image
   - This creates a unique identifier for routing

3. **Mark Featured Image**: 
   - Check "Destacado (Página de Exposición) - Imagen Principal" on ONE image
   - This will be the hero image at the top of the page
   - If none marked, the first image is used

4. **Add Artwork Info**: 
   - For each image, you can add multiple "Información de Obra(s)"
   - Each block can have: Artist Name, Title, Year, Technique, Dimensions
   - These will stack vertically on the individual image page

5. **Preview Image**: 
   - The existing "Imagen de Vista Previa" field remains unchanged
   - This is still used for the hover preview on the exposiciones list page

## Mobile Behavior

- **Main Page**: 
  - No hero image
  - Artists names → Portafolio link → Description → Images with full info
  - Each image shows all its artwork info blocks stacked below it
  
- **Individual Image Pages**: 
  - Not accessible on mobile (links disabled)
  - All information is already visible on the main page

## Preserves Existing Functionality

✅ Exposiciones list page (`/exposiciones`) remains unchanged
✅ "Actuales" / "Pasadas" distinction still works
✅ Hover preview on list page still works
✅ Portfolio links (Spanish/English) still work
✅ Artist references and text input still work

## Next Steps

1. **Deploy to Sanity Studio**: The schema changes need to be deployed
2. **Add Slugs**: Go through existing exposiciones and generate slugs for each image
3. **Mark Featured Images**: Select which image should be the hero for each exposición
4. **Test**: Verify the new layout works as expected on desktop and mobile
