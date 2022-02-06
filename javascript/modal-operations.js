import { $, newItemInput, toDoList } from './script.js';
import { deleteItem, setEditMode } from './list-item-operations.js';

window.addEventListener("load", () => {
    //Deletion Modal
    let deletionModal = $('deletion-modal');
    deletionModal.addEventListener("click", closeDeletionModal);

    let closeDeletionModalButton = $('close-deletion-modal-button');
    closeDeletionModalButton.addEventListener("click", closeDeletionModal)

    let confirmDeletionButton = $('confirm-deletion-button');
    confirmDeletionButton.addEventListener("click", (e) => {
        $("float-button").classList.remove("hidden");
        deleteItem(e);
        closeDeletionModal();
    });

    $('deletion-modal-content').addEventListener("click", e => e.stopPropagation())

    //Empty Input Modal
    let emptyInputModal = $('empty-input-modal')
    emptyInputModal.addEventListener("click", closeEmptyInputModal);
    $('empty-input-modal-content').addEventListener("click", e => e.stopPropagation());
    $('close-empty-input-modal-button').addEventListener("click", closeEmptyInputModal);

    //Bottom Drawer
    let mobileEditButton = $("mobile-edit-button")
    mobileEditButton.addEventListener("click", (e) => {
        let targetId = e.target.dataset.identifier;

        if (!toDoList.find(elem => elem.id === targetId).editMode) {
            //Switch to edit mode
            $("menu-" + targetId).classList.add("hidden");
            $("mobile-save-" + targetId).classList.remove("hidden");

            setEditMode(targetId, true);
            closeBottomDrawer();
        }
    });

    let mobileDeleteButton = $("mobile-delete-button");
    mobileDeleteButton.addEventListener("click", () => showDeletionModal({ target: { id: mobileDeleteButton.dataset.identifier } }));

    let cancelButton = $("bottom-drawer-cancel-button");
    cancelButton.addEventListener("click", closeBottomDrawer);
});

const showDeletionModal = (e) => {
    $("overlay").classList.remove("flex");
    $("floating-button-overlay").classList.remove("modal-backdrop");
    newItemInput.blur();
    $('deletion-modal').classList.remove("hidden");
    let id = e.target.id.replace("remove-", "");
    $('confirm-deletion-button').setAttribute("data-id", id)
}
const closeDeletionModal = () => {
    $('deletion-modal').classList.add("hidden");
    newItemInput.focus();
}

const showEmptyInputModal = () => {
    let emptyModalParent = $('empty-input-modal')
    emptyModalParent.classList.add("modal-backdrop");
    emptyModalParent.classList.remove("hidden");
    newItemInput.blur();
}
const closeEmptyInputModal = () => {
    let emptyModalParent = $('empty-input-modal')
    emptyModalParent.classList.remove("modal-backdrop");
    emptyModalParent.classList.add("hidden");
    newItemInput.focus();
}

const showBottomDrawer = (e) => {
    $("overlay").classList.add("flex");
    $("floating-button-overlay").classList.add("modal-backdrop");
    $("float-button").classList.add("hidden");

    let id = e.target.id.replace("menu-", "");
    $('mobile-edit-button').setAttribute("data-identifier", id)
    $('mobile-delete-button').setAttribute("data-identifier", id)
    $('bottom-drawer-cancel-button').setAttribute("data-identifier", id)
}
const closeBottomDrawer = () => {
    $("overlay").classList.remove("flex");
    $("floating-button-overlay").classList.remove("modal-backdrop");
    $("float-button").classList.remove("hidden");
}

export { closeBottomDrawer, showDeletionModal, showEmptyInputModal, showBottomDrawer };
