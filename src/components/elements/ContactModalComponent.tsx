import React, { FC } from "react";
import styles from "@/styles/ContactModal.module.css";

interface ContactModalProps {
  onClose: () => void;
}

const ContactModalComponent: FC<ContactModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button className={styles.modalClose} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Contact Us</h2>
        <p className={styles.modalDescription}>
          We'd love to hear from you! Please fill out the form below and we'll get in touch soon.
        </p>
        <form className={styles.modalForm}>
          <input type="text" placeholder="Your Name" className={styles.modalInput} />
          <input type="email" placeholder="Your Email" className={styles.modalInput} />
          <textarea placeholder="Your Message" className={styles.modalTextarea}></textarea>
          <button type="submit" className={styles.modalSubmit}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModalComponent;
