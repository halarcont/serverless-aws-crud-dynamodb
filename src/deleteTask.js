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

        // Comprueba si la tarea existe antes de eliminarla
        const getTaskResult = await dynamodb.get({
            TableName: 'TaskTable',
            Key:{
                id,
            }
        }).promise();

        if (!getTaskResult.Item) {
            throw new createError.NotFound(`Task with ID "${id}" not found`);
        }

        // Si la tarea existe, procede a eliminarla
        await dynamodb.delete({
            TableName: 'TaskTable',
            Key:{
                id,
            }
        }).promise();

        return {
            status: 200,
            body: JSON.stringify({
                message: "Task deleted",
                success: "Task deleted successfully"
            })
        }
    } catch (error) {
        throw new createError.InternalServerError(error);
    }
}

let handler = middy(deleteTask)
handler.use(httpErrorHandler())

module.exports = { deleteTask: handler }
