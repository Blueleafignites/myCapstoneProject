import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Renders a dropdown interface for managing tags. It allows users to add, edit, and delete tags.
function TagDropdown({ tags, setTags, selectedTags, setSelectedTags }) {
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [showAddTagDropdown, setShowAddTagDropdown] = useState(false);
    const [showEditTagDropdown, setShowEditTagDropdown] = useState(false);

    const [clickedTagTitle, setClickedTagTitle] = useState("");
    const [clickedTagColor, setClickedTagColor] = useState("");
    const [clickedTagId, setClickedTagId] = useState("");
    const [tagTitle, setTagTitle] = useState("");
    const [tagColor, setTagColor] = useState("");

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

    const handleAddNewTagDropdown = () => {
        setShowTagDropdown(false);
        setShowAddTagDropdown(!showAddTagDropdown);
    };

    // https://stackoverflow.com/questions/62570261/accept-hex-only-input
    const handleColorChange = (e) => {
        const colorHex = e.target.value;
        const formattedHex = colorHex.replace(/[^A-Fa-f0-9]/g, "");

        setTagColor("#" + formattedHex.slice(0, 6))
        setClickedTagColor("#" + formattedHex.slice(0, 6))
    };

    const handleAddTag = async () => {
        if (tagTitle.trim() === "") {
            alert("Tag name cannot be empty.");
            return;
        }

        if (tagColor.length !== 7) {
            alert("Hex code is not valid.");
            return;
        }

        const tagLimit = 10;
        const currentTagCount = tags.length;

        if (currentTagCount >= tagLimit) {
            alert("Cannot add more than 10 tags.");
            return;
        }

        const newTag = {
            tag_name: tagTitle.trim(),
            tag_color: tagColor,
        };

        try {
            const res = await axios.post('http://localhost:3000/tags', newTag);

            setShowAddTagDropdown(false);
            setShowTagDropdown(true);
            return res.data.tagId;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleEditTag = async (tagId) => {
        if (clickedTagTitle.trim() === "") {
            alert("Tag name cannot be empty.");
            return;
        }

        if (clickedTagColor.length !== 7) {
            alert("Hex code is not valid.");
            return;
        }

        const updatedTag = {
            tag_name: clickedTagTitle.trim(),
            tag_color: clickedTagColor,
        };

        try {
            const res = await axios.put(`http://localhost:3000/tags/${tagId}`, updatedTag);

            setShowEditTagDropdown(false);
            setShowTagDropdown(true);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleDeleteTag = async (tagId) => {
        try {
            const tagToDelete = tags.find((tag) => tag.tag_id === tagId);

            if (!tagToDelete) {
                console.error("Tag not found");
                return;
            }

            await axios.delete(`http://localhost:3000/tags/${tagId}`);
            setTags(tags.filter((tag) => tag.tag_id !== tagId));
            setSelectedTags(selectedTags.filter((tag) => tag !== tagId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditTagDropdown = (tag) => {
        setClickedTagTitle(tag.tag_name);
        setClickedTagColor(tag.tag_color)
        setClickedTagId(tag.tag_id)

        setShowTagDropdown(false);
        setShowEditTagDropdown(!showEditTagDropdown);
    };

    const handleGoBackClick = () => {
        setTagTitle("");
        setTagColor("");

        setShowAddTagDropdown(false);
        setShowEditTagDropdown(false);
        setShowTagDropdown(true);
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
                        <button type="button" className="add-new-tag" onClick={handleAddNewTagDropdown}>Add Tag</button>
                    </div>
                </div>
            )}
            {showAddTagDropdown && (
                <div className="dropdown-tags">
                    <div className="header-container">
                        <div className="arrow-back">
                            <span className="material-symbols-outlined" onClick={handleGoBackClick}>arrow_back</span>
                        </div>
                        <div className="dropdown-title-edit">
                            <p>Add Tag</p>
                        </div>
                        <div className="dropdown-close">
                            <span className="material-symbols-outlined" onClick={() => setShowAddTagDropdown(false)}>close</span>
                        </div>
                    </div>
                    <hr />

                    <div className="edit-tag">
                        <span className="priority" style={{ backgroundColor: tagColor }}>{tagTitle}</span>
                    </div>

                    <label className="edit-tag-name">
                        <span><b>Title</b></span>
                        <input className="label-input" type="text" value={tagTitle} onChange={(e) => setTagTitle(e.target.value)} placeholder="Enter a tag name..." />
                    </label>
                    <label>
                        <span><b>Color</b></span>
                        <input className="label-input" type="text" value={tagColor ? tagColor : "#"} onChange={handleColorChange} maxLength={7} placeholder="Enter a hex code..." />
                    </label>
                    <div className="dropdown-edit-buttons">
                        <div>
                            <button type="button" onClick={handleAddTag}>Save</button>
                        </div>
                        <div className="cancel-btn">
                            <button type="button" onClick={handleGoBackClick}>Cancel</button>
                        </div>
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
                    {clickedTagTitle && (
                        <div className="edit-tag">
                            <span className="priority" style={{ background: clickedTagColor }}>
                                {clickedTagTitle}
                            </span>
                        </div>
                    )}
                    <label className="edit-tag-name">
                        <span><b>Title</b></span>
                        <input className="label-input" type="text" value={clickedTagTitle} onChange={(e) => { setClickedTagTitle(e.target.value) }} />
                    </label>
                    <label>
                        <span><b>Color</b></span>
                        <input className="label-input" type="text" value={clickedTagColor ? clickedTagColor : "#"} onChange={handleColorChange} maxLength={7} placeholder="Enter a hex code..." />
                    </label>
                    <div className="dropdown-edit-buttons">
                        <div>
                            <button type="button" onClick={() => handleEditTag(clickedTagId)}>Save</button>
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
                                if (!tag || !tag.tag_id || !tag.tag_color || !tag.tag_name) {
                                    return null;
                                }
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