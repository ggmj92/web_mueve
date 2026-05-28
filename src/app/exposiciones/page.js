'use client'

import { client } from '@/sanity/lib/client'
import { urlFor, cropToRect } from '@/sanity/lib/image'
import { useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import styles from './exposiciones.module.css'

async function getExposiciones() {
  try {
    const query = `*[_type == "exposicion" && defined(slug.current)] | order(year desc){
        _id,
        title,
        "slug": slug.current,
        year,
        isCurrent,
        previewImage{
          asset->{
            "_ref": _id,
            _id,
            url,
            metadata{ dimensions{ width, height, aspectRatio } }
          },
          hotspot,
          crop
        }
      }`
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching exposiciones:', error)
    return []
  }
}

export default function ExposicionesPage() {
  const [exposiciones, setExposiciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredExpo, setHoveredExpo] = useState(null)

  useEffect(() => {
    getExposiciones()
      .then((expos) => {
        setExposiciones(expos)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error al cargar exposiciones:', error)
        setExposiciones([])
        setLoading(false)
      })
  }, [])

  const actuales = exposiciones.filter((e) => e.isCurrent)
  const pasadas = exposiciones.filter((e) => !e.isCurrent)

  return (
    <>
      <NewsletterModal />
      <div className={`${styles.exposiciones} alignSecondCol`}>
        <div className={styles.listCol}>
          {loading ? (
            <div>
              <p>Cargando exposiciones...</p>
            </div>
          ) : (
            <>
              {actuales.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Actuales</h2>
                  <ul className={styles.list}>
                    {actuales.map((e) => (
                      <li key={e.slug ?? e._id} className={styles.listItem}>
                        <a
                          href={`/exposiciones/${e.slug}`}
                          onMouseEnter={() => setHoveredExpo(e)}
                          onMouseLeave={() => setHoveredExpo(null)}
                          className={styles.itemLink}
                        >
                          <span className={`${styles.itemName} notranslate`}>
                            {e.title}
                          </span>
                          <span className={styles.itemYear}>{e.year}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pasadas.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Pasadas</h2>
                  <ul className={styles.list}>
                    {pasadas.map((e) => (
                      <li key={e.slug ?? e._id} className={styles.listItem}>
                        <a
                          href={`/exposiciones/${e.slug}`}
                          onMouseEnter={() => setHoveredExpo(e)}
                          onMouseLeave={() => setHoveredExpo(null)}
                          className={styles.itemLink}
                        >
                          <span className={`${styles.itemName} notranslate`}>
                            {e.title}
                          </span>
                          <span className={styles.itemYear}>{e.year}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exposiciones.length === 0 && (
                <div>
                  <p>No se encontraron exposiciones.</p>
                </div>
              )}
            </>
          )}
        </div>

        {hoveredExpo &&
          hoveredExpo.previewImage &&
          (() => {
            const img = hoveredExpo.previewImage
            const hs = img?.hotspot
            const rect = cropToRect(img)
            const previewUrl = (
              rect
                ? urlFor(img).rect(rect.x, rect.y, rect.width, rect.height)
                : urlFor(img)
            )
              .width(800)
              .height(800)
              .fit('crop')
              .focalPoint(hs?.x ?? 0.5, hs?.y ?? 0.5)
              .quality(90)
              .auto('format')
              .url()
            return (
              <div className={styles.preview}>
                <img
                  src={previewUrl}
                  alt={hoveredExpo.title || 'Exposición preview'}
                  className={styles.previewImage}
                />
              </div>
            )
          })()}
      </div>
    </>
  )
}
