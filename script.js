var txt = "";
function list_additem() {
  // document.write("HIIIII");
  txt += "<li>" + document.getElementById("input_notes").value + "</li>";
  document.getElementById("printing_list").innerHTML = txt;
}
