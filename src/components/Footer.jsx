import { Link } from "react-router-dom";
import Logo from "./Logo";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Logo variant="light" />
          <p className={styles.tagline}>
            Premium ophthalmology care and designer eyewear — clear vision, inside and out.
          </p>
          <div className={styles.social}>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="LinkedIn">IN</a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>Clinic</h4>
          <ul>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/book-appointment">Book an Eye Exam</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All Eyewear</Link></li>
            <li><Link to="/shop?category=Prescription%20Glasses">Prescription Glasses</Link></li>
            <li><Link to="/shop?category=Sunglasses">Sunglasses</Link></li>
            <li><Link to="/shop?category=Contact%20Lenses">Contact Lenses</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Visit</h4>
          <ul className={styles.contactList}>
            <li>128 Harbor View Avenue, Suite 300<br />Seacliff, CA 94920</li>
            <li><a href="tel:+18885551234">(888) 555-1234</a></li>
            <li><a href="mailto:hello@talpureyecare.example">hello@talpureyecare.example</a></li>
            <li>Mon–Sat, 8am–6pm</li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p>© {new Date().getFullYear()} Talpur Eye Care. All rights reserved.</p>
        <p className={styles.fineprint}>
          Demo site — mock data only. No real medical advice, appointments, or payments are processed.
        </p>
      </div>
    </footer>
  );
}
