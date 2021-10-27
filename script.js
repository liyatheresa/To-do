let txt = "";
let count=0;
let list= [];

function list_additem() {
  let input = document.getElementById("input_notes");

  list.push({
    id: count++ ,
    description: input.value,
    taskCompleted: false
  });
  
  if (input.value.trim() === "") {
    document.getElementById("modal_parent").style.display= "flex";
    document.getElementById("input_notes").blur();
    return;
  }

  txt = "<li>"+"<div class="+"list_content"+">"+"<input type="+"checkbox"+" class="+"checkbox"+">"+
  "<span>"+ input.value +"</span>"+"</div>"+"<div class="+"buttons"+">"+"<button class="+"edit_button"+"><img src="+"./images/icons8-edit-24.png"+"></button>"+
  "<button class="+"remove_button"+"><img src="+"./images/icons8-trash-can-50.png"+"></button>"+"</div>"+"</li>" +txt;
  document.getElementById("printing_list").innerHTML = txt;
  input.value = "";

console.log(list)

}

console.log(list)

window.addEventListener("load", function () {
  document.getElementById("input_notes").focus();
  document.getElementById("input_notes").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      list_additem();
    }
  });
});
function close_modal(){
  document.getElementById("modal_parent").style.display= "none";
  document.getElementById("input_notes").focus();
}
