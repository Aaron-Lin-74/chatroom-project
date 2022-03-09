import { isUserSignedIn, signOutUser } from '../firebase';

function SignOut() {
  if (isUserSignedIn()) {
    return (
      <button className='sign-out chat-btns' onClick={signOutUser}>
        SIGN-OUT
      </button>
    );
  } else {
    return null;
  }
}

export default SignOut;
