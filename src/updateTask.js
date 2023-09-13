const AWS = require('aws-sdk');
const createError = require('http-errors');
const middy = require('@middy/core')
const httpErrorHandler = require('@middy/http-error-handler')

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const updateTask = async (event) =>{
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const{ id } = event.pathParameters;
        const{ done, title, description } = JSON.parse(event.body)

        // Lanza un error si no se proporciona título o descripción
        if (!title || !description) {
            throw new createError.BadRequest('Título y descripción son requeridos');
        }

        await dynamodb.update({
            TableName: 'TaskTable',
            Key: {id},
            UpdateExpression: 'set done = :done, title = :title, description = :description',
            ExpressionAttributeValues: {
                ":done": done,
                ":title": title,
                ":description": description,
            },
            ReturnValues: 'ALL_NEW'
        }).promise()

        return{
            status: 200,
            body: JSON.stringify({
                message: 'Task updated succesfully'
            })
        }
    } catch (error) {
        throw new createError.InternalServerError(error);
    }
}

let handler = middy(updateTask)
handler.use(httpErrorHandler())

module.exports = { updateTask: handler }
