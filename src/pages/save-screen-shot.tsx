import { useState } from 'react';

interface Props {}

const SaveScreenShot: React.FC = () => {
  const [isCaptureScreen, setIsCaptureScreen] = useState(false);

  const displayMediaStreamConstraints: DisplayMediaStreamOptions = {
    video: { displaySurface: 'monitor' },
    audio: false,
  };

  async function captureScreen() {
    try {
      // 画面をキャプチャ
      const mediaStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaStreamConstraints,
      );

      // <video> タグを取得または作成
      const videoElement =
        (document.getElementById('videoElement') as HTMLVideoElement) ||
        document.createElement('video');
      videoElement.id = 'videoElement';

      // MediaStream を <video> タグにセット
      videoElement.srcObject = mediaStream;

      // オートプレイ設定
      videoElement.autoplay = true;

      // <video> タグを DOM に追加
      document.body.appendChild(videoElement);

      setIsCaptureScreen(true);
    } catch (err) {
      // エラーハンドリング
      console.error('Error capturing screen:', err);
    }
  }

  function downloadSnapShot() {
    // 1. get video element
    const videoElement = document.getElementById(
      'videoElement',
    ) as HTMLVideoElement;

    // <canvas> エレメントを作成
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // canvas に video の内容を描画
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    }

    // canvas の内容を画像として保存
    const imageURL = canvas.toDataURL('image/png');

    // 画像をダウンロード
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = imageURL;
    a.download = `snapshot_${new Date().toISOString()}.png`;
    document.body.appendChild(a);
    a.click();

    // a タグを DOM から削除
    document.body.removeChild(a);
  }

  return (
    <div>
      <ul>
        <li>
          <button onClick={captureScreen}>step1. capture screen</button>
        </li>
        <li>
          <button onClick={downloadSnapShot} disabled={!isCaptureScreen}>
            step2. DL screen shot
          </button>
        </li>
      </ul>
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

export default SaveScreenShot;
