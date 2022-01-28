import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
import { closeBottomDrawer, showDeletionModal, showEmptyInputModal, showBottomDrawer } from './modal-operations.js';
import { toggleSaveEditIcon, setEditMode, saveItemsToLocalStorage } from './list-item-operations.js';
import { placeCaretAtEnd } from './util.js';

let toDoList = [];
let newItemInput;

const $ = id => document.getElementById(id);
const setToDoList = list => toDoList = list;

//Function to add item to to-do list
function addToDoItem(toDoItem) {
	if (!toDoItem) {
		let date = new Date().toLocaleDateString();

		//modal display on empty input
		if (newItemInput.value.trim() === "") {
			showEmptyInputModal();
			return;
		}

		toDoList.push({
			id: nanoid(),
			description: newItemInput.value.trim(),
			taskCompleted: false,
			date: date,
			editMode: false
		});
		newItemInput.value = "";
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
	let newItem = "<li id='item-" + toDoList[toDoList.length - 1].id + "' ><div class='list-content'>" +
		"<input " + (toDoList[toDoList.length - 1].taskCompleted ? "checked" : "") + " type='checkbox' class='checkbox' id='check-" + toDoList[toDoList.length - 1].id + "'>" +
		"<span class='descriptionAndDate'><span id = 'desc-" + toDoList[toDoList.length - 1].id + "' class='description " + (toDoList[toDoList.length - 1].taskCompleted ? "strike-through" : "") + "'>" + toDoList[toDoList.length - 1].description + "</span>" +
		"<div class='descriptionDate'>" + toDoList[toDoList.length - 1].date + "</div></span>" +
		"</div>" +
		"<div class='flex'>" +
		"<button id='mobile-save-" + toDoList[toDoList.length - 1].id + "' class='fa-light fa fa-floppy-o mobile-save-button hidden'></button>" +
		"<a id='menu-" + toDoList[toDoList.length - 1].id + "' class='fa-dark fa fa-ellipsis-v menu-button'></a>" +
		"</div>" +
		"<div class='buttons' id='buttons'>" +
		"<button id='edit-or-save-" + toDoList[toDoList.length - 1].id + "' class='edit-button fa-light fa fa-pencil'></button>" +
		"<button id='remove-" + toDoList[toDoList.length - 1].id + "' class='remove-button fa-light fa fa-trash-o'></button>" +
		"</div></li>";

	$("printing-list").insertAdjacentHTML('afterbegin', newItem);

	let menuButton = $("menu-" + toDoList[toDoList.length - 1].id);
	menuButton.addEventListener("click", showBottomDrawer);

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
	let editOrSaveItemButton = $("edit-or-save-" + toDoList[toDoList.length - 1].id);
	editOrSaveItemButton.addEventListener("click", e => {
		let targetId = e.target.id.replace("edit-or-save-", "");
		toggleSaveEditIcon(e.target);

		if (!toDoList.find(elem => elem.id === targetId).editMode) {
			//Switch to edit mode
			setEditMode(targetId, true);
		}
		else {
			//Exit edit mode
			setEditMode(targetId, false);
			saveItemsToLocalStorage();
			setTimeout(() => newItemInput.focus(), 100);
		}
	});

	let mobileSaveItemButton = $("mobile-save-" + toDoList[toDoList.length - 1].id);
	mobileSaveItemButton.addEventListener("click", e => {
		let targetId = e.target.id.replace("mobile-save-", "");

		$("menu-" + targetId).classList.remove("hidden");
		$("mobile-save-" + targetId).classList.add("hidden");

		setEditMode(targetId, false);
		saveItemsToLocalStorage();
		setTimeout(() => newItemInput.focus(), 100);
	});

	//TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	description.addEventListener("dblclick", (e) => {
		let targetId = e.target.id.replace("description", "").replace("desc-", "");
		editOrSaveItem(description, targetId, e)
	})
	description.addEventListener("keydown", (e) => {
		e.stopImmediatePropagation();
		let targetId = e.target.id.replace("description", "").replace("desc-", "");
		if (e.code === "Enter") {
			editOrSaveItem(description, targetId, e);
		}
	})

	//Remove button event
	let removedItem = $("remove-" + toDoList[toDoList.length - 1].id);
	removedItem.addEventListener("click", showDeletionModal);
	saveItemsToLocalStorage();
} //end of additem function

//focus on load and submission of input on enter And adding event to modal button and parent
window.addEventListener("load", () => {
	newItemInput = $("new-note-input");
	$("input-area").addEventListener("submit", e => {
		newItemInput.focus();
		e.preventDefault();
		addToDoItem();
		$("floatDiv").classList.remove("floatDiv");
		$("floatButton").classList.remove("hidden");
		$("input-area").classList.remove("flex");
	});
	newItemInput.focus();


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
		if ((newItemInput.value.trim() !== "") || toDoList.some((el) => { return el.editMode })) {
			return confirmationMessage;
		}
	}
	$("clear-search").classList.add("hidden");
});//end of event on load




//checkbox functionalities and marking it as complete in list

