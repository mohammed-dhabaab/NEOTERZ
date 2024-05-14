import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { plus } from "../../assets"
import styles from '../../styles'
import VideoPlayer from './VideoPlayer'
import { account, sasToken, videoContainer } from './credentials';
import { BlobServiceClient } from '@azure/storage-blob';

function Dropzone({ programType }) {
    const counterVistoersFrameSize = {
        "width": 1020,
        "height": 500
    }


    const [videoFile, setVideoFile] = useState(null)

    const removeFile = () => {
        setVideoFile(null)
    }

    // const onDrop = useCallback(acceptedFiles => {

    //     if (acceptedFiles?.length) {
    //         const newFile = acceptedFiles[0]
    //         const fileUrl = URL.createObjectURL(newFile)
    //         setFile({ file: newFile, url: fileUrl })
    //     }

    // }, [])
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sasToken}`);  // create a blobServiceClient
    const containerClient = blobServiceClient.getContainerClient(videoContainer);  // create a containerClient



    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles?.length) {
            const newFile = acceptedFiles[0];
            console.log(newFile)
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
                // console.error("Done uploading");
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
                        <p className='text-sm text-gray-300'>Click <img src={plus} alt=""
                            className="w-[12px] h-[12px] opacity-85 inline-block" /> to upload your video file or drag and drop it here</p>
                }
            </div>}

            {/* {file && <div className="relative">
                <video controls width={counterVistoersFrameSize.width} height={counterVistoersFrameSize.height}>
                    <source src={file.url} type="video/mp4" />
                </video>
                <button
                    type='button'
                    className='w-5 h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-black hover:border-none transition-all ease-in-out duration-1000'
                    onClick={() => removeFile()}
                >

                    <img src={closeVideo} alt="Close"
                        className='w-3 h-3' />
                </button>
            </div>} */}
            {videoFile && <VideoPlayer programType={programType} videoFile={videoFile}/>}
        </div>

    )
}


export default Dropzone