import { isUserSignedIn, signOutUser } from '../firebase'

function SignOut() {
  return (
    isUserSignedIn() && (
      <button className='sign-out chat-btns' onClick={signOutUser}>
        SIGN-OUT
      </button>
    )
  )
}

export default SignOut
