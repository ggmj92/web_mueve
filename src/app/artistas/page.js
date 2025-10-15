'use client'

import { client } from '@/sanity/lib/client'
import { useState, useEffect } from 'react'
import styles from './artists.module.css'

async function getArtists() {
    try {
        const query = `*[_type == "artist"] | order(name asc){
        _id, name, "slug": slug.current
      }`
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching artists:', error)
        return []
    }
}

export default function ArtistsPage() {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getArtists()
            .then(artists => {
                setArtists(artists)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error loading artists:', error)
                setArtists([])
                setLoading(false)
            })
    }, [])

    return (
        <div className={`${styles.artists} alignSecondCol`}>
            <div className={styles.listCol}>
                {loading ? (
                    <div>
                        <p>Loading artists...</p>
                    </div>
                ) : artists.length > 0 ? (
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
                        <p>No artists found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}




