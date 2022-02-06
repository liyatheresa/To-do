import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
import { closeBottomDrawer, showDeletionModal, showEmptyInputModal, showBottomDrawer } from './modal-operations.js';
import { toggleSaveEditIcon, setEditMode, saveItemsToLocalStorage } from './list-item-operations.js';
import { placeCaretAtEnd } from './util.js';

let toDoList = [];
let newItemInput;

const $ = id => document.getElementById(id);
const setToDoList = list => toDoList = list;
let searchInput = $("search-text");
const validateInput = () => {
	//modal display on empty input
	if (newItemInput.value.trim() === "") {
		showEmptyInputModal();
		return false;
	}
	else {
		return true;
	}
}
//Function to add item to to-do list
const addToDoItem = (toDoItem) => {
	if (!toDoItem) {
		let date = new Date().toLocaleDateString();

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
		let emptyImage = $("empty-image");
		if (emptyImage) {
			emptyImage.remove();
			$("list-items").classList.remove("add-empty-image");
			$("search-text").classList.remove("hidden");
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
		if (toDoList.find(element => element.id === targetId).editMode === false) {
			toggleCheckedClass(targetId);
		}
	})

	description.addEventListener("click", (e) => {
		let targetId = e.target.id.replace("desc-", "")
		if (toDoList.find(element => element.id.toString() === targetId).editMode === false) {
			checkBox.checked = checkBox.checked ? false : true;
			toggleCheckedClass(targetId);
		}
	})

	//Edit button functionalities
	const editOrSave = (targetId) => {
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
	}
	let editOrSaveItemButton = $("edit-or-save-" + toDoList[toDoList.length - 1].id);
	editOrSaveItemButton.addEventListener("click", e => {
		let targetId = e.target.id.replace("edit-or-save-", "");
		toggleSaveEditIcon(targetId);
		editOrSave(targetId);
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


	description.addEventListener("dblclick", (e) => {
		let targetId = e.target.id.replace("desc-", "");
		toggleSaveEditIcon(targetId);
		$("mobile-save-" + targetId).classList.remove("hidden");
		editOrSave(targetId)
	})
	description.addEventListener("keydown", (e) => {
		let targetId = e.target.id.replace("desc-", "");
		if (e.code === "Enter") {
			toggleSaveEditIcon(targetId);
			editOrSave(targetId)
			$("mobile-save-" + targetId).classList.add("hidden");
		}
	})

	//Remove button event
	let deletionButton = $("remove-" + toDoList[toDoList.length - 1].id);
	deletionButton.addEventListener("click", showDeletionModal);
	saveItemsToLocalStorage();
} //end of additem function

//focus on load and submission of input on enter And adding event to modal button and parent
window.addEventListener("load", () => {
	newItemInput = $("new-note-input");
	$("input-area").addEventListener("submit", e => {
		newItemInput.focus();
		e.preventDefault();
		displayFab();
		if (validateInput()) addToDoItem();
	});
	newItemInput.focus();


	$("search-text").classList.add("hidden");
	//getting the toDoList from local storage 
	// let listReceived = JSON.parse(localStorage.getItem("listSaved"));
	// if (!listReceived) {
	// 	listReceived = [];
	// }
	let listReceived = JSON.parse(localStorage.getItem("listSaved")) ?? [];
	if (listReceived.length === 0) {
		let emptyImage = "<figure id='empty-image'><img src='./images/clipboard.svg' class='empty'><figcaption>Nothing here. Add tasks to view here.</figcaption></figure>";
		$("list-items").insertAdjacentHTML('afterbegin', emptyImage);
		$("list-items").classList.add("add-empty-image");
	}
	if (listReceived) {
		for (let i = 0; i < listReceived.length; i++) {
			$("search-text").classList.remove("hidden");
			addToDoItem(listReceived[i]);
		}
	}

	//error message on closing tab while editing
	window.onbeforeunload = () => {
		let confirmationMessage = 'Are you sure you want to leave?';
		if ((newItemInput.value.trim() !== "") || toDoList.some((el) => el.editMode)) {
			return confirmationMessage;
		}
	}

	$("float-button").addEventListener("click", displayInputBar)
	$("floating-button-overlay").addEventListener("click", displayFab);
});//end of event on load

//checkbox functionalities and marking it as complete in list
const toggleCheckedClass = (targetId) => {
	let checkBox = $("check-" + targetId)
	let description = $("desc-" + targetId)
	description.classList.toggle("strike-through", checkBox.checked);
	toDoList.find(element => element.id === targetId).taskCompleted = checkBox.checked;
	saveItemsToLocalStorage();
}

$("clear-search").addEventListener("click", () => {
	searchInput.value = ""
	searchInput.dispatchEvent(new Event('input'));
	$("clear-search").classList.add("hidden");
});

searchInput.addEventListener("input", e => {
	let count = 0;
	let textToBeSearched = e.target.value.trim().toLowerCase();
	$("clear-search").classList.toggle("hidden", !textToBeSearched);

	toDoList.forEach(item => {
		const isVisible = item.description.toLowerCase().includes(textToBeSearched);
		$('item-' + item.id).classList.toggle("hidden", !isVisible);
		if (isVisible) {
			count++;
		}
	})

	let noResultsFoundImage = $("noResultsFoundImage");
	if (count === 0 && !noResultsFoundImage) {
		let noResultsFoundImageHtml = "<figure id='noResultsFoundImage'><img class='empty' src='./images/emptySearch.svg'><figcaption>No results found...</figcaption></figure>";
		$("list-items").insertAdjacentHTML('afterbegin', noResultsFoundImageHtml);
		$("list-items").classList.add("add-empty-image");
	}
	else if (count > 0 && noResultsFoundImage) {
		noResultsFoundImage.remove();
		$("list-items").classList.remove("add-empty-image");
	}
});
const displayInputBar = () => {
	$("floating-button-overlay").classList.add("modal-backdrop");
	$("float-button").classList.add("hidden");
	$("input-area").classList.add("flex");
	newItemInput.focus();
}
const displayFab = () => {
	$("overlay").classList.remove("flex");
	$("floating-button-overlay").classList.remove("modal-backdrop");
	$("float-button").classList.remove("hidden");
	$("input-area").classList.remove("flex");
}

export { $, newItemInput, toDoList, setToDoList, saveItemsToLocalStorage };
