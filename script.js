import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
let toDoList = [];

//Function to add item to to-do list
function addToDoItem(toDoItem) {
	if (toDoItem === undefined) {
		let input = $("new-note-input");
		let date = new Date().toLocaleDateString();
		let emptyModalParent = $('emptyModalParent')

		//modal display on empty input
		if (input.value.trim() === "") {
			emptyModalParent.classList.add("emptyModalParent");
			$("new-note-input").blur();
			$('modal').addEventListener("click", (e) => { e.stopPropagation(); })
			emptyModalParent.addEventListener("click", closeModal);
			return;
		}

		toDoList.push({
			id: nanoid(),
			description: input.value.trim(),
			taskCompleted: false,
			date: date,
			editMode: false
		});
		input.value = "";
	}
	else {
		toDoList.push({ ...toDoItem, editMode: false });
	}
	if (toDoList.length === 1) {
		let emptyImage = $("emptyImage");
		if (emptyImage) {
			emptyImage.remove();
			$("list-items").classList.remove("add-empty-image");
			$("searchText").classList.remove("hidden");
		}
	}
	let newItem = "<li id='item" + toDoList[toDoList.length - 1].id + "' ><div class='list-content'>" +
		"<input " + (toDoList[toDoList.length - 1].taskCompleted ? "checked" : "") + " type='checkbox' class='checkbox' id='check-" + toDoList[toDoList.length - 1].id + "'>" +
		"<span class='descriptionAndDate'><span id = 'desc-" + toDoList[toDoList.length - 1].id + "' class='description " + (toDoList[toDoList.length - 1].taskCompleted ? "checkboxChecked" : "") + "'>" + toDoList[toDoList.length - 1].description + "</span>" +
		"<div class='descriptionDate'>" + toDoList[toDoList.length - 1].date + "</div></span>" +
		"</div>" +
		"<button class='saveButton hidden' id='save-" + toDoList[toDoList.length - 1].id + "'>" + "<img class='saveImage' id='saveImage-" + toDoList[toDoList.length - 1].id + "' src='./images/save.png'>" + "</button>" +
		"<div class='dropdown'>" +
		"<a id='menu-" + toDoList[toDoList.length - 1].id + "'>" + "<img class='dotmenu' id='dotmenu-" + toDoList[toDoList.length - 1].id + "' src='./images/dotmenu.svg'>" + "</a>" +
		"</div>" +
		"<div class='overlay' id='overlay'>" +
		"<button id='alter-" + toDoList[toDoList.length - 1].id + "' class='alter-button'>" + "Edit" + "</button>" +
		"<button id='delete-" + toDoList[toDoList.length - 1].id + "' class='delete-button'>" + "Delete" + "</button>" +
		"<button id='cancel-" + toDoList[toDoList.length - 1].id + "' class='cancel-button'>" + "Cancel" + "</button>" +
		"</div>" +
		"<div class='buttons' id='buttons'>" +
		"<button id='edit-" + toDoList[toDoList.length - 1].id + "' class='edit-button'><img class='editButtonImage' id='editimage" + toDoList[toDoList.length - 1].id + "' src='./images/edit.png'></button>" +
		"<button id='remove-" + toDoList[toDoList.length - 1].id + "' class='remove-button'><img id='removeimage" + toDoList[toDoList.length - 1].id + "' src='./images/icons8-trash-can-50.png'></button>" +
		"</div></li>";
	$("printing-list").insertAdjacentHTML('afterbegin', newItem);

	let menu = $("menu-" + toDoList[toDoList.length - 1].id);
	let dotMenu = $("dotmenu-" + toDoList[toDoList.length - 1].id);
	function displayButtons(e) {
		e.stopPropagation();
		$("overlay").classList.add("flexDisplay");
		$("floatDiv").classList.add("floatDiv");
		$("floatButton").classList.add("hidden");
	}
	menu.addEventListener("click", displayButtons);
	dotMenu.addEventListener("click", displayButtons);

	let alterButton = $("alter-" + toDoList[toDoList.length - 1].id)
	alterButton.addEventListener("click", editContent);

	let save = $("save-" + toDoList[toDoList.length - 1].id);
	let saveImage = $("saveImage-" + toDoList[toDoList.length - 1].id);
	function saveEditedContent(e) {
		e.stopPropagation();
		let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "").replace("alter-", "").replace("save-", "").replace("saveImage-", "");
		let element = toDoList.find(elem => elem.id.toString() === targetElem)
		element.description = $('desc-' + targetElem).innerText;
		element.editMode = false;
		$('check-' + targetElem).removeAttribute("disabled");
		$('desc-' + targetElem).contentEditable = false;
		editimage.classList.remove("saveButtonImage");
		editimage.classList.add("editButtonImage");
		editimage.setAttribute("src", './images/edit.png')
		menu.classList.remove("hidden");
		save.classList.add("hidden");
		saveToLocalStorage();
		setTimeout(() => { $("new-note-input").focus() }, 200)
	}
	save.addEventListener("click", saveEditedContent);
	saveImage.addEventListener("click", saveEditedContent);

	let deletionButton = $("delete-" + toDoList[toDoList.length - 1].id)
	deletionButton.addEventListener("click", showDeletionModal);

	function cancelAction() {
		$("overlay").classList.remove("flexDisplay");
		$("floatDiv").classList.remove("floatDiv");
		$("floatButton").classList.remove("hidden");
	}
	let cancel = $("cancel-" + toDoList[toDoList.length - 1].id)
	cancel.addEventListener("click", cancelAction);

	let checkBox = $("check-" + toDoList[toDoList.length - 1].id)
	let description = $("desc-" + toDoList[toDoList.length - 1].id)

	//cross-out on clicking description or checkbox
	checkBox.addEventListener("change", (e) => {
		let targetId = e.target.id.replace("check-", "")
		if (toDoList.find(element => {
			return element.id === targetId
		}).editMode === false) {
			toggleCheckedClass(targetId);
		}
	})

	description.addEventListener("click", function (e) {
		let targetId = e.target.id.replace("desc-", "")
		if (toDoList.find(element => {
			return element.id.toString() === targetId
		}).editMode === false) {
			checkBox.checked = checkBox.checked ? false : true;
			toggleCheckedClass(targetId);
		}
	})

	//Edit button functionalities
	let editItem = $("edit-" + toDoList[toDoList.length - 1].id);
	let editimage = $("editimage" + toDoList[toDoList.length - 1].id)
	function editContent(e) {
		e.stopPropagation();
		let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "").replace("alter-", "");
		if (toDoList.find(elem => elem.id.toString() === targetElem).editMode === false) {
			if ($('check-' + targetElem).checked === true) {
				$('desc-' + targetElem).classList.remove("checkboxChecked");
			}
			toDoList.find(elem => elem.id.toString() === targetElem).editMode = true;
			$('desc-' + targetElem).contentEditable = true;
			$('check-' + targetElem).setAttribute("disabled", "disabled");
			editimage.classList.add("saveButtonImage");
			editimage.classList.remove("editButtonImage");
			editimage.setAttribute("src", './images/save.png')
			menu.classList.add("hidden");
			save.classList.remove("hidden");
			save.classList.add("hide");
			$('desc-' + targetElem).focus();
			let placeOfEdit = $('desc-' + targetElem)
			function placeCaretAtEnd(el) {
				el.focus();
				if (window.getSelection != "undefined"
					&& document.createRange != "undefined") {
					var range = document.createRange();
					range.selectNodeContents(el);
					range.collapse(false);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (document.body.createTextRange != "undefined") {
					var textRange = document.body.createTextRange();
					textRange.moveToElementText(el);
					textRange.collapse(false);
					textRange.select();
				}
			}

			placeCaretAtEnd(placeOfEdit);
			$("overlay").classList.remove("flexDisplay");
			$("floatDiv").classList.remove("floatDiv");
			$("floatButton").classList.remove("hidden");
		}
		else {
			if ($('check-' + targetElem).checked === true) {
				$('desc-' + targetElem).classList.add("checkboxChecked");
			}
			let element = toDoList.find(elem => elem.id.toString() === targetElem)
			element.description = $('desc-' + targetElem).innerText;
			element.editMode = false;
			$('check-' + targetElem).removeAttribute("disabled");
			$('desc-' + targetElem).contentEditable = false;
			editimage.classList.remove("saveButtonImage");
			editimage.classList.add("editButtonImage");
			editimage.setAttribute("src", './images/edit.png')
			menu.classList.remove("hidden");
			save.classList.add("hidden");
			saveToLocalStorage();
			setTimeout(() => { $("new-note-input").focus() }, 200)
		}
	}
	editItem.addEventListener("click", editContent)
	editimage.addEventListener("click", editContent)
	description.addEventListener("dblclick", editContent)
	description.addEventListener("keydown", (e) => {
		e.stopImmediatePropagation();
		if (e.code === "Enter") {
			editContent(e);
		}
	})

	//Remove button event
	let removedItem = $("remove-" + toDoList[toDoList.length - 1].id);
	let removeimage = $("removeimage" + toDoList[toDoList.length - 1].id);
	function showDeletionModal(e) {
		e.stopPropagation();
		$("overlay").classList.remove("flexDisplay");
		$("floatDiv").classList.remove("floatDiv");
		$("new-note-input").blur();
		$('removeModal').classList.add("emptyModalParent");
		let id = e.target.id.replace("removeimage", "").replace("remove-", "").replace("delete-", "");
		$('confirm').setAttribute("data-id", id)
	}
	removedItem.addEventListener("click", showDeletionModal);
	removeimage.addEventListener("click", showDeletionModal);

	saveToLocalStorage();

} //end of additem function



