const grpc = require("grpc");
const pathTodoProto = require("path").join(__dirname, "todo.proto");
const todoProto = grpc.load(pathTodoProto);
const server = new grpc.Server();
const fakeDB = [
  { id: 1, done: false, task: "Tarefa 1" },
  { id: 2, done: false, task: "Tarefa 2" },
];

function changeData(id, checked, task) {
  if (!task) task = "not found";
  let res = { id: id, done: false, task: task };

  for (let i = 0; i < fakeDB.length; i++) {
    if (fakeDB[i].id == id) {
      fakeDB[i].done = checked;
      res = fakeDB[i];
    }
  }

  return res;
}

server.addService(todoProto.TodoService.service, {
  insert: (call, callback) => {
    console.log("call", call.request);
    let todo = call.request;
    let data = changeData(fakeDB.length + 1, false, todo.task);
    if (todo.task) fakeDB.push(data);
    callback(null, data);
  },

  list: (_, callback) => {
    callback(null, fakeDB);
  },

  mark: (_, callback) => {
    let item = call.request;
    callback(null, changeData(item.id, item.checked));
  },
});

server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Servidor iniciado na porta 127.0.0.1:50051");
server.start();
