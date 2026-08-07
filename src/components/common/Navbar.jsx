import React from "react";

const SaveBar = ({
  isDirty,
  onSave,
  onDiscard,
  isSaving = false,
  message = "Unsaved changes",
}) => {
  if (!isDirty) return null;

  return (
    <div className="save-bar-wrapper">
      <div className="save-bar-container">
        <div className="save-bar-info">
          <span className="save-bar-indicator"></span>
          <span className="save-bar-message">{message}</span>
        </div>

        <div className="save-bar-actions">
          <button
            type="button"
            className="btn-discard"
            onClick={onDiscard}
            disabled={isSaving}
          >
            Discard
          </button>
          <button
            type="button"
            className="btn-save"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export { SaveBar };
export default SaveBar;
