function SignOut({ signOutUser }: { signOutUser: () => void }) {
  return (
    <button className='sign-out chat-btns' onClick={signOutUser}>
      SIGN-OUT
    </button>
  );
}

export default SignOut;
