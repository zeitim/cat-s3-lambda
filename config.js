const visionApiKey = 'REPLACE WITH YOUR GOOGLE VISION API KEY';

module.exports = {
    bucket: "YOUR BUCKET NAME",
    allowedFood: ['fish', 'milk', 'bread'],
    visionRequestOptions: {
        method: 'POST',
        host: `vision.googleapis.com`,
        json: true,
        path: `/v1/images:annotate?key=${visionApiKey}`
    },
    googleVisionApiPayload: {
        requests: [
            {
                features: [
                    {
                        type: 'LABEL_DETECTION',
                        maxResults: 5
                    }
                ]
            }
        ]
    },
    updateDynamoReq: {
        method: 'PUT',
        host: 'REPLACE WITH API GATEWAY HOST NAME',
        json: true,
        path: `/{REPLACE WITH RELATIVE PATH TO RESOURCE}`
    }
};