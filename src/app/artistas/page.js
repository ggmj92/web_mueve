'use client'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useState, useEffect, useMemo } from 'react'
import styles from './artists.module.css'

async function getArtists() {
    const query = `*[_type == "artist" && defined(slug.current)] | order(name asc){
    _id, name, "slug": slug.current,
    artworks[]->{
      _id,
      title,
      image{
        asset->{
          url,
          metadata{ dimensions{ width, height, aspectRatio } }
        }
      }
    }
  }`
    return client.fetch(query)
}

export default function ArtistsPage() {
    const [artists, setArtists] = useState([])
    const [hoveredArtist, setHoveredArtist] = useState(null)

    useEffect(() => {
        getArtists().then(setArtists)
    }, [])

    const getPreviewArtwork = (artist) => {
        if (!artist?.artworks?.length) return null
        return artist.artworks[0]
    }

    // Decide which artwork to show:
    //  - If hovering: use that artist's first artwork
    //  - Else: use the first artist's first artwork
    //  - Else: show a local placeholder
    const previewArtwork = useMemo(() => {
        if (hoveredArtist) return getPreviewArtwork(hoveredArtist)
        if (artists[0]) return getPreviewArtwork(artists[0])
        return null
    }, [hoveredArtist, artists])

    // Build a URL for the image (Sanity or local placeholder)
    const previewUrl = previewArtwork
        ? urlFor(previewArtwork.image).width(2000).quality(90).auto('format').url()
        : '/logos/image.jpg' // make sure this exists in /public/logos/

    const previewAlt =
        previewArtwork?.title || hoveredArtist?.name || artists[0]?.name || 'Artwork preview'

    return (

        <div className={`${styles.artists} alignSecondCol`}>
            <div className={styles.listCol}>
                <ul className={styles.list}>
                    {artists.map((a) => (
                        <li key={a.slug ?? a._id}>
                            <a
                                href={`/artistas/${a.slug}`}
                                onMouseEnter={() => setHoveredArtist(a)}
                                onMouseLeave={() => setHoveredArtist(null)}
                            >
                                {a.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {hoveredArtist && getPreviewArtwork(hoveredArtist) && (
                <div className={styles.preview}>
                    <img
                        src={urlFor(getPreviewArtwork(hoveredArtist).image)
                            .width(2000)
                            .quality(100)
                            .auto('format')
                            .url()}
                        alt={getPreviewArtwork(hoveredArtist).title || 'Artwork preview'}
                        className={styles.previewImage}
                    />
                </div>)}
        </div>
    )
}




