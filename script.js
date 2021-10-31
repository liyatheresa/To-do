let count = 0, itemNumber = 0;
let list = [];


//Function to add item to to-do list
function list_additem() {
	let input = document.getElementById("input_notes");
	let date = new Date(Date.now()).toLocaleDateString();
	let emptyModalParent= document.getElementById('emptyModalParent')

	//modal display on empty input
	if (input.value.trim() === "") {
		emptyModalParent.classList.add("modal_parent");
		document.getElementById("input_notes").blur();
		emptyModalParent.addEventListener("click",close_modal);
		return;
	}
	
	list.push({
		id: count++,
		description: input.value,
		taskCompleted: false
	});


	let newItem = "<li id='item" + list[itemNumber].id + "' ><div class='list_content'>" +
		"<input type='checkbox' class='checkbox' id='c" + list[itemNumber].id + "'>" +
		"<span class='descriptionAndDate'><span id = 'd" + list[itemNumber].id + "' class='description'>" + list[itemNumber].description + "</span>" +
		"<div class='descriptionDate'>" + date + "</div></span>" +
		"</div>" +
		"<div class='buttons'>" +
		"<button class='edit_button'><img src='./images/icons8-edit-24.png'></button>" +
		"<button id='r" + list[itemNumber].id + "' class='remove_button'><img src='./images/icons8-trash-can-50.png'></button>" +
		"</div></li>";

	document.getElementById("printing_list").insertAdjacentHTML('afterbegin', newItem);
	input.value = "";


	let checkBox = document.getElementById("c" + list[itemNumber].id)
	let description = document.getElementById("d" + list[itemNumber].id)

	//checkbox functionalities
	function toggleCheckedClass() {
		if (checkBox.checked) {
			description.classList.add("checkboxChecked");
		}
		else {
			description.classList.remove("checkboxChecked");
		}
	}

	checkBox.addEventListener("change", toggleCheckedClass)

	description.addEventListener("click", function () {
		checkBox.checked = checkBox.checked ? false : true;
		toggleCheckedClass();
	})

	//Remove button event
	let removedItem= document.getElementById("r" + list[itemNumber].id);
	let parent=document.getElementById("item" + list[itemNumber].id)
	let confirmButton=document.getElementById('confirm');
	let closeButton=document.getElementById('close');
	let removeModalParent= document.getElementById('removeModal')


	removedItem.addEventListener("click",function (){
		document.getElementById("input_notes").blur();
		removeModalParent.classList.add("modal_parent");

		removeModalParent.addEventListener("click",function (){
			removeModalParent.classList.remove("modal_parent");
			document.getElementById("input_notes").focus();
		});

		confirmButton.addEventListener("click",function (){
			removeModalParent.classList.remove("modal_parent");
			document.getElementById("input_notes").focus();
			parent.remove();
		})
		
		closeButton.addEventListener("click",function(){
			removeModalParent.classList.remove("modal_parent");
			document.getElementById("input_notes").focus();
		})
		
	})

	itemNumber++;
}


//focus on load and submission of input on enter
window.addEventListener("load", function (e) {
	document.getElementById("input_area").addEventListener("submit", e => {
		e.preventDefault();
		list_additem();
	});
	document.getElementById("input_notes").focus();
});

// function to close modal
function close_modal() {
	document.getElementById("emptyModalParent").classList.remove("modal_parent");
	document.getElementById("input_notes").focus();
}

