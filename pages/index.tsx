import { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';

const IndexPage: NextPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="text-3xl">
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="text-3xl">
      Not signed in <br />
      <button onClick={() => signIn('auth0')}>Sign in</button>
    </div>
  );
};

export default IndexPage;
