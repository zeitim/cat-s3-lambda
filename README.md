# Cat S3 Lambda

An AWS Lambda to execute upon putting in an image (food) in a designated bucket (or a  certain folder in it).
The function will query Google Vision API with the uploaded image and will analyze the returned annotations.
If the analysis confirms it is an appropriate food the cat it will update the last feeding timestamp in DynamoDB

## Requirements

1. An API key for Google Vision API.
2. A DynamoDB table to store the feeding timestamp.
3. An API Gateway end point to put in Dynamo the updated timestamp.
    * My table was setup with an old timestamp value in advanced.
4. An S3 Notification to trigger the Lambda.
    * Mine was set up to be triggered upon uploading to a specific directory (The cat shouldn't try and eat everything).
    
## Setup

In _config.js_ in the appropriate places:
* Enter your Google Vision API key.
* Enter the bucket name to which the food will be uploaded.
* Enter the host name for the API Gateway to the Dynamo table.
* Enter the uri for the relevant resource in your API Gateway.

In the Lambda console:
* In the given index.js replace all the code with this repository's index.js' code.
* Create a config.js file and copy into it the code from our config.js.
* Same for utils.js

## Usage
Given everything is set up correctly once an image will be uploaded the Lambda will be executed.
If the uploaded image will contain a food the cat can eat, then the timestamp in database will be updated.