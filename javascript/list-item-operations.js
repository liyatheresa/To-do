import { $, newItemInput, toDoList, setToDoList, listItems } from './script.js';
import { placeCaretAtEnd } from "./util.js";

const deleteItem = (e) => {
    $("item-" + e.target.dataset.id).remove();
    newItemInput.focus();
    setToDoList(toDoList.filter(object => object.id !== e.target.dataset.id));
    saveItemsToLocalStorage();
    if (toDoList.length === 0) {
        let emptyImage = $('empty-image-template').content.cloneNode(true)
        listItems.append(emptyImage);
        listItems.classList.add("add-empty-image");
        $("search-text").classList.add("hidden");
        $("image-inside-searchbar").classList.add("hidden");
    }
}

const setEditMode = (targetId, isEditModeOn) => {
    if (isEditModeOn) {
        if ($('check-' + targetId).checked) {
            $('desc-' + targetId).classList.remove("strike-through");
        }

        toDoList.find(elem => elem.id === targetId).editMode = true;

        $('menu-' + targetId).classList.add("hidden");
        $('desc-' + targetId).contentEditable = true;
        $('check-' + targetId).setAttribute("disabled", "disabled");

        $('desc-' + targetId).focus();
        placeCaretAtEnd($('desc-' + targetId));
    }
    else {
        if ($('check-' + targetId).checked) {
            $('desc-' + targetId).classList.add("strike-through");
        }

        let toDoItem = toDoList.find(elem => elem.id === targetId)
        toDoItem.description = $('desc-' + targetId).innerText;
        toDoItem.editMode = false;

        $('menu-' + targetId).classList.remove("hidden");
        $('desc-' + targetId).contentEditable = false;
        $('check-' + targetId).removeAttribute("disabled");
    }
}

const toggleSaveEditIcon = (targetId) => {
    $('edit-or-save-' + targetId).classList.toggle("fa-pencil");
    $('edit-or-save-' + targetId).classList.toggle("fa-floppy-o");
}

const saveItemsToLocalStorage = () => {
    let arrayToSave = toDoList.map(item => ({ id: item.id, description: item.description, taskCompleted: item.taskCompleted, date: item.date }));
    let stringToSave = JSON.stringify(arrayToSave);
    localStorage.setItem("listSaved", stringToSave);
}

export { deleteItem, setEditMode, saveItemsToLocalStorage, toggleSaveEditIcon };
