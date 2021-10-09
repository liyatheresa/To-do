let txt = "";
let count=0;
function list_additem() {
  count++;
  let input = document.getElementById("input_notes");
  if (input.value.trim() === "") {
    window.alert("Enter any value");
    return;
  }
  txt += "<li>"+ count+". "+ input.value +"<div>"+"<button class="+"edit_button"+"><img src="+"./images/icons8-edit-24.png"+"></button>"+"<button><img src="+"./images/icons8-trash-can-50.png"+"></button>"+"<input type="+"checkbox"+">"+"</div>"+"</li>";
  document.getElementById("printing_list").innerHTML = txt;
  input.value = "";
}
window.addEventListener("load", function () {
  document.getElementById("input_notes").addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
      list_additem();
    }
  });
});
