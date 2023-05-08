import React, { useState, useEffect } from 'react';

function TagDropdown({ task, tags, setTags, selectedTags, setSelectedTags }) {
    const [showTagDropdown, setShowTagDropdown] = useState(false);

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
                                <span className="material-symbols-outlined edit">edit</span>
                            </li>
                        ))}
                    </ul>
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