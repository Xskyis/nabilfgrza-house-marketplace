import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers () {
  const [listings, setLitstings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  // eslint-disable-next-line no-unused-vars
  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get referrence
        const listingsRef = collection(db, 'listings')

        // buat query
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(5)
        )

        // Execute query nya
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length-1]
        setLastFetchedListing(lastVisible)

        const listings = []

        querySnap.forEach(doc => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setLitstings(listings)
        setLoading(false)
      } catch (error) {
        toast.error('Could not fetch a listings!')
      }
    }

    fetchListings()
  }, [])

  // Pagination / load more
  const onFetchMoreListings = async () => {
    try {
      // get referrence
      const listingsRef = collection(db, 'listings')

      // buat query
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(5)
      )

      // Execute query nya
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length-1]
      setLastFetchedListing(lastVisible)

      const listings = []

      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setLitstings((prevState) => [...prevState, ...listings]) // menambahkan listing yang baru ke listing yang ada
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch a listings!')
    }
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>
          Offers
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map(listing => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>Load More..</p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  )
}

export default Offers
