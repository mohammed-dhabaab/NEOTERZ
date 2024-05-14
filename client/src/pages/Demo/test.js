// const response = await fetch('http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/get-and-process-video', {
//     try {
//         const response = await fetch('http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/get-and-process-video', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 "video_path": "video-test1.mp4",
//                 "program": "Visitors Counter",
//                 "areas": [
//                     {
//                         "points": [
//                             [254.7878972320399, 307.84105007400626],
//                             [533.5343626321752, 442.53240635641066],
//                             [509.272951447104, 492.7439593492626],
//                             [230.5264860469687, 358.0526030668582]
//                         ],
//                         "color": "#000000"
//                     },
//                     {
//                         "points": [
//                             [212.62408989910193, 361.24706633672594],
//                             [505.2608680135106, 492.92822821242453],
//                             [480.77588012503657, 547.3437882018544],
//                             [188.13910201062785, 415.6626263261559]
//                         ],
//                         "color": "#000000"
//                     }
//                 ]
//             }),
//             timeout: 10000 // Adjust the timeout value as needed (in milliseconds)
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const responseObj = await response.json();
//         console.log(responseObj);
//         // Handle the response data as needed
//     } catch (error) {
//         console.log('Error with fetching data', error);
//         // Handle the error case
//     }
// });
// callNeotVideoProcessAPI()

const data = {
    "video_path": "video-test1.mp4",
    "program": "Visitors Counter",
    "areas": [
        {
            "points": [
                [254.7878972320399, 307.84105007400626],
                [533.5343626321752, 442.53240635641066],
                [509.272951447104, 492.7439593492626],
                [230.5264860469687, 358.0526030668582]
            ],
            "color": "#000000"
        },
        {
            "points": [
                [212.62408989910193, 361.24706633672594],
                [505.2608680135106, 492.92822821242453],
                [480.77588012503657, 547.3437882018544],
                [188.13910201062785, 415.6626263261559]
            ],
            "color": "#000000"
        }
    ]
}

const callNeotVideoProcessAPI = async () => {
    const response = await fetch("http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/get-and-process-video", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const responseInJson = await response.json();
    console.log(responseInJson)

}

