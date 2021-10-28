let count = 0, itemNumber = 0;
let list = [];


//Function to add item to to-do list
function list_additem() {
  let input = document.getElementById("input_notes");
  let date=new Date(Date.now()).toLocaleDateString();
  list.push({
    id: count++,
    description: input.value,
    taskCompleted: false
  });

  //modal display on empty input
  if (input.value.trim() === "") {
    document.getElementById("modal_parent").style.display = "flex";
    document.getElementById("input_notes").blur();
    return;
  }

  let newItem = "<li><div class='list_content'>"+
                "<input type='checkbox' class='checkbox' id='c" + list[itemNumber].id + "'>"+
                "<span id = 'd" + list[itemNumber].id + "' class='descriptionAndDate'><span class='description'>" + list[itemNumber].description + "</span>"+
                "<div class='descriptionDate'>"+date+"</div></span>"+
                "</div>"+
                "<div class='buttons'>"+
                "<button class='edit_button'><img src='./images/icons8-edit-24.png'></button>"+
                "<button class='remove_button'><img src='./images/icons8-trash-can-50.png'></button>"+
                "</div></li>";

  document.getElementById("printing_list").insertAdjacentHTML('afterbegin', newItem);
  input.value = "";


  let checkBox = document.getElementById("c" + list[itemNumber].id)
  let description = document.getElementById("d" + list[itemNumber].id)

  //checkbox functionalities
  function toggleCheckedClass(){
    if (checkBox.checked) {
      description.classList.add("checkboxChecked");
    }
    else {
      description.classList.remove("checkboxChecked");
    }
  }

  checkBox.addEventListener("change", toggleCheckedClass)

  description.addEventListener("click", function () {
    checkBox.checked = checkBox.checked ? false : true;
    toggleCheckedClass();
  })



  itemNumber++;
}

//focus on load and submission of input on enter
window.addEventListener("load", function () {
  document.getElementById("input_notes").focus();
  document.getElementById("input_notes").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      list_additem();
    }
  });
});

// function to close modal
function close_modal() {
  document.getElementById("modal_parent").style.display = "none";
  document.getElementById("input_notes").focus();
}

