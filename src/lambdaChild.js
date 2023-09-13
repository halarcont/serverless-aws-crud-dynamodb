exports.child = async (event) => {
  console.log('Child function');
  console.log(event.undato)
    return {
      statusCode: 200,
      body: 
        {
          message: "Hola mundo  child lambda function",
          parametros: event.undato
        }
    };
  }; 
