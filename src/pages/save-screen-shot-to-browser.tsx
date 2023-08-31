import React, { useState, useEffect } from 'react';

const SaveScreenShotToBrowser: React.FC = () => {
  const [isCaptureScreen, setIsCaptureScreen] = useState<boolean>(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [imageId, setImageId] = useState<string>('');

  useEffect(() => {
    const request = indexedDB.open('myDatabase', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('myStore', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = (event: Event) => {
      setDb((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      console.log('IndexedDB error:', event);
    };
  }, []);

  const displayMediaStreamConstraints: MediaStreamConstraints = {
    video: { displaySurface: 'monitor' },
    audio: false,
  };

  async function captureScreen() {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaStreamConstraints,
      );
      const videoElement = document.getElementById(
        'videoElement',
      ) as HTMLVideoElement;
      videoElement.srcObject = mediaStream;
      videoElement.autoplay = true;
      setIsCaptureScreen(true);
    } catch (err) {
      console.error('Error capturing screen:', err);
    }
  }

  function saveSnapShotToIndexedDB() {
    const videoElement = document.getElementById(
      'videoElement',
    ) as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    }
    canvas.toBlob((blob) => {
      if (db) {
        const transaction = db.transaction(['myStore'], 'readwrite');
        const objectStore = transaction.objectStore('myStore');
        const request = objectStore.add({
          image: blob,
          timestamp: new Date().toISOString(),
        });

        request.onsuccess = (event: Event) => {
          alert(
            'Image saved successfully with ID:' +
              (event.target as IDBRequest).result,
          );
        };

        request.onerror = (event: Event) => {
          alert('Failed to save image:' + event);
        };
      }
    }, 'image/png');
  }

  function fetchAndRenderImage() {
    if (db && imageId) {
      const transaction = db.transaction(['myStore']);
      const objectStore = transaction.objectStore('myStore');
      const request = objectStore.get(Number(imageId));

      request.onsuccess = (event: Event) => {
        const record = (event.target as IDBRequest).result;
        if (record && record.image) {
          const img = document.getElementById(
            'fetchedImage',
          ) as HTMLImageElement;
          const blob = record.image as Blob;
          img.src = URL.createObjectURL(blob);
        } else {
          console.log('No image found for the given ID.');
        }
      };

      request.onerror = (event: Event) => {
        console.log('Failed to fetch image:', event);
      };
    }
  }

  return (
    <div>
      <ul>
        <li>
          <button onClick={captureScreen}>step1. capture screen</button>
        </li>
        <li>
          <button onClick={saveSnapShotToIndexedDB} disabled={!isCaptureScreen}>
            step2. Save screen shot to IndexedDB
          </button>
        </li>
        <li>
          <input
            type="text"
            placeholder="Enter image ID"
            onChange={(e) => setImageId(e.target.value)}
          />
          <button onClick={fetchAndRenderImage}>Fetch and Render Image</button>
        </li>
      </ul>
      <div style={{ display: 'flex' }}>
        <video
          id={'videoElement'}
          style={{
            width: '50vw',
          }}
          autoPlay
          playsInline
          muted
        />
        <img
          id="fetchedImage"
          alt="Fetched from IndexedDB"
          style={{ width: '50vw' }}
        />
      </div>
    </div>
  );
};

export default SaveScreenShotToBrowser;
