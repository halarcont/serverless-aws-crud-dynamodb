const { SFNClient, StartExecutionCommand } = require("@aws-sdk/client-sfn");

const client = new SFNClient({
    endpoint: 'http://localhost:8083',
    region: 'us-east-2',
    disableHostPrefix: true,
    credentials: {
        accessKeyId: 'fakeAccessKey',
        secretAccessKey: 'fakeSecretAccessKey',
    }
});

module.exports.startSF = async (event, context, callback) => { //Esta es la definición de la función Lambda. La función es asíncrona, lo que significa que devuelve una promesa que se resuelve cuando se completa la función.
    const input = {};                                                    //Aquí se está creando un objeto vacío llamado input. Este objeto se puede llenar con los datos que quieres pasar a la máquina de estados de Step Functions.
    const command = new StartExecutionCommand({                              //Aquí se está creando un nuevo comando StartExecutionCommand. Este comando inicia una ejecución de una máquina de estados de Step Functions.
        input: JSON.stringify(input),                                        //Aquí se está convirtiendo el objeto input en una cadena JSON y pasándolo al comando StartExecutionCommand
        stateMachineArn: 'arn:aws:states:us-east-2:101010101010:' +          //Esta es la ARN (Amazon Resource Name) de la máquina de estados de Step Functions que quieres iniciar. Cambia 'arn:aws:states:us-east-1:101010101010:stateMachine:DemoStateMachine' por la ARN de tu máquina de estados.
            'stateMachine:DemoStateMachine'
    });
    return await client.send(command).then(                                  //Aquí se está enviando el comando al cliente de AWS. La función then se utiliza para manejar la respuesta una vez que la promesa se resuelve.
        (data) => {                                                    //Esta es la función que se ejecuta si el comando se envía con éxito. Recibe los datos devueltos por el comando como argumento.
            console.log("data", data);                                       //imprime los datos devueltos por el comando en la consola.
            callback(null, `Your state machine ${command.input.stateMachineArn}
             executed successfully`)                                         //Esto llama a la función de callback con un mensaje de éxito. El primer argumento es null` porque no hubo ningún error
        },
        (error) => {                                                   //Esta es la función que se ejecuta si hay un error al enviar el comando. Recibe el error como argumento.
            console.log("error", error)                                      //Imprime el error en la consola.
            callback(error.message);                                         //Esto llama a la función de callback con el mensaje de error.
        }
    );
};

module.exports.hello = async event => {
    console.log('hello');
    return { message: 'Hello', event };
};

module.exports.world = async event => {
    console.log('world');
    return { message: 'Final thing!!!', event };
};

module.exports.other = async event => {
    console.log('other');
    return { message: 'other', event };
};

module.exports.fill = async event => {
    console.log('fill');
    return { message: 'fill', event };
};