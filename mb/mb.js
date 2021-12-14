setInterval(() => {
  const grpc = require("@grpc/grpc-js");
  const protoLoader = require("@grpc/proto-loader");
  const path = require("path");

  const protoObject = protoLoader.loadSync(path.join(__dirname, "todo.proto"));
  const TodoClient = grpc.loadPackageDefinition(protoObject);

  const client = new TodoClient.TodoService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  client.list({}, (err, todo) => {
    if (err) {
      console.log("Erro ao listar:", err);
    }
    console.log("Lista:", todo);
  });
}, 5000);
