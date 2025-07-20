import { useState } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';
import './CustomCursor.css';
import CustomCursor from './CustomCursor';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_yctte18',
      'template_4gc02ch',
      e.target,
      'x8XdIuzIHYjZkVKIu'
    ).then(() => {
      setSubmitted(true);
    }).catch((error) => {
      console.error('EmailJS Error:', error);
      alert('Something went wrong. Try again.');
    });
  };

  return (
    <div className="contact-page">
      <CustomCursor />
      <div className="contact-card">
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <h2>Message Sent 🎉</h2>
            <p>Thank you! We’ll get back to you soon.</p>
            <a href="/" className="start-button">Return Home</a>
          </div>
        ) : (
          <>
            <h2>Contact Us</h2>
            <form className="contact-form" onSubmit={sendEmail}>
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Email Address" required />
              <input type="tel" name="phone" placeholder="Phone Number" required />
              <textarea name="message" placeholder="Your Message..." required rows={4}></textarea>
              <div className="contact-actions">
                <button type="submit">Send</button>
              </div>
            </form>

            {/* Return Home Button for users who haven't submitted */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href="/" className="button"> Home</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
