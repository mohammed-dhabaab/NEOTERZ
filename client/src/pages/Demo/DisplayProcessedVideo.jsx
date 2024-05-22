import React from 'react'

const DisplayProcessedVideo = ({ processedVideo }) => {
    return (
        <video
            src={processedVideo}
            controls
            className='pb-2 rounded-xl'
            muted
        >
          <source src={URL.createObjectURL(processedVideoBlob)} type="video/mp4" />


        </video>
    )
}

export default DisplayProcessedVideo