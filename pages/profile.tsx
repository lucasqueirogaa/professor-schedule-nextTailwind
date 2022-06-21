import { NextPage } from 'next';
import useSWR from 'swr';
import { useSession, signIn, signOut } from 'next-auth/react';

import api from '../utils/api';
import Nav from '../components/nav';
import { useState } from 'react';

const ProfilePage: NextPage = () => {
  const [isTeacher, setIsTeacher] = useState(null);
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <Nav />
        <div className="text-3xl">
          <h1>Faça login para acessar essa página!</h1>
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </div>
      </>
    );
  }

  const { data, error } = useSWR(`api/user/${session?.user.email}`, api);

  return (
    <>
      <Nav />
      {!session && (
        <div className="text-3xl">
          <h1>Faça login para acessar essa página!</h1>
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </div>
      )}
      {session && data && (
        <div className="text-3xl">
          <h1 className="pb-5">
            Bem vindo a página profile, {data.data[0].name}
          </h1>
          <h1 className="pb-5">Você tem {data.data[0].coins} coin</h1>
          <h1 className="pb-5">O seu email: {data.data[0].email} coin</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
      {session && error && (
        <div className="flex flex-col items-center py-5">
          <p className="text-3xl">
            Seja muito bem vindo ao Professor Schedule!
          </p>
          <p className="text-2xl">Por favor, finalize o seu cadastro.</p>
          <form className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Full name"
              className="bg-pink-200 my-3"
            />
            <input
              type="email"
              placeholder="E-mail"
              className="bg-pink-200 my-3"
            />
            <input
              type="cellphone"
              placeholder="CellPhone"
              className="bg-pink-200 my-3"
            />
            <div className="py-4 flex flex-col">
              <h1>Você é professor?</h1>
              <div>
                <label htmlFor="yes" className="mr-3">
                  Sim
                </label>
                <input
                  type="radio"
                  id="yes"
                  name="professorOrNot"
                  value="yes"
                  required
                  onClick={() => {
                    setIsTeacher(true);
                  }}
                />
              </div>
              <div>
                <label htmlFor="no" className="mr-3">
                  Não
                </label>
                <input
                  type="radio"
                  id="no"
                  name="professorOrNot"
                  value="no"
                  onClick={() => {
                    setIsTeacher(false);
                  }}
                />
              </div>
            </div>
            {isTeacher && (
              <>
                <h1>Escreva suas matérias (Separadas por vírgula.)</h1>
                <input
                  type="text"
                  placeholder="Ex: Javascript"
                  className="bg-pink-200 my-3"
                />
                <h1>
                  Escreva em quais locais você pode dar aula - Físicos e
                  virtuais(Separados por vírgulas).
                </h1>
                <input
                  type="text"
                  placeholder="Ex: UFPE, Skype, Zoom"
                  className="bg-pink-200 my-3"
                />
                <h1>
                  Escreva os horários que você pode dar aula (Separados por
                  vírgulas).
                </h1>
                <input
                  type="text"
                  placeholder="Ex: 8, 12, 14, 00"
                  className="bg-pink-200 my-3"
                />
              </>
            )}
            {isTeacher === false && (
              <>
                <p className="text-2xl">
                  Já que você não é professor, seu perfil está completo :D
                </p>
              </>
            )}
            <button
              className="btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
              type="submit"
            >
              Criar perfil
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
