import { NextPage } from 'next';

const Home: NextPage = () => {
  const displayMediaStreamConstraints = {
    video: true, // or pass HINTS
  };

  const captureScreen = async () => {
    if (navigator.mediaDevices.getDisplayMedia) {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaStreamConstraints,
      );
      console.log('mediaStream', mediaStream);
    }
  };
  return (
    <div>
      <h1>Home</h1>
      <button onClick={captureScreen}>capture</button>
    </div>
  );
};

export default Home;
