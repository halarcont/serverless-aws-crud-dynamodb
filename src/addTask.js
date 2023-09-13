const { v4 } = require('uuid')
const AWS = require('aws-sdk');
const createError = require('http-errors');
const middy = require('@middy/core')
const httpErrorHandler = require('@middy/http-error-handler')

// Configura AWS SDK para usar DynamoDB Local
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const addTask = async (event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const {title, description} = JSON.parse(event.body);

        // Lanza un error si no se proporciona título o descripción
        if (!title || !description) {
            throw new createError.BadRequest('Título y descripción son requeridos');
        }

        const createdAt = new Date();
        const id = v4();

        const newTask ={
            id,
            title,
            description,
            createdAt,
            done: false
        }

        await dynamodb.put({
            TableName: 'TaskTable',
            Item: newTask
        }).promise()

        return{
            statusCode: 200,
            body: JSON.stringify(newTask)
        };
    } catch (error) {
        throw new createError.InternalServerError(error);
    }
};

let handler = middy(addTask)
handler.use(httpErrorHandler())

module.exports = { addTask: handler }
