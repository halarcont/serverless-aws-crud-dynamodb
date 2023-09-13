const AWS = require('aws-sdk');
const createError = require('http-errors');
const middy = require('@middy/core')
const httpErrorHandler = require('@middy/http-error-handler')

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const getTask = async (event) =>{
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const { id } = event.pathParameters;

        const result = await dynamodb.get({
            TableName: 'TaskTable',
            Key:{
                id,
            }
        })
            .promise();

        const task = result.Item;

        // Lanza un error si la tarea no existe
        if (!task) {
            throw new createError.NotFound(`Task with ID "${id}" not found`);
        }

        return {
            status: 200,
            body: task
        }
    } catch (error) {
        throw new createError.InternalServerError(error);
    }
}

let handler = middy(getTask)
handler.use(httpErrorHandler())

module.exports = { getTask: handler }
