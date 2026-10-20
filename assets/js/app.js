const cl = console.log;
const spinner = document.getElementById("spinner");
const todoContainer = document.getElementById("todoContainer");
const form = document.getElementById("form");
const titleControl = document.getElementById("title");
const descriptionControl = document.getElementById("description");
const isCompletedControl = document.getElementById("isCompleted");
const  addBtn= document.getElementById("addBtn");
const  updateBtn= document.getElementById("updateBtn");


//url 
let BASE_URL = "https://fetch-api-crud-e52ad-default-rtdb.asia-southeast1.firebasedatabase.app";
let TODO_URL = `${BASE_URL}/todo9.json`

//state
const state = {
    todoArr: [],
    EDIT_ID: null
}

//snackBar 
function snackBar(msg, icon) {
    Swal.fire({
        text: msg,
        icon: icon,
        timer: 2500
    })
}
//
function toggleSpinner() {
    spinner.classList.toggle("d-none");
}

//read 
async function showOnUi() {
    try {
        toggleSpinner();
        let res = await fetch(TODO_URL, {
            method: "GET",
            body: null,
            headers: {
                "conent-type": "application/json",
                "authorization": "JWT TOKEN"
            }
        })
        let data = await res.json();
        cl(data);
        for (const key in data) {
            data[key].id = key;
            state.todoArr.push(data[key]);
        }
        templeting(state.todoArr);
    }
    catch (err) {
        snackBar(err.message, "error")
    }
    finally {
        toggleSpinner();
    }
}
showOnUi()

//templeting
function templeting(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += ` <li class="list-group-item" id="${ele.id}">
         <div
                    class="d-flex justify-content-between"
                    onclick="onDescription(this)">
                <div>
                    ${ele.isCompleted ? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked>` :
                `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}
                      <strong>${ele.title}</strong>
                 </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
          </div>


                  <div class="collapse">
                    <div class="card-body">${ele.description}
                    </div>
                  </div>
                </li>`
    });
    todoContainer.innerHTML = result;
}
//create
async function onAddTodo(eve) {
    try {
        eve.preventDefault();
        let newObj = {
            title: titleControl.value,
            description: descriptionControl.value,
            isCompleted: isCompletedControl.value === "yes" ? true : false
        }
        toggleSpinner()
        let res = await fetch(TODO_URL, {
            method: "POST",
            body: JSON.stringify(newObj),
            headers: {
                "content-type": "application/json",
                "authorization": "JWT TOKEN"
            }
        })
        let data = await res.json();
        cl(data);
        newObj.id = data.name;
        state.todoArr.push(newObj);
        let li = document.createElement("li");
        li.id = newObj.id;
        li.className = "list-group-item";
        li.innerHTML = `<div
                    class="d-flex justify-content-between"
                    onclick="onDescription(this)">
                    <div>
                    ${newObj.isCompleted ? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked>` :
                `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}
                      <strong>${newObj.title}</strong>
                    </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div class="collapse">
                    <div class="card-body">${newObj.description}
                    </div>
                  </div>`
        todoContainer.append(li);
        form.reset();
        snackBar("todo is added successfully","success");
    }
    catch (err) {
        snackBar(err.messagee, "error")
    }
    finally {
        toggleSpinner()
    }
}
//edit 
function onEdit(ele){
    let edit_id = ele.closest("li").id;
    state.EDIT_ID = edit_id;
    let edit_obj = state.todoArr.find(obj => obj.id === edit_id);
    titleControl.value = edit_obj.title;
    descriptionControl.value = edit_obj.description;
    isCompletedControl.value = edit_obj.isCompleted ? "yes" : "no"
    addBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}
//update
async function onUpdate(){
    try{
    let update_id = state.EDIT_ID;
    let update_url = `${BASE_URL}/todo9/${update_id}.json`
    let update_obj = {
      title: titleControl.value,
            description: descriptionControl.value,
            isCompleted: isCompletedControl.value === "yes" ? true : false,
            id:update_id
    }
    toggleSpinner()
    let res = await fetch(update_url,{
        method: "PATCH",
            body: JSON.stringify(update_obj),
            headers: {
                "conent-type": "application/json",
                "authorization": "JWT TOKEN"
            }
    })
    let data = await res.json();
    let getIndex = state.todoArr.findIndex(obj=> obj.id === update_id);
    state.todoArr[getIndex] = update_obj;
    let li = document.getElementById(update_id);
    li.innerHTML = `<div
                    class="d-flex justify-content-between"
                    onclick="onDescription(this)">
                    <div>
                    ${update_obj.isCompleted ? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked>` :
                `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}
                      <strong>${update_obj.title}</strong>
                    </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div class="collapse">
                    <div class="card-body">${update_obj.description}
                    </div>
                  </div>`
                  form.reset();
                  addBtn.classList.remove("d-none");
                  updateBtn.classList.add("d-none");
                  snackBar("todo is updated successfully","success")
    }
  catch(err){
snackBar(err.message,"error")
  }
  finally{
 toggleSpinner();
  }
}
//delete
async function onRemove(ele){
 let confirm = await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
})
  if (confirm.isConfirmed) {
    try{
          let remove_id = ele.closest("li").id;
    let remove_url = `${BASE_URL}/todo9/${remove_id}.json`
    toggleSpinner();
   let res = await fetch(remove_url,{
    method:"DELETE",
    body:null,
    headers:{
        "content-type":"application/json",
        "authorization":"JWT TOKEN"
    }
   })
   let data = await res.json();
   let index = state.todoArr.findIndex(obj => obj.id === remove_id);
   state.todoArr.splice(index, 1);
   ele.closest("li").remove();
   snackBar("todo is deleted successfully","success");
    }
    catch(err){
  snackBar(err.message,"error")
    }
    finally{
   toggleSpinner();
    }
  }
}
//update chekbox
async function onCheck(ele){
  try{
      let UPDATE_ID = ele.closest("li").id;
    let update_url = `${BASE_URL}/todo9/${UPDATE_ID}.json`
    let updateObj = {
        isCompleted : ele.checked, 
    }
    toggleSpinner()
    let res = await fetch(update_url,{
        method:"PATCH",
        body:JSON.stringify(updateObj),
        headers:{
              "content-type":"application/json",
            "authorization":"JWT TOKEN"
        } 
       })
       let data = await res.json();
       let getIndex = state.todoArr.findIndex(obj=> obj.id === UPDATE_ID);
       state.todoArr[getIndex].isCompleted = ele.checked;
       snackBar("chekbox updated","success")
  }
  catch(err){
  snackBar(err.message,"error");
  }
  finally{
  toggleSpinner();
  }
  }
//toggle discription 
function  onDescription(ele){
  let description = ele.nextElementSibling;
  // cl(description);
  let open = description.classList.contains("show");

  let allDescription = ele.closest("#todoContainer").querySelectorAll(".collapse");

allDescription.forEach(ele =>{
  ele.classList.remove("show")
})
if(!open){
 description.classList.add("show");
}
}
updateBtn.addEventListener("click",onUpdate);
form.addEventListener("submit", onAddTodo);