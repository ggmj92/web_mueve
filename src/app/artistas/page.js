'use client'

import { client } from '@/sanity/lib/client'
import { useState, useEffect } from 'react'
import styles from './artists.module.css'

async function getArtists() {
    try {
        const query = `*[_type == "artist"] | order(name asc){
        _id, name, "slug": slug.current
      }`
        console.log('Fetching artists with query:', query)
        const result = await client.fetch(query)
        console.log('Fetched artists:', result)
        return result
    } catch (error) {
        console.error('Error fetching artists:', error)
        return []
    }
}

export default function ArtistsPage() {
    const [artists, setArtists] = useState([])

    useEffect(() => {
        console.log('Component mounted, fetching artists...')
        getArtists()
            .then(artists => {
                console.log('Artists loaded:', artists)
                setArtists(artists)
            })
            .catch(error => {
                console.error('Error loading artists:', error)
                setArtists([])
            })
    }, [])

    return (
        <div className={`${styles.artists} alignSecondCol`}>
            <div className={styles.listCol}>
                {artists.length > 0 ? (
                    <ul className={styles.list}>
                        {artists.map((a) => (
                            <li key={a.slug ?? a._id}>
                                <span className={styles.artistName}>
                                    {a.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <p>No artists found. Loading...</p>
                        <p>Check console for debugging info.</p>
                    </div>
                )}
            </div>
        </div>
    )
}




