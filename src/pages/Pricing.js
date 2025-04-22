import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaChevronRight, FaFileDownload, FaBook } from 'react-icons/fa';
import './Pricing.css';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleSignUp = () => {
        navigate('/login');
    };

    const handleSubscribe = (plan) => {
        // This will be connected to Stripe later
        console.log(`Selected plan: ${plan}`);
        // For now, just redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            // This would eventually open a Stripe checkout
            alert(`Thank you for selecting the ${plan} plan! Stripe integration coming soon.`);
        }
    };

    const handleEbookPurchase = () => {
        // This will be connected to Stripe later
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            // This would eventually open a Stripe checkout
            alert("Thank you for your interest in our eBook! Stripe integration coming soon.");
        }
    };

    return (
        <div className="pricing-container">
            {/* Hero Section */}
            <div className="pricing-hero-section">
                <div className="overlay"></div>
                <div className="pricing-hero-content">
                    <h1>Trading Tutor Pricing</h1>
                    <p className="pricing-tagline">
                        Invest in your trading education with our affordable plans
                    </p>
                </div>
            </div>

            {/* Pricing Plans Section */}
            <div className="pricing-plans-section">
                <h2>Choose Your Plan</h2>
                <div className="pricing-plans-container">
                    {/* Free Plan */}
                    <div className="pricing-plan free-plan">
                        <div className="plan-header">
                            <h3>Free</h3>
                            <div className="plan-price">$0</div>
                            <p className="plan-billing">Forever Free</p>
                        </div>
                        <div className="plan-features">
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Access to basic learning resources</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>2 free quizzes per day</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>5 AI chat messages per day</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>50 Trading journal entries</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Free Chart Patterns Cheat Sheet</span>
                            </div>
                        </div>
                        {!isAuthenticated && (
                            <button className="plan-button" onClick={handleSignUp}>
                                Sign Up <FaChevronRight className="button-icon" />
                            </button>
                        )}
                    </div>

                    {/* Monthly Plan */}
                    <div className="pricing-plan premium-plan">
                        <div className="plan-badge">Most Popular</div>
                        <div className="plan-header">
                            <h3>Essentials Monthly</h3>
                            <div className="plan-price">$9.99</div>
                            <p className="plan-billing">per month</p>
                        </div>
                        <div className="plan-features">
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Full access to all Trading Tutor features</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Unlimited quizzes</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>200 AI chat messages per day</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Unlimited Trading journal entries</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Includes eBook "The Trading Tutor Method"</span>
                            </div>
                        </div>
                        <button 
                            className="plan-button premium-button" 
                            onClick={() => handleSubscribe('monthly')}
                        >
                            Subscribe Now <FaChevronRight className="button-icon" />
                        </button>
                    </div>

                    {/* Annual Plan */}
                    <div className="pricing-plan premium-plan annual-plan">
                        <div className="plan-badge">Best Value</div>
                        <div className="plan-header">
                            <h3>Essentials Annual</h3>
                            <div className="plan-price">$79.99</div>
                            <p className="plan-billing">per year (Save 33%)</p>
                        </div>
                        <div className="plan-features">
                        <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Full access to all Trading Tutor features</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Unlimited quizzes</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>200 AI chat messages per day</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Unlimited Trading journal entries</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Includes eBook "The Trading Tutor Method"</span>
                            </div>
                            <div className="plan-feature">
                                <FaCheck className="feature-icon" />
                                <span>Save 33% compared to monthly plan</span>
                            </div>
                        </div>
                        <button 
                            className="plan-button premium-button" 
                            onClick={() => handleSubscribe('annual')}
                        >
                            Subscribe Now <FaChevronRight className="button-icon" />
                        </button>
                    </div>
                </div>
            </div>

            {/* eBook Section */}
            <div className="ebook-section">
                <div className="ebook-content">
                    <div className="ebook-image">
                        <img 
                            src={require('../assets/trading-tutor-ebook-cover-small.png')} 
                            alt="Trading Tutor eBook Cover" 
                            className="ebook-cover-image" 
                        />
                    </div>
                    <div className="ebook-details">
                        <h2>The Trading Tutor Method</h2>
                        <h3>A Systematic Approach to Market Success</h3>
                        <p>
                            Our comprehensive guide to trading strategies, chart patterns, and risk management.
                            Perfect for traders at any level looking to enhance their skills.
                        </p>
                        <p className="ebook-included-note">
                            <strong>Note:</strong> This eBook is included for FREE with both monthly and annual subscriptions.
                        </p>
                        <div className="ebook-pricing">
                            <div className="ebook-price">$2.99</div>
                        </div>
                        {isAuthenticated ? (
                            <button className="ebook-button" onClick={handleEbookPurchase}>
                                Purchase eBook <FaBook className="button-icon" />
                            </button>
                        ) : (
                              <button className="ebook-login-button" onClick={handleSignUp}>
                                  Sign Up to Purchase
                              </button>
                        )}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-container">
                    <div className="faq-item">
                        <h3>What's included in the free plan?</h3>
                        <p>
                            The free plan gives you access to basic learning resources, 2 free quizzes per day, 
                            5 AI chat messages per day, and our Common Chart Patterns Cheat Sheet.
                        </p>
                    </div>
                    <div className="faq-item">
                        <h3>Can I cancel my subscription anytime?</h3>
                        <p>
                            Yes, you can cancel your subscription at any time. Your access will continue until 
                            the end of your billing period.
                        </p>
                    </div>
                    <div className="faq-item">
                        <h3>Is there a refund policy?</h3>
                        <p>
                            We offer a 7-day money-back guarantee for all new subscriptions if you're not satisfied 
                            with our service.
                        </p>
                    </div>
                    <div className="faq-item">
                        <h3>What payment methods do you accept?</h3>
                        <p>
                            We accept all major credit cards, PayPal, and Apple Pay through our secure 
                            payment processor.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="pricing-cta-section">
                <div className="pricing-cta-content">
                    <h2>Ready to Elevate Your Trading Skills?</h2>
                    <p>Join thousands of traders who are improving their skills with Trading Tutor</p>
                    <div className="pricing-cta-buttons">
                        {!isAuthenticated ? (
                            <button onClick={handleSignUp} className="primary-button">
                                Get Started Today
                            </button>
                        ) : (
                            <button onClick={() => handleSubscribe('monthly')} className="primary-button">
                                Upgrade Your Account
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
