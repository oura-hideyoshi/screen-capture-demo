import { NextPage } from 'next';
import Link from 'next/link';
import { useRef } from 'react';

const Home: NextPage = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href={'/capture-video'}>capture video</Link>
        </li>
        <li>
          <Link href={'/save-screen-shot'}>save screen shot</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
