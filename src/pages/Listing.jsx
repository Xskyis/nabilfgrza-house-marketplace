import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
// eslint-disable-next-line no-unused-vars
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'

import 'swiper/css'
import 'swiper/css/pagination'

import { Pagination } from 'swiper/modules'

function Listing () {
  const [listing, setListing] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, params.listingId])

  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        initialSlide={3} 
      >
        {listing?.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing?.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover'
              }}
              className='swiperSlideDiv'
            >
              <br /> <br /> <br /> <br />
              <br /> <br />
              <br /> <br />
              <br /> <br />
              <br /> <br />
              <br /> <br />
              <br /> <br />
              <br />
              <br />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)
          }, 2000)
        }}
      >
        <img src={shareIcon} alt='share icon' />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing?.name} - Rp
          {listing?.offer
            ? listing?.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing?.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className='listingLocation'>{listing?.location}</p>
        <p className='listingType'>
          For {listing?.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing?.offer && (
          <p className='discountPrice'>
            Rp.{listing?.regularPrice - listing?.discountedPrice} discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing?.bedrooms > 1
              ? `${listing?.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing?.bathrooms > 1
              ? `${listing?.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing?.parking && 'Parking Spot'}</li>
          <li>{listing?.furnished && 'Furnished'}</li>
        </ul>

        <p className='listingLocationTitle'>Location</p>

        <div className='leafletContainer'>
          {listing && listing.geolocation.lat && listing.geolocation.lng ? (
            <MapContainer
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p>Location information is not available for this listing.</p>
          )}
        </div>

        {auth?.currentUser?.uid !== listing?.userRef && (
          <Link
            to={`/contact/${listing?.userRef}?
            ListingNama=${listing?.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing
