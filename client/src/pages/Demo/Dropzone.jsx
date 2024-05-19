import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../../styles'
import VideoPlayer from './VideoPlayer'
import { account, sasToken, videoContainer } from './credentials';
import { BlobServiceClient } from '@azure/storage-blob';
import { BsFillPlusCircleFill } from "react-icons/bs";

function Dropzone({ programType }) {
    const counterVistoersFrameSize = {
        "width": 1020,
        "height": 500
    }


    const [videoFile, setVideoFile] = useState(null)

    const removeFile = () => {
        setVideoFile(null)
    }

    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sasToken}`);  // create a blobServiceClient
    const containerClient = blobServiceClient.getContainerClient(videoContainer);  // create a containerClient



    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles?.length) {
            const newFile = acceptedFiles[0];
            const fileUrl = URL.createObjectURL(newFile);
            setVideoFile({ fileName: newFile.name, file: newFile, url: fileUrl });
            if (!account || !sasToken || !videoContainer) { 
                alert('Please make sure you have set the Azure Storage credentials');
                return;
            }
            try {
                const blobName = `${newFile.name}`;
                const blobClient = containerClient.getBlockBlobClient(blobName);  
                await blobClient.uploadData(newFile, {
                    blobHTTPHeaders: { blobContentType: newFile.type }
                }); 
            } finally {
            }

        }
    }, []);


    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        onDrop,
        accept: {
            'video/*': []
        },
        maxFiles: 1
    })

    return (
        <div className={`card w-full h-full py-3 px-2 rounded-xl hover:opacity-90 ${styles.flexCenter}`}>

            {!videoFile && <div {...getRootProps({
                className: `w-full h-full ${styles.flexCenter} cursor-pointer rounded-xl`
            })}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p className='text-sm text-gray-300'>Please Drop the files here ...</p> :
                        <p className='text-sm text-gray-300'>Click{" "}
                        <BsFillPlusCircleFill fill='#65d6de' size={12} className="opacity-85 inline-block"/>
                        {" "}to upload your video file or drag and drop it here</p>
                }
            </div>}

            {videoFile && <VideoPlayer programType={programType} videoFile={videoFile}/>}
        </div>

    )
}


export default Dropzone