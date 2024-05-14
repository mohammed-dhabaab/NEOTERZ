// imports

import { useEffect, useState } from 'react';
import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';
import axios from 'axios';

// states for uploading
const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);

// variables Storage account credentials
const account = "neoterz"
const sasToken = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-05-03T15:08:20Z&st=2024-05-03T07:08:20Z&spr=https,http&sig=a7tnwL5wKIoJzLKiVm3c65SHhIDrdTIcIXr%2FN41t6%2FM%3D"  // get the SAS token from the .env file
const containerName = "videos"
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sasToken}`);  // create a blobServiceClient
const containerClient = blobServiceClient.getContainerClient(containerName);  // create a containerClient

//save an the video
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {  // check if the file is selected
        alert('Please select an image to upload');
        return;
    }
    if (!account || !sasToken || !containerName) {  // check if the credentials are set
        alert('Please make sure you have set the Azure Storage credentials');
        return;
    }
    try {
        setLoading(true);
        console.log("wait for uploading");

        const blobName = `${file.name}`; // Specify a default blob name if needed
        const blobClient = containerClient.getBlockBlobClient(blobName);  // get the blob client
        await blobClient.uploadData(file, {
            blobHTTPHeaders: { blobContentType: file.type }
        }); // upload the image
        // await fetchImages();   // fetch all images again after the upload is completed
    } catch (error) {
        console.error(error);  // Handle error
    } finally {
        console.error("Done uploading");
        setLoading(false); // Turn off loading
    }
};

// HTML code
return (
    <div className='upload_form_inputs'>
        <label htmlFor="fileInput">click here to choose the video</label>
        <input type="file" style={{ display: "none" }} id="fileInput" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" onClick={handleSubmit} >Upload</button>
    </div>
)
