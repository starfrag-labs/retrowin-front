import { useState } from "react";
import styles from "./power_button.module.css";

export default function PowerButton() {
  const [showDialog, setShowDialog] = useState(false);

  const handlePowerClick = () => {
    setShowDialog(true);
  };

  const handleShutdown = () => {
    // In a real app, this would trigger shutdown
    window.location.href = "about:blank";
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <>
      <button
        className={styles.power_button}
        onClick={handlePowerClick}
        type="button"
        title="Shutdown"
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Shutdown"
        >
          <path
            d="M12 2C12 2 12 2 12 2C12 2 12 2 12 2C12 2 12 2 12 2ZM12 6C12 6 12 6 12 6C12 6 12 6 12 6C12 6 12 6 12 6C12 6 12 6 12 6ZM12 6C12 6 12 6 12 6C12 6 12 6 12 6Z"
            fill="currentColor"
          />
          <title>Shutdown</title>
          <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" />
          <path
            d="M12 11C12 11 12 11 12 11C12 11 12 11 12 11C12 11 12 11 12 11C12 11 12 11 12 11Z"
            fill="currentColor"
          />
        </svg>
        <span className={styles.button_text}>start</span>
      </button>

      {showDialog && (
        <div
          className={styles.dialog_overlay}
          onClick={handleCancel}
          onKeyDown={(e) => e.key === "Escape" && handleCancel()}
          role="none"
        >
          <div
            className={styles.dialog}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shutdown-title"
          >
            <div className={styles.dialog_header}>
              <h2 id="shutdown-title">Shut Down Windows</h2>
            </div>
            <div className={styles.dialog_content}>
              <p>Are you sure you want to shut down the computer?</p>
            </div>
            <div className={styles.dialog_footer}>
              <button
                className={styles.dialog_button}
                onClick={handleShutdown}
                type="button"
              >
                OK
              </button>
              <button
                className={styles.dialog_button}
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
