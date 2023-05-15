import React, { useState, useEffect } from 'react';

function TagDropdown({ task, tags, setTags, selectedTags, setSelectedTags, deleteTag }) {
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [showEditTagDropdown, setShowEditTagDropdown] = useState(false);
    const [clickedTag, setClickedTag] = useState(null);
    const [editedTagName, setEditedTagName] = useState("");
    const [hasChanges, setHasChanges] = useState(false);


    const handleAddTagClick = () => {
        setShowTagDropdown(!showTagDropdown);
    };

    const handleTagSelection = (tag) => {
        if (selectedTags.includes(tag.tag_id.toString())) {
            setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag.tag_id.toString()));
        } else {
            setSelectedTags([...selectedTags, tag.tag_id.toString()]);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = (e) => {
        if (!e.target.closest(".dropdown") && !e.target.closest(".dropdown-tags")) {
            setShowTagDropdown(false);
        }
    };

    const handleEditTagDropdown = (tag) => {
        setClickedTag(tag);
        setEditedTagName(tag.tag_name);

        setShowTagDropdown(false);
        setShowEditTagDropdown(!showEditTagDropdown);
    };

    function handleConfirmEdit() {
        console.log(clickedTag)

        if (!hasChanges) {
            return;
        }
        if (editedTagName.trim() === "") {
            alert("Priority name cannot be empty.");
            return;
        }

        setClickedTag(null);
        setEditedTagName("");
        setHasChanges(false);
        
        setShowEditTagDropdown(false);
    }

    const handleGoBackClick = () => {
        setHasChanges(false);
        setEditedTagName("");

        setShowEditTagDropdown(false);
        setShowTagDropdown(true);
    };

    const handleDeleteTag = async (tagId) => {
        try {
            await deleteTag(tagId);
            setTags(tags.filter((tag) => tag.tag_id !== tagId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="dropdown">
            {showTagDropdown && (
                <div className="dropdown-tags">
                    <div className="dropdown-header">
                        <div className="dropdown-title">
                            <p>Tags</p>
                        </div>
                        <div className="dropdown-close">
                            <span className="material-symbols-outlined" onClick={() => setShowTagDropdown(false)}>close</span>
                        </div>
                    </div>
                    <hr />
                    <ul>
                        {tags.map((tag) => (
                            <li key={tag.tag_id}>
                                <label>
                                    <input type="checkbox" checked={selectedTags.includes(tag.tag_id.toString())} onChange={() => handleTagSelection(tag)} />
                                    <span className="tag" style={{ background: tag.tag_color }}>{tag.tag_name}</span>
                                </label>
                                <div className="tag-actions">
                                    <span className="material-symbols-outlined delete-trashcan" onClick={() => handleDeleteTag(tag.tag_id)}>delete</span>
                                    <span className="material-symbols-outlined edit" onClick={() => handleEditTagDropdown(tag)}>edit</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="new-tag-button">
                        <button type="button" className="add-new-tag">Add Tag</button>
                    </div>
                </div>
            )}
            {showEditTagDropdown && (
                <div className="dropdown-tags">
                    <div className="header-container">
                        <div className="arrow-back">
                            <span className="material-symbols-outlined" onClick={handleGoBackClick}>arrow_back</span>
                        </div>
                        <div className="dropdown-title-edit">
                            <p>Edit Tag</p>
                        </div>
                        <div className="dropdown-close">
                            <span className="material-symbols-outlined" onClick={() => setShowEditTagDropdown(false)}>close</span>
                        </div>
                    </div>
                    <hr />
                    {clickedTag && (
                        <div className="edit-tag">
                            <span className="priority" style={{ background: clickedTag.tag_color }}>
                                {clickedTag.tag_name}
                            </span>
                        </div>
                    )}
                    <label>Title
                        <input
                            type="text"
                            value={editedTagName}
                            onChange={(e) => {
                                setEditedTagName(e.target.value);
                                setHasChanges(true);
                                if (clickedTag) {
                                    const newTag = { ...clickedTag, tag_name: e.target.value };
                                    setClickedTag(newTag);
                                }
                            }}
                        />
                    </label>
                    <div className="dropdown-edit-buttons">
                        <div>
                            <button type="button" onClick={handleConfirmEdit}>Save</button>
                        </div>
                        <div className="cancel-btn">
                            <button type="button" onClick={handleGoBackClick}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="add-tags">
                {selectedTags.length > 0 && (
                    <div className="selected-tags">
                        <div className="tags">
                            {selectedTags.map((selectedTag) => {
                                const tag = tags.find((tag) => tag.tag_id.toString() === selectedTag);
                                return (
                                    <span className="tag" key={tag.tag_id} style={{ background: tag.tag_color }}>{tag.tag_name}</span>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className="tagDrop-btn">
                    <span className="material-symbols-outlined" onClick={handleAddTagClick}>add</span>
                </div>
            </div>
        </div>
    );
}

export default TagDropdown;