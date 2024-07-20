import {
  modalContainer,
  modal,
  modalButtonContainer,
  modalAccept,
  modalCancel,
  modalContent,
} from '../../styles/mobile/modal.css';

export const Modal = ({
  children,
  onAccept,
  onClose,
}: {
  children: React.ReactNode;
  onAccept: () => void;
  onClose: () => void;
}): React.ReactElement => {
  return (
    <div className={modalContainer}>
      <div className={modal}>
        <div className={modalContent}>{children}</div>
        <div className={modalButtonContainer}>
          <div className={modalCancel} onTouchEnd={onClose}>
            Cancel
          </div>
          <div className={modalAccept} onTouchEnd={onAccept}>
            Accept
          </div>
        </div>
      </div>
    </div>
  );
};
