import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
let list = [];

//Function to add item to to-do list
function list_additem(listItem) {
	if (listItem === undefined) {
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
			id: nanoid(),
			description: input.value.trim(),
			taskCompleted: false,
			date: date,
			editMode: false
		});
		input.value = "";
	}
	else {
		list.push({ ...listItem, editMode: false });
	}

	let newItem = "<li id='item" + list[list.length - 1].id + "' ><div class='list_content'>" +
		"<input " + (list[list.length - 1].taskCompleted ? "checked" : "") + " type='checkbox' class='checkbox' id='check-" + list[list.length - 1].id + "'>" +
		"<span class='descriptionAndDate'><span id = 'desc-" + list[list.length - 1].id + "' class='description " + (list[list.length - 1].taskCompleted ? "checkboxChecked" : "") + "'>" + list[list.length - 1].description + "</span>" +
		"<div class='descriptionDate'>" + list[list.length - 1].date + "</div></span>" +
		"</div>" +
		"<div class='buttons'>" +
		"<button id='edit-" + list[list.length - 1].id + "' class='edit_button'><img class='editButtonImage' id='editimage" + list[list.length - 1].id + "' src='./images/edit.png'></button>" +
		"<button id='remove-" + list[list.length - 1].id + "' class='remove_button'><img id='removeimage" + list[list.length - 1].id + "' src='./images/icons8-trash-can-50.png'></button>" +
		"</div></li>";

	document.getElementById("printing_list").insertAdjacentHTML('afterbegin', newItem);


	let checkBox = document.getElementById("check-" + list[list.length - 1].id)
	let description = document.getElementById("desc-" + list[list.length - 1].id)


	//cross-out on clicking description or checkbox
	checkBox.addEventListener("change", (e) => {
		let targetId = e.target.id.replace("check-", "")
		if (list.find(element => {
			return element.id.toString() === targetId
		}).editMode === false) {
			toggleCheckedClass(targetId);
		}
	})

	description.addEventListener("click", function (e) {
		let targetId = e.target.id.replace("desc-", "")
		if (list.find(element => {
			return element.id.toString() === targetId
		}).editMode === false) {
			checkBox.checked = checkBox.checked ? false : true;
			toggleCheckedClass(targetId);
		}
	})



	//Edit button functionalities
	let editItem = document.getElementById("edit-" + list[list.length - 1].id);
	let editimage = document.getElementById("editimage" + list[list.length - 1].id)
	function editContent(e) {
		e.stopPropagation();
		let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "")
		if (list.find(elem => elem.id.toString() === targetElem).editMode === false) {
			if (document.getElementById('check-' + targetElem).checked === true) {
				document.getElementById('desc-' + targetElem).classList.remove("checkboxChecked");
			}
			list.find(elem => elem.id.toString() === targetElem).editMode = true;
			document.getElementById('desc-' + targetElem).contentEditable = true;
			document.getElementById('check-' + targetElem).setAttribute("disabled", "disabled");
			editimage.classList.add("saveButtonImage");
			editimage.classList.remove("editButtonImage");
			editimage.setAttribute("src", './images/save.png')
			document.getElementById('desc-' + targetElem).focus();
			let placeOfEdit = document.getElementById('desc-' + targetElem)
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

			placeCaretAtEnd(placeOfEdit);


		}
		else {
			if (document.getElementById('check-' + targetElem).checked === true) {
				document.getElementById('desc-' + targetElem).classList.add("checkboxChecked");
			}
			if (!e.target.id.startsWith("desc")) { document.getElementById("input_notes").focus(); }
			list.find(elem => elem.id.toString() === targetElem).description = document.getElementById('desc-' + targetElem).innerText;
			list.find(elem => elem.id.toString() === targetElem).editMode = false;
			document.getElementById('check-' + targetElem).removeAttribute("disabled");
			document.getElementById('desc-' + targetElem).contentEditable = false;
			editimage.classList.remove("saveButtonImage");
			editimage.classList.add("editButtonImage");
			editimage.setAttribute("src", './images/edit.png')
			storeLocal();
		}

	}
	editItem.addEventListener("click", editContent)
	editimage.addEventListener("click", editContent)
	description.addEventListener("keydown", (e) => {
		if (e.code === "Enter") {
			editContent(e);
		}
	})

	//Remove button event
	let removedItem = document.getElementById("remove-" + list[list.length - 1].id);
	let removeimage = document.getElementById("removeimage" + list[list.length - 1].id);
	function showDeletionModal(e) {
		e.stopPropagation();
		document.getElementById("input_notes").blur();
		document.getElementById('removeModal').classList.add("emptyModalParent");
		let id = e.target.id.replace("removeimage", "").replace("remove-", "");
		document.getElementById('confirm').setAttribute("data-id", id)
	}
	removedItem.addEventListener("click", showDeletionModal);
	removeimage.addEventListener("click", showDeletionModal);

	storeLocal();
} //end of additem function



function deleteItem(e) {
	document.getElementById("item" + e.target.dataset.id).remove();
	document.getElementById('removeModal').classList.remove("emptyModalParent");
	document.getElementById("input_notes").focus();
	list = list.filter(object => object.id !== e.target.dataset.id);
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

	//getting the list from local storage 
	let listReceived = JSON.parse(localStorage.getItem("listSaved"));
	if (listReceived) {
		for (let i = 0; i < listReceived.length; i++) {
			list_additem(listReceived[i]);
		}
	}


});

// function to close modal
function close_modal() {
	document.getElementById("emptyModalParent").classList.remove("emptyModalParent");
	document.getElementById("input_notes").focus();
}
window.close_modal = close_modal;
function storeLocal() {
	let arrayToSave = list.map(item => {
		return { id: item.id, description: item.description, taskCompleted: item.taskCompleted, date: item.date };
	})
	let stringToSave = JSON.stringify(arrayToSave);
	localStorage.setItem("listSaved", stringToSave);
}
//checkbox functionalities and marking it as complete in list

function toggleCheckedClass(targetId) {
	let checkBox = document.getElementById("check-" + targetId)
	let description = document.getElementById("desc-" + targetId)
	if (checkBox.checked)
		description.classList.add("checkboxChecked");
	else
		description.classList.remove("checkboxChecked");
	list.find(element => {
		return element.id.toString() === targetId
	}).taskCompleted = checkBox.checked;
	storeLocal();
}