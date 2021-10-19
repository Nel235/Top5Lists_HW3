import { React, useContext, useState } from "react";
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ editActive, setEditActive ] = useState(false);
    const [ text, setText ] = useState("");
    const [draggedTo, setDraggedTo] = useState(0);
    store.history = useHistory();

    function handleDragStart(event) {
        event.dataTransfer.setData("item", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        // UPDATE THE LIST
        if(sourceId!=targetId)
            store.addMoveItemTransaction(sourceId, targetId);
        else
            store.updateCurrentList();    
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = props.text;
            if(id!=event.target.value)
                store.addChangeItemTransaction(id, event.target.value);
            else
                store.updateCurrentList();
            toggleEdit();
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value );
    }

    let { index} = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }
    let cardStatus = false;
    if (editActive) {
        cardStatus = true;
    }
    if (editActive) {
        return(
            <input
                id={"item-" + (index+1)}
                className='list-card'
                type='text'
                autoFocus
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                onBlur={toggleEdit}
                defaultValue={props.text}
            />
            )
    }
    return (
        <div
            id={'item-' + (index + 1)}
            className={itemClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            <input
                type="button"
                disabled={cardStatus}
                id={"edit-item-" + index + 1}
                className="list-card-button"
                onClick = {handleToggleEdit}
                value={"\u270E"}
            />
            {props.text}
        </div>)
}

export default Top5Item;