import { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import Nav from '../components/nav';

const ProfilePage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Nav />
      <h1 className="pb-5">Bem vindo a página profile</h1>
      {!session && (
        <div className="text-3xl">
          Not signed in <br />
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </div>
      )}
      {session && (
        <div className="text-3xl">
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
