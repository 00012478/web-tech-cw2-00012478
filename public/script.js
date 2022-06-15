const select = (selector) => {
  return document.querySelector(selector);
};

const postReq = async (action, body, callback) => {
  try {
    const response = await fetch(action, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    callback(data);
  } catch (err) {
    throw err;
  }
};

const deleteReq = async (action, callback) => {
  try {
    const response = await fetch(action, {
      method: "DELETE",
    });
    const data = await response.json();
    callback(data);
  } catch (err) {
    throw err;
  }
};

const putReq = async (action, body, callback) => {
  try {
    const response = await fetch(action, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    callback(data);
  } catch (err) {
    throw err;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const todoForm = select("#todoForm");
  const editTodoTitleEl = select("#todoTitle");
  const editTodoTaskEl = select("#todoTask");
  const todoSaveBtn = select("#saveTodo");
  const createTodoBtn = select("#createTodo");
  const cancelSaveBtn = select("#cancelSave");

  cancelSaveBtn?.addEventListener("click", () => {
    todoForm.classList.remove("show");
    createTodoBtn.classList.remove("hide");
  });

  createTodoBtn?.addEventListener("click", () => {
    todoForm.setAttribute("data-todo", "createTodo");
    todoForm.classList.add("show");
    createTodoBtn.classList.add("hide");
  });

  document.addEventListener("click", (e) => {
    const element = e.target;
    if (element.hasAttribute("data-complete")) {
      const id = element.getAttribute("data-complete");
      putReq(`/complete/${id}`, {}, (data) => {
        if (!data.success) return;
        window.location.href = "/";
      });
      return;
    }

    if (element.hasAttribute("data-delete")) {
      const id = element.getAttribute("data-delete");
      deleteReq(`/delete/${id}`, (data) => {
        if (!data.success) return;
        window.location.href = "/";
      });
      return;
    }
  });

  const createNewTodo = () => {
    const body = {
      title: editTodoTitleEl.value,
      task: editTodoTaskEl.value,
    };
    const { title, task } = body;
    if (title.trim() === "" || task.trim() === "") {
      return;
    }
    postReq(`/create`, body, (data) => {
      if (!data.success) return;
      window.location.href = "/";
    });
  };

  todoSaveBtn?.addEventListener("click", (e) => {
    const id = todoForm.getAttribute("data-todo");
    if (!id) return;
    if (id === "createTodo") return createNewTodo();
  });
});
