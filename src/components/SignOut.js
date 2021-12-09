import { isUserSignedIn, signOutUser } from '../firebase'

function SignOut() {
  return (
    isUserSignedIn() && (
      <button className='sign-out' onClick={signOutUser}>
        SIGN-OUT
      </button>
    )
  )
}

export default SignOut
