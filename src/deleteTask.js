const AWS = require('aws-sdk');
const createError = require('http-errors');
const middy = require('@middy/core')
const httpErrorHandler = require('@middy/http-error-handler')

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const deleteTask = async (event) =>{
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const { id } = event.pathParameters;

        const result = await dynamodb.delete({
            TableName: 'TaskTable',
            Key:{
                id,
            }
        })
            .promise();

        // Lanza un error si la tarea no existe
        if (!result.Attributes) {
            throw new createError.NotFound(`Task with ID "${id}" not found`);
        }

        return {
            status: 200,
            body: "Task deleted"
        }
    } catch (error) {
        throw new createError.InternalServerError(error);
    }
}

let handler = middy(deleteTask)
handler.use(httpErrorHandler())

module.exports = { deleteTask: handler }