function deleteItem(e) {
	$("item" + e.target.dataset.id).remove();
	$("floatButton").classList.remove("hidden");
	$('removeModal').classList.remove("emptyModalParent");
	$("new-note-input").focus();
	toDoList = toDoList.filter(object => object.id !== e.target.dataset.id);
	saveToLocalStorage();
	if (toDoList.length === 0) {
		let emptyImage = "<figure id='emptyImage'><img src='./images/clipboard.svg' class='empty'><figcaption>Nothing here. Add tasks to view here.</figcaption></figure>";
		$("list-items").insertAdjacentHTML('afterbegin', emptyImage);
		$("list-items").classList.add("add-empty-image");
		$("searchText").classList.add("hidden");
	}
}

//focus on load and submission of input on enter And adding event to modal button and parent
window.addEventListener("load", function (e) {
	$("input-area").addEventListener("submit", e => {
		$("new-note-input").focus();
		e.preventDefault();
		addToDoItem();
		$("floatDiv").classList.remove("floatDiv");
		$("floatButton").classList.remove("hidden");
		$("input-area").classList.remove("flexDisplay");
	});
	$("new-note-input").focus();

	let closeButton = $('close');
	let removeModalParent = $('removeModal')
	let confirmButton = $('confirm');
	$('popup').addEventListener("click", (e) => { e.stopPropagation(); })
	confirmButton.addEventListener("click", deleteItem);

	closeButton.addEventListener("click", function () {
		removeModalParent.classList.remove("emptyModalParent");
		$("new-note-input").focus();
	})

	removeModalParent.addEventListener("click", function (e) {
		removeModalParent.classList.remove("emptyModalParent");
		$("new-note-input").focus();
	});
	$("searchText").classList.add("hidden");
	//getting the toDoList from local storage 
	let listReceived = JSON.parse(localStorage.getItem("listSaved"));
	if (!listReceived) {
		listReceived = [];
	}
	if (listReceived.length === 0) {
		let emptyImage = "<figure id='emptyImage'><img src='./images/clipboard.svg' class='empty'><figcaption>Nothing here. Add tasks to view here.</figcaption></figure>";
		$("list-items").insertAdjacentHTML('afterbegin', emptyImage);
		$("list-items").classList.add("add-empty-image");
	}
	if (listReceived) {
		for (let i = 0; i < listReceived.length; i++) {
			$("searchText").classList.remove("hidden");
			addToDoItem(listReceived[i]);
		}
	}

	//error message on closing tab while editing
	window.onbeforeunload = () => {
		let confirmationMessage = 'Are you sure you want to leave?';
		if (($("new-note-input").value.trim() !== "") || toDoList.some((el) => { return el.editMode })) {
			return confirmationMessage;
		}
	}
	$("clear-search").classList.add("hidden");
});//end of event on load

