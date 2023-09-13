const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const offlineOptions = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
};
let ddbDocClient = null;

module.exports.ddbDocClient = () => {
    if (ddbDocClient) return ddbDocClient;
    client = process.env.IS_OFFLINE ? new DynamoDBClient(offlineOptions) : new DynamoDBClient();
    ddbDocClient = DynamoDBDocumentClient.from(client);
    return ddbDocClient;
}