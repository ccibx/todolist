let data = {
    todoArr: [],
    doneArr: []
};

function main() {
    //存储在localStorage的数据可以长期保留，除非用户主动清空
    let storage = localStorage.getItem("todo");
    if (storage !== null) {
        data = JSON.parse(storage);
        //渲染
        render(data);
    }

    //获取按钮DOM
    let addBtn = document.getElementById("add-btn");

    //获取输入框DOM
    let titleInput = document.getElementById("title");

    //为按钮增加click事件监听
    addBtn.addEventListener(
        "click",
        (event) => {
            //如果有输入内容
            if(titleInput.value) {
                data.todoArr.push(titleInput.value);
                //渲染
                render(data);
                //清空
                titleInput.value = "";
            }
        }
    );

    //获取容器DOM
    let contentDom = document.getElementById("content");

    //通过事件代理的方式，监听input触发的change事件
    contentDom.addEventListener(
        "change",
        (event) => {
            let target = event.target;
            if(target.dataset.from === "todo" && target.tagName === "INPUT") {
                let index = +target.dataset.index;
                //删除这一项
                let value = data.todoArr.splice(index, 1)[0];
                //添加到done
                data.doneArr.push(value);
                render(data);
            } else if (target.dataset.from === "done" && target.tagName === "INPUT") {
                let index = +target.dataset.index;
                let value = data.doneArr.splice(index, 1)[0];
                data.todoArr.push(value);
                render(data);
            }
        }
    );

    //通过事件代理的方式，监听img派发的click事件
    contentDom.addEventListener(
        "click",
        (event) => {
            let target = event.target;
            if(target.dataset.from === "todo" && target.tagName ==="IMG") {
                let index = +target.dataset.index;
                data.todoArr.splice(index, 1);
                render(data);
            } else if (target.dataset.from ==="done" && target.tagName === "IMG") {
                let index = +target.dataset.index;
                data.doneArr.splice(index, 1);
                render(data);
            }
        }
    );
}

let imgSrc = "./img/todolist_deleteImg.jpg";

function render(data) {
    localStorage.setItem("todo", JSON.stringify(data));

    //先清空内容
    let todoContainer = document.getElementById("todoList");
    todoContainer.innerHTML = "";
    let doneContainer = document.getElementById("doneList");
    doneContainer.innerHTML = "";

    //以下展示两种循环插入DOM的方式

    //第一种方式是直接拼接HTML
    let todoArr = data.todoArr;
    let todoHTML = "";
    for(let i = 0, len = todoArr.length; i < len; i++) {
        todoHTML += `
          <li>
          <input type="checkbox" data-from="todo" data-index="${i}"></input>
          <span>${todoArr[i]}</span>
          <img src="${imgSrc}" data-from="todo" data-index="${i}"></img>
          </li>`;
    }
    todoContainer.innerHTML = todoHTML;

    //第二种方式是通过 DOM API
    let doneArr = data.doneArr;
    for(let i = 0, len = doneArr.length; i < len; i++) {
        let li = document.createElement("li");
        let input = document.createElement("input");
        input.type = "checkbox";
        input.setAttribute("checked", "");
        input.dataset.index = i;
        input.dataset.from = "done";

        let span = document.createElement("span");
        span.textContent = doneArr[i];

        let img = document.createElement("img");
        img.src = imgSrc;
        img.dataset.index = i;
        img.dataset.from = "done";

        li.appendChild(input);
        li.appendChild(span);
        li.appendChild(img);
        doneContainer.appendChild(li);
    }
}

//在文档加载完成后会触发load事件
window.onload = main;