import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const PostForm = ({ isOpen, onRequestClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData ? initialData.name : "");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave({ id: initialData ? initialData.id : null, name });
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <form onSubmit={handleSubmit}>
        <h2>{initialData ? "Edit Post" : "Create Post"}</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">{initialData ? "Update" : "Create"}</button>
        <button type="button" onClick={onRequestClose}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default PostForm;