function toggleCheckedClass(targetId) {
	let checkBox = $("check-" + targetId)
	let description = $("desc-" + targetId)
	if (checkBox.checked)
		description.classList.add("strike-through");
	else
		description.classList.remove("strike-through");
	toDoList.find(element => element.id === targetId).taskCompleted = checkBox.checked;
	saveItemsToLocalStorage();
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
			"<span class='descriptionAndDate'><span id = 'desc-" + searchResult[eachObj].id + "' class='description " + (searchResult[eachObj].taskCompleted ? "strike-through" : "") + "'>" + searchResult[eachObj].description + "</span>" +
			"<div class='descriptionDate'>" + searchResult[eachObj].date + "</div></span>" +
			"</div>" +
			"<button class='saveButton hidden' id='save-" + searchResult[eachObj].id + "'>" + "<img class='saveImage' id='saveImage-" + searchResult[eachObj].id + "' src='./images/save.png'>" + "</button>" +
			"<div class='dropdown'>" +
			"<a id='menu-" + searchResult[eachObj].id + "'>" + "<img class='dotmenu' id='dotmenu-" + searchResult[eachObj].id + "' src='./images/dotmenu.svg'>" + "</a>" +
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
			$("overlay").classList.add("flex");
			$("floatDiv").classList.add("floatDiv");
			$("floatButton").classList.add("hidden");
			let id = e.target.id.replace("dotmenu-", "").replace("menu-", "");
			$('alter').setAttribute("data-itemId", id)
			$('delete').setAttribute("data-itemId", id)
			$('cancel').setAttribute("data-itemId", id)
		}
		menu.addEventListener("click", displayButtons);
		dotMenu.addEventListener("click", displayButtons);

		let alterButton = $("alter")
		alterButton.addEventListener("click", (e) => {
			let targetId = e.target.dataset.itemId;
			editOrSaveItem(alterButton, targetId, e)
		});

		let save = $("save-" + searchResult[eachObj].id);
		let saveImage = $("saveImage-" + searchResult[eachObj].id);
		function saveEditedContent(e) {
			e.stopPropagation();
			let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "").replace("alter-", "").replace("save-", "").replace("saveImage-", "");
			if ($('check-' + targetElem).checked === true) {
				$('desc-' + targetElem).classList.add("strike-through");
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
			saveItemsToLocalStorage();
			setTimeout(() => { newItemInput.focus() }, 200)
		}
		save.addEventListener("click", saveEditedContent);
		saveImage.addEventListener("click", saveEditedContent);

		let deletionButton = $("delete")
		deletionButton.addEventListener("click", showDeletionModal);

		function cancelAction() {
			$("overlay").classList.remove("flex");
			$("floatDiv").classList.remove("floatDiv");
			$("floatButton").classList.remove("hidden");
		}
		let cancel = $("cancel")
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
		function editOrSaveItem(targetElem, e) {
			e.stopPropagation();
			// let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "").replace("alter-", "");
			if (!toDoList.find(elem => elem.id.toString() === targetElem).editMode) {
				if ($('check-' + targetElem).checked === true) {
					$('desc-' + targetElem).classList.remove("strike-through");
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
				placeCaretAtEnd(placeOfEdit);
				$("overlay").classList.remove("flex");
				$("floatDiv").classList.remove("floatDiv");
				$("floatButton").classList.remove("hidden");
			}
			else {
				if ($('check-' + targetElem).checked === true) {
					$('desc-' + targetElem).classList.add("strike-through");
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
				saveItemsToLocalStorage();
				setTimeout(() => { newItemInput.focus() }, 200)
			}
		}
		editItem.addEventListener("click", (e) => {
			let targetId = e.target.id.replace("editimage", "").replace("edit-", "");
			editOrSaveItem(targetId, e)
		})
		editimage.addEventListener("click", (e) => {
			let targetId = e.target.id.replace("editimage", "").replace("edit-", "");
			editOrSaveItem(targetId, e)
		})
		description.addEventListener("dblclick", (e) => {
			let targetId = e.target.id.replace("description", "").replace("desc-", "");
			editOrSaveItem(targetId, e)
		})
		description.addEventListener("keydown", (e) => {
			e.stopImmediatePropagation();
			let targetId = e.target.id.replace("description", "").replace("desc-", "");
			if (e.code === "Enter") {
				editOrSaveItem(targetId, e);
			}
		})

		//Remove button event
		let removedItem = $("remove-" + searchResult[eachObj].id);
		let removeimage = $("removeimage" + searchResult[eachObj].id);

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
	$("input-area").classList.add("flex");
	newItemInput.focus();
}
function displayFab() {
	$("overlay").classList.remove("flex");
	$("floatDiv").classList.remove("floatDiv");
	$("floatButton").classList.remove("hidden");
	$("input-area").classList.remove("flex");
}
$("plus").addEventListener("click", displayInputBar)
$("floatButton").addEventListener("click", displayInputBar)
$("floatDiv").addEventListener("click", displayFab);


export { $, newItemInput, toDoList, setToDoList, saveItemsToLocalStorage };