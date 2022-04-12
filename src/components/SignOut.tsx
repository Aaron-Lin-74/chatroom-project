function SignOut({ signOutUser }: { signOutUser: () => void }) {
  return (
    <button type='button' className='sign-out chat-btns' onClick={signOutUser}>
      SIGN-OUT
    </button>
  );
}

export default SignOut;
