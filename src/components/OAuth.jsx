import { useLocation, useNavigate } from 'react-router-dom'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'
import facebookIcon from '../assets/svg/facebookIcon.svg'
import githubIcon from '../assets/svg/githubIcon.svg'

function OAuth () {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // cek user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // jika user tidak ada buat user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        })
      }

      navigate('/')
    } catch (error) {
      toast.error('Could not authorize with Google')
    }
  }

  const onGithubClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GithubAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // cek user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // jika user tidak ada buat user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        })
      }

      navigate('/')
    } catch (error) {
      toast.error('Could not authorize with Github')
    }
  }

  const onFacebookClick = async () => {
    try {
      const auth = getAuth()
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // cek user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // jika user tidak ada buat user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        })
      }

      navigate('/')
    } catch (error) {
      toast.error('Could not authorize with Facebook')
    }
  }

  return (
    <div className='socialLogin'>
      <p>Or Sign {location.pathname === '/sign-up' ? 'up' : 'in'} With</p>
      <div className='socialLoginButton'>
        <button className='socialIconDiv' onClick={onGoogleClick}>
          <img className='socialIconImg' src={googleIcon} alt='google' />
        </button>
        <button className='socialIconDiv' onClick={onFacebookClick}>
          <img className='socialIconImg' src={facebookIcon} alt='facebook' />
        </button>
        <button className='socialIconDiv' onClick={onGithubClick}>
          <img className='socialIconImg' src={githubIcon} alt='github' />
        </button>
      </div>
    </div>
  )
}

export default OAuth
