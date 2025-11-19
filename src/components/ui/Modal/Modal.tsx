import React from 'react';
import ReactModal from 'react-modal';
import IconButton from '../IconButton';
import styles from './Modal.module.scss';

ReactModal.setAppElement('#root');

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`${styles.modal} ${styles[size]}`}
      overlayClassName={styles.overlay}
      closeTimeoutMS={200}
    >
      <div className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <IconButton
          icon="×"
          ariaLabel="Close modal"
          onClick={onClose}
          className={styles.closeButton}
        />
      </div>
      
      <div className={styles.content}>
        {children}
      </div>
      
      {footer && <div className={styles.footer}>{footer}</div>}
    </ReactModal>
  );
};

export default Modal;
