const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const config = require('./config');

const goodEnoughThreshold = 0.5; // Threshold for food analysis

/**
 * A wrapper function for the S3 getObject method and callback
 * After retrieving the uploaded object it encode it to base64 (as requqired by the Vision API).
 * The encoded object is then inserted to the Vision API payload
 * And being written to the API request
 *
 * @param uploadedFood: An object with a bucket name and key name to identify the uploaded image
 * @param visionAPIRequest The created request to Google Vision API
 */
function processFood (uploadedFood, visionAPIRequest) {
    S3.getObject(uploadedFood, function(err, data) {
        if (err) {
            throw new Error('Unable to feed:', err);
        }
        visionAPIRequest.on('error', (err) => {
            let errMesaage = 'Something is wrong with google vision request';
            throw new Error(errMesaage, err);
        });

        config.googleVisionApiPayload.requests[0].image = {
            content: data.Body.toString('base64')
        };

        let payload = JSON.stringify(config.googleVisionApiPayload);
        visionAPIRequest.write(payload);
        visionAPIRequest.end();
    });
}

/**
 * Determines according to the Vision API results and goodEnoughThreshold
 * If the food is edible or not.
 * In the configuration we allowed for five annotations only in the response.
 *
 * @param apiResults The response from Vision API
 * @returns {boolean} Is the food appropriate to the cat or not
 */
function checkIfEdible (apiResults) {
    //The path to the annotation within the response
    let relevantResponse = apiResults.responses[0].labelAnnotations;

    let results = relevantResponse.filter((result) => {
        //First, we check for allowed labels as defined in the config file
        let check_allowed = config.allowedFood.filter(
            allowed => result.description.includes(allowed)
        );
        // Then we are checking the certainty of the identification
        let good_enough = result.score >= goodEnoughThreshold;

        // Lastly we are returning annotation that satisfied both conditions
        return good_enough && check_allowed.length > 0;
    });
    return results.length > 0;
}

module.exports = {
    processFood,
    checkIfEdible
};