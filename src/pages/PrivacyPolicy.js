import React from 'react';
import './Legal.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 2023</p>
        
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            At Trading Tutor, we respect your privacy and are committed to protecting your personal data.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our Service, including:
          </p>
          <ul>
            <li>Personal identifiers such as name and email address</li>
            <li>Account credentials</li>
            <li>Usage data and analytics</li>
            <li>Payment information (processed securely through our payment processors)</li>
          </ul>
        </section>
        
        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our Service</li>
            <li>Process transactions and manage your account</li>
            <li>Send you service-related notifications</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Monitor and analyze usage patterns and trends</li>
          </ul>
        </section>
        
        <section className="legal-section">
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our Service and hold certain information.
            Cookies are files with a small amount of data that may include an anonymous unique identifier.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            However, if you do not accept cookies, you may not be able to use some portions of our Service.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>6. Third-Party Services</h2>
          <p>
            Our Service may contain links to third-party websites or services that are not owned or controlled by Trading Tutor.
            We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>7. Children's Privacy</h2>
          <p>
            Our Service is not intended for use by children under the age of 18.
            We do not knowingly collect personally identifiable information from children under 18.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time.
            We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>9. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal data, such as the right to access, correct, or delete your data.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@tradingtutor.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
