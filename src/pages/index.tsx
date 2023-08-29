import { NextPage } from 'next';
import { useRef } from 'react';

const Home: NextPage = () => {
  const displayMediaStreamConstraints: DisplayMediaStreamOptions = {
    video: { displaySurface: 'monitor' },
    audio: false,
  };

  const handleSuccess = (stream: MediaStream) => {
    const videoElement = document.getElementById(
      'videoElement',
    ) as HTMLVideoElement;

    videoElement.srcObject = stream;
    stream.getVideoTracks()[0].addEventListener('ended', () => {});
  };

  const handleError = (error: Error) => {
    alert(error);
  };

  const RequestPermissionOfCaptureScreen = () => {
    if (navigator.mediaDevices.getDisplayMedia) {
      try {
        navigator.mediaDevices
          .getDisplayMedia(displayMediaStreamConstraints)
          .then(handleSuccess, handleError);
      } catch (e) {
        alert(e);
      }
    }
  };
  return (
    <div>
      <h1>Home</h1>
      <button onClick={RequestPermissionOfCaptureScreen}>capture</button>
      <video
        id={'videoElement'}
        style={{ height: '50vh', width: '100%' }}
        autoPlay // 渡された video の src 元の再生を自動で開始する
        playsInline // inline 再生するか. これが無い場合、mobile device とかだと、全画面再生される
        muted // 再生される動画を消音する
      />
    </div>
  );
};

export default Home;
