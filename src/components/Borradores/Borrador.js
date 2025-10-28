'use client'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useState, useEffect } from 'react'
import styles from './artists.module.css'

async function getArtists() {
    try {
        const query = `*[_type == "artist" && defined(slug.current)] | order(name asc){
        _id, name, "slug": slug.current,
        artworks[]{
          title,
          image{
            asset->{
              url,
              metadata{ dimensions{ width, height, aspectRatio } }
            },
            hotspot,
            crop
          },
          detailImages[]{
            image{
              asset->{
                url,
                metadata{ dimensions{ width, height, aspectRatio } }
              },
              hotspot,
              crop
            }
          }
        }
      }`
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching artists:', error)
        return []
    }
}

export default function ArtistsPage() {
    const [artists, setArtists] = useState([])
    const [hoveredArtist, setHoveredArtist] = useState(null)

    useEffect(() => {
        getArtists()
            .then(setArtists)
            .catch(error => {
                console.error('Error loading artists:', error)
                setArtists([])
            })
    }, [])

    const getPreviewArtwork = (artist) => {
        if (!artist?.artworks?.length) return null
        return artist.artworks[0]
    }



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