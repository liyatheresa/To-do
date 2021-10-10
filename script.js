let txt = "";
let count=0;
function list_additem() {
  count++;
  let input = document.getElementById("input_notes");
  if (input.value.trim() === "") {
    window.alert("Enter any value");
    return;
  }
  txt += "<li>"+"<div class="+"list_content"+">"+"<span class="+"list_numbers"+">"+ count+". "+"</span>"+"<span>"+ input.value +"</span>"+"</div>"+"<div class="+"buttons"+">"+"<button class="+"edit_button"+"><img src="+"./images/icons8-edit-24.png"+"></button>"+"<button class="+"remove_button"+"><img src="+"./images/icons8-trash-can-50.png"+"></button>"+"<input type="+"checkbox"+" class="+"checkbox"+">"+"</div>"+"</li>";
  document.getElementById("printing_list").innerHTML = txt;
  input.value = "";
}
window.addEventListener("load", function () {
  document.getElementById("input_notes").addEventListener("keydown", function (e) {
    console.log(e);
    if (e.code === "Enter") {
      list_additem();
    }
  });
});
