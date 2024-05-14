import React, { useRef, useState } from 'react';
import styles from '../../styles';
import TheftDetector from './TheftDetector'
import { MdPhotoSizeSelectLarge } from "react-icons/md";
import VisitorsCounter from './VisitorsCounter';

const VideoPlayer = ({ programType, videoFile }) => {
  const videoRef = useRef(null);
  const [userSelectedFrame, setUserSelectedFrame] = useState(false)
  const [selectedFrame, setSelectedFrame] = useState()

  const handleSelectFrame = () => {
    setUserSelectedFrame(true)
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    // const targetWidth = 1050; // Specify the desired width
    // const targetHeight = 500; // Specify the desired height
    // canvas.width = targetWidth;
    // canvas.height = targetHeight;
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setSelectedFrame(url)
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'frame.png';
      // a.click();
      // URL.revokeObjectURL(url);
    });

  };

  return (
    <>
      {!userSelectedFrame &&
        <div className='flex flex-col'>
          <video
            ref={videoRef}
            src={videoFile.url}
            controls
            className='pb-2 rounded-xl'
            muted
          ></video>

          <button onClick={handleSelectFrame}
            className={`${styles.controlButton} flex justify-center items-center gap-2`}>
            <MdPhotoSizeSelectLarge />
            Select Frame
          </button>
        </div>
      }

      {programType == "Visitors Counter" && userSelectedFrame && <VisitorsCounter selectedFrame={selectedFrame} videoFile={ videoFile }/>}
      {programType == "Theft Detector" && userSelectedFrame && <TheftDetector selectedFrame={selectedFrame} videoFile={ videoFile }/>}



    </>
  );
};

export default VideoPlayer;