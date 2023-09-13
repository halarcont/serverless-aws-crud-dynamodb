const { InvokeCommand, LambdaClient, LogType } = require("@aws-sdk/client-lambda");
async function callChildLambda() {
  const client = new LambdaClient({
    endpoint: "http://localhost:3002",
    region: "eu-est-1",
    credentials: {
      accessKeyId: 'DEFAULT_ACCESS_KEY',
      secretAccessKey: 'DEFAULT_SECRET',
    },
  });
  /*   Name of the function convention service-stage-function -
         service: aws-lambda-crud-node
         stage: dev
         function: lambda_child    */
  const input = {
    FunctionName: "aws-lambda-crud-node-dev-lambda_child", // Name of the function 
    InvocationType: "RequestResponse", //"Event"  "RequestResponse"  "DryRun",
    Payload: JSON.stringify({ undato: "abcd1234" }),
  }

  const command = new InvokeCommand(input);
  const response = await client.send(command);
  return response.Payload.transformToString('utf-8')
}
exports.parent = async (event) => {
  const child_respuesta = await callChildLambda();
  console.log('Child data', child_respuesta);

  return {
    statusCode: 200,
    body: child_respuesta
  };
};

