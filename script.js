let count = 0;
let list = [];


//Function to add item to to-do list
function list_additem() {
	let input = document.getElementById("input_notes");
	let date = new Date(Date.now()).toLocaleDateString();
	let emptyModalParent = document.getElementById('emptyModalParent')

	//modal display on empty input
	if (input.value.trim() === "") {
		emptyModalParent.classList.add("modal_parent");
		document.getElementById("input_notes").blur();
		emptyModalParent.addEventListener("click", close_modal);
		return;
	}

	list.push({
		id: count,
		description: input.value,
		taskCompleted: false
	});


	let newItem = "<li id='item" + list[count].id + "' ><div class='list_content'>" +
		"<input type='checkbox' class='checkbox' id='c" + list[count].id + "'>" +
		"<span class='descriptionAndDate'><span id = 'd" + list[count].id + "' class='description'>" + list[count].description + "</span>" +
		"<div class='descriptionDate'>" + date + "</div></span>" +
		"</div>" +
		"<div class='buttons'>" +
		"<button class='edit_button'><img src='./images/icons8-edit-24.png'></button>" +
		"<button id='r" + list[count].id + "' class='remove_button'><img id='removeimage" + list[count].id + "' src='./images/icons8-trash-can-50.png'></button>" +
		"</div></li>";

	document.getElementById("printing_list").insertAdjacentHTML('afterbegin', newItem);
	input.value = "";


	let checkBox = document.getElementById("c" + list[count].id)
	let description = document.getElementById("d" + list[count].id)

	//checkbox functionalities
	function toggleCheckedClass() {
		if (checkBox.checked)
			description.classList.add("checkboxChecked");
		else 
			description.classList.remove("checkboxChecked");
		list[parseInt(checkBox.id.replace("c", ""))].taskCompleted = checkBox.checked;
	}

	checkBox.addEventListener("change", toggleCheckedClass)

	description.addEventListener("click", function () {
		checkBox.checked = checkBox.checked ? false : true;
		toggleCheckedClass();
	})

	//Remove button event
	let removedItem = document.getElementById("r" + list[count].id);
	let removeimage = document.getElementById("removeimage" + list[count].id);
	function showDeletionModal(e) {
		document.getElementById("input_notes").blur();
		document.getElementById('removeModal').classList.add("modal_parent");
		let id = e.target.id.replace("removeimage", "").replace("r", "");
		document.getElementById('confirm').setAttribute("data-id", id)
	}
	removedItem.addEventListener("click", showDeletionModal);
	removeimage.addEventListener("click", showDeletionModal);

	count++;
}

function deleteItem(e) {
	console.log(e.target.dataset.id);
	document.getElementById("item" + e.target.dataset.id).remove();
	list = list.filter(object => object.id !== parseInt(e.target.dataset.id));
}

//focus on load and submission of input on enter
window.addEventListener("load", function (e) {
	document.getElementById("input_area").addEventListener("submit", e => {
		e.preventDefault();
		list_additem();
	});
	document.getElementById("input_notes").focus();

	let closeButton = document.getElementById('close');
	let removeModalParent = document.getElementById('removeModal')
	let confirmButton = document.getElementById('confirm');
	confirmButton.addEventListener("click", deleteItem);

	closeButton.addEventListener("click", function () {
		removeModalParent.classList.remove("modal_parent");
		document.getElementById("input_notes").focus();
	})

	removeModalParent.addEventListener("click", function () {
		removeModalParent.classList.remove("modal_parent");
		document.getElementById("input_notes").focus();
	});


});

// function to close modal
function close_modal() {
	document.getElementById("emptyModalParent").classList.remove("modal_parent");
	document.getElementById("input_notes").focus();
}

