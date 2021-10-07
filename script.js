var txt = "";
function list_additem() {
  let input = document.getElementById("input_notes");
  if (input.value.trim() === "") {
    window.alert("Enter any value");
    return;
  }
  txt += "<li>" + input.value + "</li>";
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
