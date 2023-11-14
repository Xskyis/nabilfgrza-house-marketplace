import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import 'swiper/css'
import 'swiper/css/pagination'
import Spinner from './Spinner'

import { Pagination } from 'swiper/modules'

function Slider () {
  const [loading, SetLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListing = async () => {
      const listingRef = collection(db, 'listings')
      const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(listings)
      SetLoading(false)
    }

    fetchListing()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings?.length === 0) {
    return <></>
  }

  return (
    listings && (
      <>
        <p className='exploreHeading'>Recommended</p>

        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[Pagination]}
        >
            {listings.map(listing => (
                <SwiperSlide key={listing.id} onClick={() => navigate(`/category/${listing.data.type}/${listing.id}`)}>
                    <div
                        style={{
                            background: `url(${listing.data.imgUrls[1]}) center no-repeat`,
                            backgroundSize: 'cover'
                        }}
                        className='swiperSlideDiv-Explore'
                    >   
                        <br /> <br /> <br /> <br />
                        <br /> <br />
                        <br /> <br />
                        <br /> <br />
                        <br /> <br /> <br />
                        
                        <p className="swiperSlideText"> {listing.data.name}</p>
                        <p className='swiperSlidePrice'>
                        Rp.{listing.data.discountedPrice ?? listing.data.regularPrice}
                            {' '}
                            {listing.data.type === 'rent' && ' / Bulan'}
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
      </>
    )
  )
}

export default Slider
