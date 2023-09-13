const ddbDocClient = require("./dynamodb").ddbDocClient;
const { GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const TableName = "TaskTable"

module.exports.listTask = async (event) => {
    const { Items } = await ddbDocClient().send(new ScanCommand({ TableName, }));
    return { statusCode: 200, body: JSON.stringify(Items, null, 2), };
};