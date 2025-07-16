import React, { FC } from "react";
import styles from "@/styles/ContactModal.module.css";

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: FC<ContactModalProps> = ({ onClose }) => {
  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      data-component="contact-modal-backdrop"
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        data-component="contact-modal-content"
      >
        <button
          className={styles.modalClose}
          onClick={onClose}
          data-component="contact-modal-close"
        >
          &times;
        </button>
        <h2 className={styles.modalTitle} data-component="contact-modal-title">
          Contact Us
        </h2>
        <p
          className={styles.modalDescription}
          data-component="contact-modal-description"
        >
          We'd love to hear from you! Please fill out the form below and we'll get
          in touch soon.
        </p>
        <form className={styles.modalForm} data-component="contact-modal-form">
          <input
            type="text"
            placeholder="Your Name"
            className={styles.modalInput}
            data-component="contact-modal-input-name"
          />
          <input
            type="email"
            placeholder="Your Email"
            className={styles.modalInput}
            data-component="contact-modal-input-email"
          />
          <textarea
            placeholder="Your Message"
            className={styles.modalTextarea}
            data-component="contact-modal-textarea-message"
          ></textarea>
          <button
            type="submit"
            className={styles.modalSubmit}
            data-component="contact-modal-submit"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
