import { NextPage } from 'next';
import Link from 'next/link';
import { useRef } from 'react';

const Home: NextPage = () => {
  return (
    <div>
      <Link href={'/capture-video'}>capture video</Link>
    </div>
  );
};

export default Home;
