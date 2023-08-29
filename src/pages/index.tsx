import { NextPage } from "next";

const Home: NextPage = () => {
  var  displayMediaStreamConstraints = {
    video: true, // or pass HINTS
  };

  if (navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices
      .getDisplayMedia(displayMediaStreamConstraints)
      .then(success)
      .catch(error);
  } else {
    navigator
      .getDisplayMedia(displayMediaStreamConstraints)
      .then(success)
      .catch(error);
  }
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
