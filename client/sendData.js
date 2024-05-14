// const callNeotVideoProcessAPI = async () => {
//     try {
//         const response = await fetch(`http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/get-and-process-video`);
//         console.log(response)
//         if (!response.status == 200) {
//             throw new Error('Could not get a positive response')
//         }
//         const responseObj = await response.json();
//         console.log(responseObj)
//         setVisitors(responseObj);
//         setLoading(false);
//     }
// }


const callNeotVideoProcessAPI = async (user_preferences) => {
    try {
        const response = await fetch('http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/get-and-process-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user_preferences)
        });
        console.log(response);
        if (!response.ok) {
            // throw new Error(HTTP error! status: ${response.status});
        }
        const responseObj = await response.json();
        setVisitors(responseObj);
        setLoading(false);
    } catch (error) {
        console.log('Error with fetching data', error);
        setLoading(false);
    }
}