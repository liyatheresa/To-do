let count = 0;
let list = [];

//Function to add item to to-do list
function list_additem() {
	let input = document.getElementById("input_notes");
	let date = new Date(Date.now()).toLocaleDateString();
	let emptyModalParent = document.getElementById('emptyModalParent')

	//modal display on empty input
	if (input.value.trim() === "") {
		emptyModalParent.classList.add("emptyModalParent");
		document.getElementById("input_notes").blur();
		document.getElementById('modal').addEventListener("click", (e) => { e.stopPropagation(); })
		emptyModalParent.addEventListener("click", close_modal);
		return;
	}

	list.push({
		id: count,
		description: input.value.trim(),
		taskCompleted: false,
		editMode: false
	});


	let newItem = "<li id='item" + list[count].id + "' ><div class='list_content'>" +
		"<input type='checkbox' class='checkbox' id='c" + list[count].id + "'>" +
		"<span class='descriptionAndDate'><span id = 'd" + list[count].id + "' class='description'>" + list[count].description + "</span>" +
		"<div class='descriptionDate'>" + date + "</div></span>" +
		"</div>" +
		"<div class='buttons'>" +
		"<button id='e" + list[count].id + "' class='edit_button'><img class='editButtonImage' id='editimage" + list[count].id + "' src='./images/edit.png'></button>" +
		"<button id='r" + list[count].id + "' class='remove_button'><img id='removeimage" + list[count].id + "' src='./images/icons8-trash-can-50.png'></button>" +
		"</div></li>";

	document.getElementById("printing_list").insertAdjacentHTML('afterbegin', newItem);
	input.value = "";


	let checkBox = document.getElementById("c" + list[count].id)
	let description = document.getElementById("d" + list[count].id)

	//checkbox functionalities and marking it as complete in list

	function toggleCheckedClass() {
		if (checkBox.checked)
			description.classList.add("checkboxChecked");
		else
			description.classList.remove("checkboxChecked");
		list[parseInt(checkBox.id.replace("c", ""))].taskCompleted = checkBox.checked;
		storeLocal();
	}

	checkBox.addEventListener("change", () => {
		if (list[checkBox.id.replace("c", "")].editMode === false) {
			toggleCheckedClass();
		}
	})

	description.addEventListener("click", function () {
		if (list[description.id.replace("d", "")].editMode === false) {
			checkBox.checked = checkBox.checked ? false : true;
			toggleCheckedClass();
		}
	})



	//Edit button functionalities
	let editItem = document.getElementById("e" + list[count].id);
	let editimage = document.getElementById("editimage" + list[count].id)
	function editContent(e) {
		e.stopPropagation();
		console.log(list)
		if (list[e.target.id.replace("editimage", "").replace("e", "")].editMode === false) {
			if (document.getElementById('c' + e.target.id.replace("editimage", "").replace("e", "")).checked === true) {
				document.getElementById('d' + e.target.id.replace("editimage", "").replace("e", "")).classList.remove("checkboxChecked");
			}
			list[e.target.id.replace("editimage", "").replace("e", "")].editMode = true;
			description.contentEditable = true;
			document.getElementById('c' + e.target.id.replace("editimage", "").replace("e", "")).setAttribute("disabled", "disabled");
			editimage.classList.add("saveButtonImage");
			editimage.classList.remove("editButtonImage");
			editimage.setAttribute("src", './images/save.png')
			document.getElementById('d' + e.target.id.replace("editimage", "").replace("e", "")).focus();
			let placeOfEdit= document.getElementById('d' + e.target.id.replace("editimage", "").replace("e", ""))
			function placeCaretAtEnd(el) {
				el.focus();
				if (typeof window.getSelection != "undefined"
						&& typeof document.createRange != "undefined") {
					var range = document.createRange();
					range.selectNodeContents(el);
					range.collapse(false);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (typeof document.body.createTextRange != "undefined") {
					var textRange = document.body.createTextRange();
					textRange.moveToElementText(el);
					textRange.collapse(false);
					textRange.select();
				}
			}
			
			placeCaretAtEnd( placeOfEdit ); 
		}
		else {
			if (document.getElementById('c' + e.target.id.replace("editimage", "").replace("e", "")).checked === true) {
				document.getElementById('d' + e.target.id.replace("editimage", "").replace("e", "")).classList.add("checkboxChecked");
			}
			document.getElementById("input_notes").focus();
			list[e.target.id.replace("editimage", "").replace("e", "")].description = document.getElementById('d' + e.target.id.replace("editimage", "").replace("e", "")).innerText;
			list[e.target.id.replace("editimage", "").replace("e", "")].editMode = false;
			document.getElementById('c' + e.target.id.replace("editimage", "").replace("e", "")).removeAttribute("disabled");
			description.contentEditable = false;
			editimage.classList.remove("saveButtonImage");
			editimage.classList.add("editButtonImage");
			editimage.setAttribute("src", './images/edit.png')
			storeLocal();
		}

	}
	editItem.addEventListener("click", editContent)
	editimage.addEventListener("click", editContent)

	//Remove button event
	let removedItem = document.getElementById("r" + list[count].id);
	let removeimage = document.getElementById("removeimage" + list[count].id);
	function showDeletionModal(e) {
		e.stopPropagation();
		document.getElementById("input_notes").blur();
		document.getElementById('removeModal').classList.add("emptyModalParent");
		let id = e.target.id.replace("removeimage", "").replace("r", "");
		document.getElementById('confirm').setAttribute("data-id", id)
	}
	removedItem.addEventListener("click", showDeletionModal);
	removeimage.addEventListener("click", showDeletionModal);

	storeLocal();
	count++;
}

function deleteItem(e) {
	console.log(e.target.dataset.id);
	document.getElementById("item" + e.target.dataset.id).remove();
	document.getElementById('removeModal').classList.remove("emptyModalParent");
	document.getElementById("input_notes").focus();
	list = list.filter(object => object.id !== parseInt(e.target.dataset.id));
	storeLocal();
}

//focus on load and submission of input on enter And adding event to modal button and parent
window.addEventListener("load", function (e) {
	document.getElementById("input_area").addEventListener("submit", e => {
		e.preventDefault();
		list_additem();
	});
	document.getElementById("input_notes").focus();

	let closeButton = document.getElementById('close');
	let removeModalParent = document.getElementById('removeModal')
	let confirmButton = document.getElementById('confirm');
	document.getElementById('popup').addEventListener("click", (e) => { e.stopPropagation(); })
	confirmButton.addEventListener("click", deleteItem);

	closeButton.addEventListener("click", function () {
		removeModalParent.classList.remove("emptyModalParent");
		document.getElementById("input_notes").focus();
	})

	removeModalParent.addEventListener("click", function (e) {
		removeModalParent.classList.remove("emptyModalParent");
		document.getElementById("input_notes").focus();
	});


});

// function to close modal
function close_modal(e) {
	document.getElementById("emptyModalParent").classList.remove("emptyModalParent");
	document.getElementById("input_notes").focus();
}
function storeLocal(){
	let arrayToSave = list.map(item => {
		return {id: item.id, description: item.description, taskCompleted: item.taskCompleted};
	})
	let stringToSave= JSON.stringify(arrayToSave);
	localStorage.setItem("list",stringToSave);
}
