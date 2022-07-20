const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
    if(event.resource === '/todos'){
        if(event.httpMethod === 'POST'){
            let requestData = JSON.parse(event.body);
            const crypto = require("crypto");
            const id = crypto.randomBytes(16).toString("hex");
            await dynamo
              .put({
                TableName: tableName,
                Item: {
                  id: id,
                  title: requestData.title,
                  message: requestData.message,
                }
              })
              .promise();            
            const response = {
                statusCode: 200,
        		headers: {
        			"Access-Control-Allow-Origin": "*"
        		},	
                body: JSON.stringify('Item Added.'),
            };
            return response;
        }
        if(event.httpMethod === 'GET' ){
            const todos = await dynamo.scan({ TableName: tableName }).promise();
            
            const response = {
                statusCode: 200,
        		headers: {
        			"Access-Control-Allow-Origin": "*"
        		},	
                body: JSON.stringify(todos),
            };
            return response;
        }
    }
    
    const response = {
        statusCode: 400,
        body: JSON.stringify('404 Not Found'),
    };
    return response;
};
