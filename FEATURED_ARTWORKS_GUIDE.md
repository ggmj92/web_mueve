# Featured Artworks System

## Overview
This system allows you to mark artworks as "Destacado" (Featured) in two different ways through Sanity Studio:

### 1. **Destacado (Página del Artista)** - Hero Image
- **Field**: `featured`
- **Purpose**: Sets which artwork appears as the large hero image at the top of the artist's individual page
- **Location**: `/artistas/[slug]/page.js`
- **Indicator in Sanity**: ⭐ Hero
- **Limit**: Only ONE artwork per artist can be marked as featured hero
- **Fallback**: If no artwork is marked, the first artwork in the list will be used

### 2. **Destacado (Vista Previa Hover)** - Preview Image
- **Field**: `featuredPreview`
- **Purpose**: Sets which artwork appears in the bottom-right preview when hovering over the artist's name in the artists list page
- **Location**: `/artistas/page.js` (hover preview)
- **Indicator in Sanity**: 👁️ Preview
- **Limit**: Only ONE artwork per artist can be marked as preview
- **Fallback**: If no artwork is marked, the first artwork in the list will be used

## How to Use in Sanity Studio

1. Go to the **Obras** (Artworks) section in Sanity Studio
2. Select the artwork you want to feature
3. Check one or both of these options:
   - ✅ **Destacado (Página del Artista)** - for hero image
   - ✅ **Destacado (Vista Previa Hover)** - for hover preview
4. Save the document

### Important Notes:
- You can mark the **same artwork** for both purposes, or choose **different artworks** for each
- The system enforces that only one artwork per artist can be marked for each purpose
- If you try to mark a second artwork while another is already marked, Sanity will show an error message asking you to unmark the current one first
- Both fields are optional - if nothing is marked, the system defaults to the first artwork

## Technical Implementation

### Schema Changes (`artwork.js`)
- Added `featuredPreview` boolean field with validation
- Updated preview to show both badges (⭐ Hero and 👁️ Preview)
- Both fields have async validation to prevent multiple featured artworks per artist

### Query Updates
- **Artists list page**: Now fetches `featuredPreview` field
- **Artist detail page**: Already had `featured` field support

### Logic Updates
- **Artists list page**: `getPreviewArtwork()` now prioritizes artworks marked with `featuredPreview`
- **Artist detail page**: Already had logic to prioritize `featured` artworks for hero image
