import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
let list = [];

//Function to add item to to-do list
function list_additem(listItem) {
	if (listItem === undefined) {
		let input = _("input_notes");
		let date = new Date(Date.now()).toLocaleDateString();
		let emptyModalParent = _('emptyModalParent')

		//modal display on empty input
		if (input.value.trim() === "") {
			emptyModalParent.classList.add("emptyModalParent");
			_("input_notes").blur();
			_('modal').addEventListener("click", (e) => { e.stopPropagation(); })
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
	if (list.length === 1) {
		let emptyImage = _("emptyImage");
		if (emptyImage) {
			emptyImage.remove();
			_("list_items").classList.remove("addEmptyImage");
			_("searchText").classList.remove("noshow");
		}
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
	_("printing_list").insertAdjacentHTML('afterbegin', newItem);

	let checkBox = _("check-" + list[list.length - 1].id)
	let description = _("desc-" + list[list.length - 1].id)

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
	let editItem = _("edit-" + list[list.length - 1].id);
	let editimage = _("editimage" + list[list.length - 1].id)
	function editContent(e) {
		e.stopPropagation();
		let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "")
		if (list.find(elem => elem.id.toString() === targetElem).editMode === false) {
			if (_('check-' + targetElem).checked === true) {
				_('desc-' + targetElem).classList.remove("checkboxChecked");
			}
			list.find(elem => elem.id.toString() === targetElem).editMode = true;
			_('desc-' + targetElem).contentEditable = true;
			_('check-' + targetElem).setAttribute("disabled", "disabled");
			editimage.classList.add("saveButtonImage");
			editimage.classList.remove("editButtonImage");
			editimage.setAttribute("src", './images/save.png')
			_('desc-' + targetElem).focus();
			let placeOfEdit = _('desc-' + targetElem)
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
			if (_('check-' + targetElem).checked === true) {
				_('desc-' + targetElem).classList.add("checkboxChecked");
			}
			list.find(elem => elem.id.toString() === targetElem).description = _('desc-' + targetElem).innerText;
			list.find(elem => elem.id.toString() === targetElem).editMode = false;
			_('check-' + targetElem).removeAttribute("disabled");
			_('desc-' + targetElem).contentEditable = false;
			editimage.classList.remove("saveButtonImage");
			editimage.classList.add("editButtonImage");
			editimage.setAttribute("src", './images/edit.png')
			storeLocal();
			setTimeout(() => { _("input_notes").focus() }, 200)
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
	let removedItem = _("remove-" + list[list.length - 1].id);
	let removeimage = _("removeimage" + list[list.length - 1].id);
	function showDeletionModal(e) {
		e.stopPropagation();
		_("input_notes").blur();
		_('removeModal').classList.add("emptyModalParent");
		let id = e.target.id.replace("removeimage", "").replace("remove-", "");
		_('confirm').setAttribute("data-id", id)
	}
	removedItem.addEventListener("click", showDeletionModal);
	removeimage.addEventListener("click", showDeletionModal);

	storeLocal();

} //end of additem function



function deleteItem(e) {
	_("item" + e.target.dataset.id).remove();
	_('removeModal').classList.remove("emptyModalParent");
	_("input_notes").focus();
	list = list.filter(object => object.id !== e.target.dataset.id);
	storeLocal();
	if (list.length === 0) {
		let emptyImage = "<figure id='emptyImage'><img src='./images/clipboard.svg'><figcaption>Nothing here. Add tasks to view here.</figcaption></figure>";
		_("list_items").insertAdjacentHTML('afterbegin', emptyImage);
		_("list_items").classList.add("addEmptyImage");
		_("searchText").classList.add("noshow");
	}
}

//focus on load and submission of input on enter And adding event to modal button and parent
window.addEventListener("load", function (e) {
	_("input_area").addEventListener("submit", e => {
		e.preventDefault();
		list_additem();
	});
	_("input_notes").focus();

	let closeButton = _('close');
	let removeModalParent = _('removeModal')
	let confirmButton = _('confirm');
	_('popup').addEventListener("click", (e) => { e.stopPropagation(); })
	confirmButton.addEventListener("click", deleteItem);

	closeButton.addEventListener("click", function () {
		removeModalParent.classList.remove("emptyModalParent");
		_("input_notes").focus();
	})

	removeModalParent.addEventListener("click", function (e) {
		removeModalParent.classList.remove("emptyModalParent");
		_("input_notes").focus();
	});
	_("searchText").classList.add("noshow");
	//getting the list from local storage 
	let listReceived = JSON.parse(localStorage.getItem("listSaved"));
	if (!listReceived) {
		listReceived = [];
	}
	if (listReceived.length === 0) {
		let emptyImage = "<figure id='emptyImage'><img src='./images/clipboard.svg'><figcaption>Nothing here. Add tasks to view here.</figcaption></figure>";
		_("list_items").insertAdjacentHTML('afterbegin', emptyImage);
		_("list_items").classList.add("addEmptyImage");
	}
	if (listReceived) {
		for (let i = 0; i < listReceived.length; i++) {
			_("searchText").classList.remove("noshow");
			list_additem(listReceived[i]);
		}
	}

	//error message on closing tab while editing
	window.onbeforeunload = () => {
		let confirmationMessage = 'Are you sure you want to leave?';
		if ((_("input_notes").value.trim() !== "") || list.some((el) => { return el.editMode })) {
			return confirmationMessage;
		}
	}
	_("x").classList.add("noshow");
});//end of event on load

// function to close modal
function close_modal() {
	_("emptyModalParent").classList.remove("emptyModalParent");
	_("input_notes").focus();
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
	let checkBox = _("check-" + targetId)
	let description = _("desc-" + targetId)
	if (checkBox.checked)
		description.classList.add("checkboxChecked");
	else
		description.classList.remove("checkboxChecked");
	list.find(element => {
		return element.id.toString() === targetId
	}).taskCompleted = checkBox.checked;
	storeLocal();
}
//Search result printing
function searchResultPrint(searchResult) {
	let result = "";
	if (searchResult.length === 0) {
		let emptyS = "<figure id='emptySearch'><img src='./images/emptySearch.svg'><figcaption>No results found...</figcaption></figure>";
		_("list_items").insertAdjacentHTML('afterbegin', emptyS);
		_("list_items").classList.add("addEmptyImage");
	}
	else {
		let emptySearch = _("emptySearch");
		if (emptySearch) {
			emptySearch.remove();
			_("list_items").classList.remove("addEmptyImage");
			_("searchText").classList.remove("noshow");
		}
	}
	for (let eachObj = 0; eachObj < searchResult.length; eachObj++) {
		let result = "<li id='item" + searchResult[eachObj].id + "' ><div class='list_content'>" +
			"<input " + (searchResult[eachObj].taskCompleted ? "checked" : "") + " type='checkbox' class='checkbox' id='check-" + searchResult[eachObj].id + "'>" +
			"<span class='descriptionAndDate'><span id = 'desc-" + searchResult[eachObj].id + "' class='description " + (searchResult[eachObj].taskCompleted ? "checkboxChecked" : "") + "'>" + searchResult[eachObj].description + "</span>" +
			"<div class='descriptionDate'>" + searchResult[eachObj].date + "</div></span>" +
			"</div>" +
			"<div class='buttons'>" +
			"<button id='edit-" + searchResult[eachObj].id + "' class='edit_button'><img class='editButtonImage' id='editimage" + searchResult[eachObj].id + "' src='./images/edit.png'></button>" +
			"<button id='remove-" + searchResult[eachObj].id + "' class='remove_button'><img id='removeimage" + searchResult[eachObj].id + "' src='./images/icons8-trash-can-50.png'></button>" +
			"</div></li>";
		_("printing_list").insertAdjacentHTML('afterbegin', result);

		let checkBox = _("check-" + searchResult[eachObj].id)
		let description = _("desc-" + searchResult[eachObj].id)

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
		let editItem = _("edit-" + searchResult[eachObj].id);
		let editimage = _("editimage" + searchResult[eachObj].id)
		function editContent(e) {
			e.stopPropagation();
			let targetElem = e.target.id.replace("editimage", "").replace("edit-", "").replace("description", "").replace("desc-", "")
			if (list.find(elem => elem.id.toString() === targetElem).editMode === false) {
				if (_('check-' + targetElem).checked === true) {
					_('desc-' + targetElem).classList.remove("checkboxChecked");
				}
				list.find(elem => elem.id.toString() === targetElem).editMode = true;
				_('desc-' + targetElem).contentEditable = true;
				_('check-' + targetElem).setAttribute("disabled", "disabled");
				editimage.classList.add("saveButtonImage");
				editimage.classList.remove("editButtonImage");
				editimage.setAttribute("src", './images/save.png')
				_('desc-' + targetElem).focus();
				let placeOfEdit = _('desc-' + targetElem)
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
				if (_('check-' + targetElem).checked === true) {
					_('desc-' + targetElem).classList.add("checkboxChecked");
				}
				list.find(elem => elem.id.toString() === targetElem).description = _('desc-' + targetElem).innerText;
				list.find(elem => elem.id.toString() === targetElem).editMode = false;
				_('check-' + targetElem).removeAttribute("disabled");
				_('desc-' + targetElem).contentEditable = false;
				editimage.classList.remove("saveButtonImage");
				editimage.classList.add("editButtonImage");
				editimage.setAttribute("src", './images/edit.png')
				storeLocal();
				setTimeout(() => { _("input_notes").focus() }, 200)
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
		let removedItem = _("remove-" + searchResult[eachObj].id);
		let removeimage = _("removeimage" + searchResult[eachObj].id);
		function showDeletionModal(e) {
			e.stopPropagation();
			_("input_notes").blur();
			_('removeModal').classList.add("emptyModalParent");
			let id = e.target.id.replace("removeimage", "").replace("remove-", "");
			_('confirm').setAttribute("data-id", id)
		}
		removedItem.addEventListener("click", showDeletionModal);
		removeimage.addEventListener("click", showDeletionModal);
	}
}
//search event
let search = _("searchText");
function listSearch() {
	_("printing_list").innerHTML = "";
	let emptySearch = _("emptySearch");
	if (emptySearch) {
		emptySearch.remove();
		_("list_items").classList.remove("addEmptyImage");
		_("searchText").classList.remove("noshow");
	}
	let searchItem = search.value;
	if (searchItem)
		_("x").classList.remove("noshow");
	else
		_("x").classList.add("noshow");
	let searchItemLowercase = searchItem.toLowerCase();
	let searchResult = list.filter(item => {
		return item.description.toLowerCase().indexOf(searchItemLowercase) > -1;
	})
	searchResultPrint(searchResult);
}
_("searchText").addEventListener("keyup", listSearch);
_("x").addEventListener("click", () => {
	_("searchText").value = "";
	_("printing_list").innerHTML = "";
	_("x").classList.add("noshow");
	_("input_notes").focus();
});
function _(id) {
	return document.getElementById(id);
}