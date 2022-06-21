import { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import Nav from '../../components/nav';
import api from '../../utils/api';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  cellPhone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_location: string[];
  review: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

const SearchPage: NextPage = () => {
  const [textInput, setTextInput] = useState('');
  const [data, setData] = useState<Teacher[]>([]);
  const { data: session } = useSession();

  const handleSearch = useCallback(() => {
    api(`/api/search/${textInput}`).then((response) => {
      const teachers: Teacher[] = response.data;
      setData(teachers);
    });
  }, [textInput, setData]);

  return (
    <>
      <Nav />
      <h1 className="pb-5 text-4xl">Bem vindo a página search</h1>
      {!session && (
        <div className="text-2xl">
          Not signed in <br />
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </div>
      )}
      {session && (
        <>
          <div className="text-2xl">
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </div>
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            type="text"
            placeholder="Nome da matéria"
            className="bg-pink-200"
          />
          <button type="submit" className="bg-blue-200" onClick={handleSearch}>
            Pesquisar
          </button>

          {data.length > 0 &&
            data.map((teacher) => (
              <Link href={`/search/${teacher._id}`} key={teacher._id}>
                <a>
                  <h1 className="text-2xl">{teacher.name}</h1>
                </a>
              </Link>
            ))}
        </>
      )}
    </>
  );
};

export default SearchPage;
