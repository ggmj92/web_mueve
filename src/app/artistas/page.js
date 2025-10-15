'use client'

import { client } from '@/sanity/lib/client'
import { useState, useEffect } from 'react'
import styles from './artists.module.css'

async function getArtists() {
    try {
        const query = `*[_type == "artista" && defined(slug.current)] | order(name asc){
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

    useEffect(() => {
        getArtists()
            .then(setArtists)
            .catch(error => {
                console.error('Error loading artists:', error)
                setArtists([])
            })
    }, [])

    return (
        <div className={`${styles.artists} alignSecondCol`}>
            <div className={styles.listCol}>
                <ul className={styles.list}>
                    {artists.map((a) => (
                        <li key={a.slug ?? a._id}>
                            <span className={styles.artistName}>
                                {a.name}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}




