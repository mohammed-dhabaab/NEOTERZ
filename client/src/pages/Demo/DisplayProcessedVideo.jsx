import React from 'react'

const DisplayProcessedVideo = ({ processedVideo }) => {
    return (
        <video
            src={processedVideo}
            controls
            className='pb-2 rounded-xl'
            muted
        ></video>
    )
}

export default DisplayProcessedVideo