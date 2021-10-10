let txt = "";
let count=0;
function list_additem() {
  count++;
  let input = document.getElementById("input_notes");
  if (input.value.trim() === "") {
    window.alert("Enter any value");
    return;
  }
  txt = "<li>"+"<div class="+"list_content"+">"+"<input type="+"checkbox"+" class="+"checkbox"+">"+
  "<span>"+ input.value +"</span>"+"</div>"+"<div class="+"buttons"+">"+"<button class="+"edit_button"+"><img src="+"./images/icons8-edit-24.png"+"></button>"+
  "<button class="+"remove_button"+"><img src="+"./images/icons8-trash-can-50.png"+"></button>"+"</div>"+"</li>" +txt;
  document.getElementById("printing_list").innerHTML = txt;
  input.value = "";
}
window.addEventListener("load", function () {
  document.getElementById("input_notes").focus();
  document.getElementById("input_notes").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      list_additem();
    }
  });
});
