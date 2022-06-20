import { NextPage } from 'next';
import useSWR from 'swr';
import { useSession, signIn, signOut } from 'next-auth/react';

import api from '../utils/api';
import Nav from '../components/nav';

const ProfilePage: NextPage = () => {
  const { data: session } = useSession();
  const { data, error } = useSWR(`api/user/62b06467d493fa4a242e42e9`, api);

  if (error) {
    console.log(error);
  }
  if (data) {
    console.log(data);
  }

  return (
    <>
      <Nav />
      {!session && (
        <div className="text-3xl">
          <h1>Faça login para acessar essa página!</h1>
          Not signed in <br />
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </div>
      )}
      {session && data && (
        <div className="text-3xl">
          <h1 className="pb-5">
            Bem vindo a página profile, {data.data[0].name}
          </h1>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
      {error && <h1>O usuário não está logado!</h1>}
    </>
  );
};

export default ProfilePage;
