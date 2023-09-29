let title = document.getElementById("title");
let task = document.getElementById("task");
let containar = document.getElementById("tasksRow");
let minBtn = document.getElementById("minBtn");
let itemId = "";
let helpId = document.getElementById("helpId");
let helpTask = document.getElementById("helpTask");

const socket = io("http://localhost:5001");
socket.on((data) => {
  getAll(data);
});

//------------display --------------//
socket.on("connect", () => {
  socket.on("getData", (data) => {
    getAll(data);
  });
});

function getAll(data) {
  let cartona = "";
  data?.map((x, index) => {
    cartona += `
    <div class="col-3">
    <div class="card shadow">
      <div class="card-body">
        <h4 class="card-title">${x.title}</h4>
        <p class="card-text">${x.task}</p>
        <button onclick="deleleItem('${x._id}')" id='deleleItem' type="button" class="btn btn-danger text-capitalize">delete</button>
        <button onclick="editItem('${x._id}')" id='edit' type="button" class="btn btn-info text-capitalize">edite</button>
      </div>
    </div>
  </div>
    `;
  });
  containar.innerHTML = cartona;
}
//-------------display end-------------//

function newTask() {
  if (minBtn.innerText !== "Edit") {
    if (title.value === "") {
      helpId.innerHTML = ` <P class = 'text-danger '>please Enter title</P>  `;
      return;
    }
    if (task.value === "") {
      helpTask.innerHTML = ` <P class = 'text-danger '>please Enter Task</P>  `;
      return;
    }
    socket.emit("newTask", { title: title.value, task: task.value });
    title.value = "";
    task.value = "";
    socket.on("all", (all) => {
      getAll(all);
    });
  } else {
    if (title.value === "") {
      helpId.innerHTML = ` <P class = 'text-danger '>please Enter title</P>  `;
      return;
    }
    if (task.value === "") {
      helpTask.innerHTML = ` <P class = 'text-danger '>please Enter Task</P>  `;
      return;
    }

    socket.emit("eidtTask", {
      title: title.value,
      task: task.value,
      id: itemId,
    });
    minBtn.innerText = "new task";
    title.value = "";
    task.value = "";
    socket.on("eidtTaskDone", (all) => {
      getAll(all);
    });
  }
}
function deleleItem(id) {
  socket.emit("deleleItem", id);
  socket.on("deleleItemDone", (all) => {
    getAll(all);
  });
}
function editItem(x) {
  socket.emit("findItem", x);
  socket.on("item", (item) => {
    title.value = item.title;
    task.value = item.task;
    minBtn.innerText = "Edit";
    itemId = item._id;
  });
}
function helper(item) {
  item.innerText = "";
}
