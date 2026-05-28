# Mueve Galería — Editor Guide

This guide covers everything gallery staff need to know to manage content in Sanity Studio at `/studio`.

---

## Table of Contents

1. [Hotspot & Crop — controlling how images are cropped](#1-hotspot--crop)
2. [Featured Artworks — hero image and hover preview](#2-featured-artworks)
3. [Guest Artists — Mueve Estar](#3-guest-artists--mueve-estar)
4. [Announcement Banner](#4-announcement-banner)

---

## 1. Hotspot & Crop

Every image field in Sanity has two tools: **Hotspot** and **Crop**. These control which part of the image is visible when it's displayed in different containers on the website.

### Crop
Defines the **region of the image** that should ever be shown. Use this to cut out unwanted borders, frames, or background areas. The website will only show content within the crop rectangle — everything outside is hidden.

### Hotspot
Marks the **focal point** within the crop. When the container shape doesn't match the image shape (e.g. a square container showing a portrait photo), the website keeps the hotspot visible.

### How to set them
1. Click the image field in Sanity Studio
2. Click **Edit** (pencil icon)
3. **Crop tool**: drag the handles to define the region to keep
4. **Hotspot tool**: click and drag the circle to mark the subject (face, key object)
5. Save the document

### Where hotspot/crop takes effect

| Container | Shape | Recommendation |
|---|---|---|
| Artist/exposición hero (top of page) | Full width, original height | Set hotspot to face or key detail |
| Artwork card (desktop) | 3:4 portrait (600×800) | Set crop to portrait; hotspot to face |
| Hover preview (artists/exposiciones list) | Square (800×800) | Set hotspot to face/subject |
| Homepage carousel | Full viewport | Hotspot to main subject |
| Mueve Estar carousel | Full viewport | Hotspot to main subject |

**Mobile:** Artwork cards on mobile always show the full uncropped original image. No cropping is applied on mobile.

---

## 2. Featured Artworks

Each artist's artwork list has two **Destacado** (Featured) flags per artwork — one for the hero image, one for the hover preview.

### Destacado (Página del Artista) — Hero image ⭐
- **What it does**: Sets the large image at the top of the artist's individual page (`/artistas/[slug]`)
- **Studio indicator**: ⭐ Hero
- **Limit**: Only one artwork per artist
- **Fallback**: If nothing is marked, the first artwork in the list is used

### Destacado (Vista Previa Hover) — Hover preview 👁️
- **What it does**: Sets the image that appears when hovering over the artist's name on the artists list page
- **Studio indicator**: 👁️ Preview
- **Limit**: Only one artwork per artist
- **Fallback**: If nothing is marked, the first artwork is used

You can mark the **same artwork** for both purposes, or choose **different artworks** for each.

### How to set them
1. Open an artist in Sanity Studio → **Obras** section
2. Click the artwork you want to feature
3. Set the **Hotspot & Crop** on the image (see section 1 above — this controls the crop for both the hero and the hover preview)
4. Check one or both toggles:
   - ✅ **Destacado (Página del Artista)** — for hero
   - ✅ **Destacado (Vista Previa Hover)** — for hover preview
5. Save

> If you try to mark a second artwork while another is already marked, Sanity will show a validation error. Unmark the current one first.

### Same system for Mueve Estar guest artists
The same `featured` and `featuredPreview` flags exist on guest artist artworks. They work identically — the hero image appears at the top of `/mueve-estar/[slug]`, and the preview appears when hovering on the Mueve Estar list.

---

## 3. Guest Artists — Mueve Estar

Guest artists appear on the `/mueve-estar` page as a clickable list. Each guest artist has their own page at `/mueve-estar/[slug]` with hero image, bio, and artwork carousel.

### Adding a new guest artist
1. In Sanity Studio, click **Artistas Invitados** (🎭) in the sidebar
2. Click **+ New**
3. Fill in:
   - **Nombre** (required) — the artist's name
   - **Slug** (required) — click "Generate" to auto-create from the name
   - **Biografía** — artist bio text (supports bold and italic)
   - **Portafolio** — upload a PDF or enter an external link (Spanish and/or English)
   - **Obras** — add artworks (see below)

### Adding artworks to a guest artist
Each obra (artwork) needs at minimum a **Título**, **Slug**, and **Imagen Principal**.
- Click **+ Add item** in the Obras section
- Fill in title, slug (auto-generated), year, technique, dimensions, description
- Upload the main image — **always set Hotspot & Crop** (see section 1)
- Optionally add **Imágenes de Detalle** for detail shots
- Mark **Destacado** flags as needed (see section 2)

### Connecting a guest artist to the Mueve Estar page
After creating the guest artist document:
1. Go to **mueve (estar  )** in the sidebar
2. Open the document
3. In the **Artistas Invitados** field, click **+ Add item**
4. Search for and select the guest artist document
5. Save

> **Until the guest artist is linked here, they won't appear on the /mueve-estar page.**

### Graceful degradation
If a guest artist document exists but has no artworks yet, their name appears as plain text (not a link) on the /mueve-estar page. Once at least one artwork is added, the name becomes clickable.

---

## 4. Announcement Banner

The announcement banner scrolls messages at the bottom of every page (except the homepage and Studio).

### Accessing banner settings
1. Go to `/studio`
2. Click **Banner de Anuncios** (📢) in the sidebar
3. Create a new announcement or edit an existing one

### Banner fields

**Announcement Message** (required) — The text that scrolls. Maximum 200 characters.

**Link** (optional) — Choose one of three types:
- **No Link** — text-only announcement, not clickable
- **Internal Page** — links to a page on the website (homepage, artistas, nosotros, or a specific artist)
- **External URL** — any full URL (`https://...`). Opens in a new tab.

**Active** (toggle) — Turn the banner on or off without deleting it.

### Multiple announcements
You can have several announcements active at once. They all scroll together in sequence. Each clickable one can link to a different page.

### User behaviour
- Visitors can close the banner with the ✕ button. Once closed, it won't reappear until they clear their browser storage.
- Changes in Sanity appear on the site after a page refresh.

### Example announcements

**Exhibition with artist link:**
```
Message: "Nueva exposición: Miguel Aguirre — Ver obras"
Link: Internal → Link to Artist → Miguel Aguirre
Active: Yes
```

**Closure notice:**
```
Message: "Cerrado por vacaciones del 20 al 30 de diciembre"
Link: No Link
Active: Yes
```

**External event:**
```
Message: "Participa en nuestra subasta — Más información"
Link: External URL → https://example.com/event
Active: Yes
```
