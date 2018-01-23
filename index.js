const https = require('https');
const EventEmitter = require('events');
const config = require('./config.js');
const utils = require('./utils.js');

const myEmitter = new EventEmitter();

exports.handler = (event) => {

    const getS3ObjectParams = {
        Bucket: config.bucket,
        Key: event.Records[0].s3.object.key
    };

    // Create a request to Google Vision API
    const visionApiRequest = https.request(config.visionRequestOptions, res => {
        let results = '';
        res.on('data', chunk => results += chunk);

        res.on('end', () => {
            let isEdible = utils.checkIfEdible(JSON.parse(results));
            if (isEdible) {
                // Cat has received the appropriate food
                myEmitter.emit('edible');
            }
        });
    });

    // As the request to vision API is open we process the food to send to
    // analysis and close the request using the processFood method
    utils.processFood(getS3ObjectParams, visionApiRequest);

    myEmitter.on('edible', () => {
        let feeding_time = new Date();
        console.log(feeding_time.toISOString());
        // Updating last feeding timestamp in Dynamo
        let dynamoRequest = https.request(config.updateDynamoReq, res => {
            res.on('error', (err)=>{
                throw new Error('Unable to send request to dynamo:', err);
            });
            res.on('end', ()=>{
                console.log('done');
            });
        });
        let body = { timestamp: feeding_time };
        dynamoRequest.write(JSON.stringify(body));
        dynamoRequest.end();
    });
};