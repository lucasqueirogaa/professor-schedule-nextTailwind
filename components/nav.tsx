import { NextPage } from 'next';
import Link from 'next/link';

const Nav: NextPage = () => {
  return (
    <nav className="text-3xl">
      <ul className="flex justify-between items-center p-8">
        <li>
          <Link href="/">
            <a className="text-blue-500 no-underline">PROFESSOR SCHEDULE</a>
          </Link>
        </li>
        <ul className="flex justify-between items-center space-x-4">
          <li>
            <Link href="/profile">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-5">
                PROFILE
              </button>
            </Link>
            <Link href="/search">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                SEARCH
              </button>
            </Link>
          </li>
        </ul>
      </ul>
    </nav>
  );
};

export default Nav;