// function to close modal
function closeModal() {
	$("emptyModalParent").classList.remove("emptyModalParent");
	$("new-note-input").focus();
}
window.closeModal = closeModal;
function saveToLocalStorage() {
	let arrayToSave = toDoList.map(item => {
		return { id: item.id, description: item.description, taskCompleted: item.taskCompleted, date: item.date };
	})
	let stringToSave = JSON.stringify(arrayToSave);
	localStorage.setItem("listSaved", stringToSave);
}
//checkbox functionalities and marking it as complete in list

function toggleCheckedClass(targetId) {
	let checkBox = $("check-" + targetId)
	let description = $("desc-" + targetId)
	if (checkBox.checked)
		description.classList.add("checkboxChecked");
	else
		description.classList.remove("checkboxChecked");
	toDoList.find(element => element.id === targetId).taskCompleted = checkBox.checked;
	saveToLocalStorage();
}
//Search result printing
function searchResultPrint(searchResult) {
	let result = "";
	if (searchResult.length === 0) {
		let emptyS = "<figure id='emptySearch'><img class='empty' src='./images/emptySearch.svg'><figcaption>No results found...</figcaption></figure>";
		$("list-items").insertAdjacentHTML('afterbegin', emptyS);
		$("list-items").classList.add("add-empty-image");
	}
	else {
		let emptySearch = $("emptySearch");
		if (emptySearch) {
			emptySearch.remove();
			$("list-items").classList.remove("add-empty-image");
			$("searchText").classList.remove("hidden");
		}
	}
	for (let eachObj = 0; eachObj < searchResult.length; eachObj++) {
		let result = "<li id='item" + searchResult[eachObj].id + "' ><div class='list-content'>" +
			"<input " + (searchResult[eachObj].taskCompleted ? "checked" : "") + " type='checkbox' class='checkbox' id='check-" + searchResult[eachObj].id + "'>" +
			"<span class='descriptionAndDate'><span id = 'desc-" + searchResult[eachObj].id + "' class='description " + (searchResult[eachObj].taskCompleted ? "checkboxChecked" : "") + "'>" + searchResult[eachObj].description + "</span>" +
			"<div class='descriptionDate'>" + searchResult[eachObj].date + "</div></span>" +
			"</div>" +
			"<button class='saveButton hidden' id='save-" + searchResult[eachObj].id + "'>" + "<img class='saveImage' id='saveImage-" + searchResult[eachObj].id + "' src='./images/save.png'>" + "</button>" +
			"<div class='dropdown'>" +
			"<a id='menu-" + searchResult[eachObj].id + "'>" + "<img class='dotmenu' id='dotmenu-" + searchResult[eachObj].id + "' src='./images/dotmenu.svg'>" + "</a>" +
			"</div>" +
			"<div class='overlay' id='overlay'>" +
			"<button id='alter-" + searchResult[eachObj].id + "' class='alter-button'>" + "Edit" + "</button>" +
			"<button id='delete-" + searchResult[eachObj].id + "' class='delete-button'>" + "Delete" + "</button>" +
			"<button id='cancel-" + searchResult[eachObj].id + "' class='cancel-button'>" + "Cancel" + "</button>" +
			"</div>" +
			"<div class='buttons'>" +
			"<button id='edit-" + searchResult[eachObj].id + "' class='edit-button'><img class='editButtonImage' id='editimage" + searchResult[eachObj].id + "' src='./images/edit.png'></button>" +
			"<button id='remove-" + searchResult[eachObj].id + "' class='remove-button'><img id='removeimage" + searchResult[eachObj].id + "' src='./images/icons8-trash-can-50.png'></button>" +
			"</div></li>";
		$("printing-list").insertAdjacentHTML('afterbegin', result);

		let menu = $("menu-" + searchResult[eachObj].id);
		let dotMenu = $("dotmenu-" + searchResult[eachObj].id);
		function displayButtons(e) {
			e.stopPropagation();
			$("overlay").classList.add("flexDisplay");
			$("floatDiv").classList.add("floatDiv");
			$("floatButton").classList.add("hidden");
		}
		menu.addEventListener("click", displayButtons);
		dotMenu.addEventListener("click", displayButtons);

		let alterButton = $("alter-" + searchResult[eachObj].id)
		alterButton.addEventListener("click", editContent);

		let save = $("save-" + searchResult[eachObj].id);
		let saveImage = $("saveImage-" + searchResult[eachObj].id);
		function saveEditedContent(e) {
			e.stopPropagation();
			let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "").replace("alter-", "").replace("save-", "").replace("saveImage-", "");
			let element = toDoList.find(elem => elem.id.toString() === targetElem)
			element.description = $('desc-' + targetElem).innerText;
			element.editMode = false;
			$('check-' + targetElem).removeAttribute("disabled");
			$('desc-' + targetElem).contentEditable = false;
			editimage.classList.remove("saveButtonImage");
			editimage.classList.add("editButtonImage");
			editimage.setAttribute("src", './images/edit.png')
			menu.classList.remove("hidden");
			save.classList.add("hidden");
			saveToLocalStorage();
			setTimeout(() => { $("new-note-input").focus() }, 200)
		}
		save.addEventListener("click", saveEditedContent);
		saveImage.addEventListener("click", saveEditedContent);

		let deletionButton = $("delete-" + searchResult[eachObj].id)
		deletionButton.addEventListener("click", showDeletionModal);

		function cancelAction() {
			$("overlay").classList.remove("flexDisplay");
			$("floatDiv").classList.remove("floatDiv");
			$("floatButton").classList.remove("hidden");
		}
		let cancel = $("cancel-" + searchResult[eachObj].id)
		cancel.addEventListener("click", cancelAction);

		let checkBox = $("check-" + searchResult[eachObj].id)
		let description = $("desc-" + searchResult[eachObj].id)

		//cross-out on clicking description or checkbox
		checkBox.addEventListener("change", (e) => {
			let targetId = e.target.id.replace("check-", "")
			if (toDoList.find(element => {
				return element.id.toString() === targetId
			}).editMode === false) {
				toggleCheckedClass(targetId);
			}
		})

		description.addEventListener("click", function (e) {
			let targetId = e.target.id.replace("desc-", "")
			if (toDoList.find(element => {
				return element.id.toString() === targetId
			}).editMode === false) {
				checkBox.checked = checkBox.checked ? false : true;
				toggleCheckedClass(targetId);
			}
		})

		//Edit button functionalities
		let editItem = $("edit-" + searchResult[eachObj].id);
		let editimage = $("editimage" + searchResult[eachObj].id)
		function editContent(e) {
			e.stopPropagation();
			let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "").replace("alter-", "");
			if (toDoList.find(elem => elem.id.toString() === targetElem).editMode === false) {
				if ($('check-' + targetElem).checked === true) {
					$('desc-' + targetElem).classList.remove("checkboxChecked");
				}
				toDoList.find(elem => elem.id.toString() === targetElem).editMode = true;
				$('desc-' + targetElem).contentEditable = true;
				$('check-' + targetElem).setAttribute("disabled", "disabled");
				editimage.classList.add("saveButtonImage");
				editimage.classList.remove("editButtonImage");
				editimage.setAttribute("src", './images/save.png')
				menu.classList.add("hidden");
				save.classList.remove("hidden");
				save.classList.add("hide");
				$('desc-' + targetElem).focus();
				let placeOfEdit = $('desc-' + targetElem)
				function placeCaretAtEnd(el) {
					el.focus();
					if (window.getSelection != "undefined"
						&& document.createRange != "undefined") {
						var range = document.createRange();
						range.selectNodeContents(el);
						range.collapse(false);
						var sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					} else if (document.body.createTextRange != "undefined") {
						var textRange = document.body.createTextRange();
						textRange.moveToElementText(el);
						textRange.collapse(false);
						textRange.select();
					}
				}

				placeCaretAtEnd(placeOfEdit);
				$("overlay").classList.remove("flexDisplay");
				$("floatDiv").classList.remove("floatDiv");
				$("floatButton").classList.remove("hidden");
			}
			else {
				if ($('check-' + targetElem).checked === true) {
					$('desc-' + targetElem).classList.add("checkboxChecked");
				}
				let element = toDoList.find(elem => elem.id.toString() === targetElem)
				element.description = $('desc-' + targetElem).innerText;
				element.editMode = false;
				$('check-' + targetElem).removeAttribute("disabled");
				$('desc-' + targetElem).contentEditable = false;
				editimage.classList.remove("saveButtonImage");
				editimage.classList.add("editButtonImage");
				editimage.setAttribute("src", './images/edit.png')
				menu.classList.add("hidden");
				save.classList.remove("hidden");
				saveToLocalStorage();
				setTimeout(() => { $("new-note-input").focus() }, 200)
			}
		}
		editItem.addEventListener("click", editContent)
		editimage.addEventListener("click", editContent)
		description.addEventListener("dblclick", editContent)
		description.addEventListener("keydown", (e) => {
			e.stopImmediatePropagation();
			if (e.code === "Enter") {
				editContent(e);
			}
		})

		//Remove button event
		let removedItem = $("remove-" + searchResult[eachObj].id);
		let removeimage = $("removeimage" + searchResult[eachObj].id);
		function showDeletionModal(e) {
			e.stopPropagation();
			$("overlay").classList.remove("flexDisplay");
			$("floatDiv").classList.remove("floatDiv");
			$("new-note-input").blur();
			$('removeModal').classList.add("emptyModalParent");
			let id = e.target.id.replace("removeimage", "").replace("remove-", "").replace("delete-", "");
			$('confirm').setAttribute("data-id", id)
		}
		removedItem.addEventListener("click", showDeletionModal);
		removeimage.addEventListener("click", showDeletionModal);
	}
}
//search event
let search = $("searchText");
function listSearch() {
	$("printing-list").innerHTML = "";
	let emptySearch = $("emptySearch");
	if (emptySearch) {
		emptySearch.remove();
		$("list-items").classList.remove("add-empty-image");
		$("searchText").classList.remove("hidden");
	}
	let searchItem = search.value.trim();
	if (searchItem)
		$("clear-search").classList.remove("hidden");
	else
		$("clear-search").classList.add("hidden");
	let searchItemLowercase = searchItem.toLowerCase();
	let searchResult = toDoList.filter(item => {
		return item.description.toLowerCase().indexOf(searchItemLowercase) > -1;
	})
	searchResultPrint(searchResult);
}
$("searchText").addEventListener("keyup", listSearch);
$("clear-search").addEventListener("click", () => {
	$("searchText").value = "";
	listSearch();
	search.focus();
	$("clear-search").classList.add("hidden");
});
function displayInputBar() {
	$("floatDiv").classList.add("floatDiv");
	$("floatButton").classList.add("hidden");
	$("input-area").classList.add("flexDisplay");
	$("new-note-input").focus();
}
function displayFab() {
	$("overlay").classList.remove("flexDisplay");
	$("floatDiv").classList.remove("floatDiv");
	$("floatButton").classList.remove("hidden");
	$("input-area").classList.remove("flexDisplay");
}
$("plus").addEventListener("click", displayInputBar)
$("floatButton").addEventListener("click", displayInputBar)
$("floatDiv").addEventListener("click", displayFab);
function $(id) {
	return document.getElementById(id);
}