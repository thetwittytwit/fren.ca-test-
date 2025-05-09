// Import modules
import { translations, updateUILanguage } from './translations.js';
import { 
    auth, 
    validatePassword, 
    handleLogin, 
    handleRegistration, 
    resendVerification, 
    handleForgotPassword, 
    handleLogout,
    handleRegistrationError,
    handleAuthError,
    onAuthStateChanged
} from './auth.js';
import {
    updatePasswordStrength,
    updateRegistrationPasswordStrength,
    hideAllLoginForms,
    showLandingPage,
    goToLogin,
    updateLanguageIndicators,
    switchLanguage,
    setupVerificationCheck,
    showVerificationScreen,
    showLogin,
    showDashboard,
    showRegistration
} from './ui.js';

// Make functions and variables globally available
window.currentLanguage = 'en';
window.verificationCheckTimer = null;
window.translations = translations;
window.updateUILanguage = updateUILanguage;
window.auth = auth;
window.validatePassword = validatePassword;
window.handleLogin = handleLogin;
window.handleRegistration = handleRegistration;
window.resendVerification = resendVerification;
window.handleForgotPassword = handleForgotPassword;
window.handleLogout = handleLogout;
window.updatePasswordStrength = updatePasswordStrength;
window.updateRegistrationPasswordStrength = updateRegistrationPasswordStrength;
window.showLandingPage = showLandingPage;
window.goToLogin = goToLogin;
window.updateLanguageIndicators = updateLanguageIndicators;
window.switchLanguage = switchLanguage;
window.setupVerificationCheck = setupVerificationCheck;
window.showVerificationScreen = showVerificationScreen;
window.showLogin = showLogin;
window.showDashboard = showDashboard;
window.showRegistration = showRegistration;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script starting...');
    
    // === ELEMENT REFERENCES ===
    // Landing page elements
    const frSwitchLanding = document.getElementById('fr-switch-landing');
    const enSwitchLanding = document.getElementById('en-switch-landing');
    
    // Login page elements
    const frSwitch = document.getElementById('fr-switch');
    const enSwitch = document.getElementById('en-switch');
    
    // Event Listeners - Landing Page
    if (frSwitchLanding) {
        frSwitchLanding.addEventListener('click', () => goToLogin('fr'));
    }
    if (enSwitchLanding) {
        enSwitchLanding.addEventListener('click', () => goToLogin('en'));
    }
    
    // Event Listeners - Login Page
    if (frSwitch) {
        frSwitch.addEventListener('click', () => switchLanguage('fr'));
    }
    if (enSwitch) {
        enSwitch.addEventListener('click', () => switchLanguage('en'));
    }
    
    // Event Listeners - Dashboard
    const frSwitchDashboard = document.getElementById('fr-switch-dashboard');
    const enSwitchDashboard = document.getElementById('en-switch-dashboard');
    
    if (frSwitchDashboard) {
        frSwitchDashboard.addEventListener('click', () => switchLanguage('fr'));
    }
    if (enSwitchDashboard) {
        enSwitchDashboard.addEventListener('click', () => switchLanguage('en'));
    }
    
    // Event Listeners - Verification
    const resendVerificationEn = document.getElementById('resend-verification-en');
    const resendVerificationFr = document.getElementById('resend-verification-fr');
    const backToLoginEn = document.getElementById('back-to-login-en');
    const backToLoginFr = document.getElementById('back-to-login-fr');
    
    if (resendVerificationEn) {
        resendVerificationEn.addEventListener('click', () => resendVerification('en'));
    }
    if (resendVerificationFr) {
        resendVerificationFr.addEventListener('click', () => resendVerification('fr'));
    }
    if (backToLoginEn) {
        backToLoginEn.addEventListener('click', () => showLogin('en'));
    }
    if (backToLoginFr) {
        backToLoginFr.addEventListener('click', () => showLogin('fr'));
    }
    
    // Password Strength Event Listeners
    const passwordEn = document.getElementById('password-en');
    const passwordFr = document.getElementById('password-fr');
    const regPassword = document.getElementById('reg-password');
    
    if (passwordEn) {
        passwordEn.addEventListener('input', (e) => updatePasswordStrength(e.target.value, 'en'));
    }
    if (passwordFr) {
        passwordFr.addEventListener('input', (e) => updatePasswordStrength(e.target.value, 'fr'));
    }
    if (regPassword) {
        regPassword.addEventListener('input', (e) => updateRegistrationPasswordStrength(e.target.value));
    }
    
    // Registration form events
    const registrationForm = document.getElementById('registration-form');
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegistration();
        });
    }
    
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => {
            showLogin(window.currentLanguage);
        });
    }
    
    // Create Account buttons
    const createAccountEn = document.getElementById('create-account-en');
    const createAccountFr = document.getElementById('create-account-fr');
    
    if (createAccountEn) {
        createAccountEn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegistration();
        });
    }
    if (createAccountFr) {
        createAccountFr.addEventListener('click', (e) => {
            e.preventDefault();
            showRegistration();
        });
    }
    
    // Form Event Listeners
    const loginFormEn = document.getElementById('login-form-en');
    const loginFormFr = document.getElementById('login-form-fr');
    const forgotPasswordEn = document.getElementById('forgot-password-en');
    const forgotPasswordFr = document.getElementById('forgot-password-fr');
    
    if (loginFormEn) {
        loginFormEn.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('English form submitted');
            handleLogin(e, 'en');
        });
    }
    
    if (loginFormFr) {
        loginFormFr.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('French form submitted');
            handleLogin(e, 'fr');
        });
    }
    
    if (forgotPasswordEn) {
        forgotPasswordEn.addEventListener('click', () => {
            handleForgotPassword('en');
        });
    }
    
    if (forgotPasswordFr) {
        forgotPasswordFr.addEventListener('click', () => {
            handleForgotPassword('fr');
        });
    }
    
    // === AUTH STATE MANAGEMENT ===
    // Auth state observer
    onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? user.email : 'signed out');
        if (user) {
            // User is signed in
            console.log('User signed in, verified:', user.emailVerified);
            
            // Check if email is verified
            if (!user.emailVerified) {
                // Show verification needed message
                document.getElementById('landing-page').style.display = 'none';
                document.getElementById('login-container').style.display = 'flex';
                document.getElementById('dashboard-container').style.display = 'none';
                
                // Show verification screen
                showVerificationScreen(window.currentLanguage);
                
                return;
            }
            
            // User is verified - show dashboard
            showDashboard();
        } else {
            // User is signed out
            console.log('User signed out, showing landing page');
            document.getElementById('dashboard-container').style.display = 'none';
            document.getElementById('landing-page').style.display = 'flex';
            document.getElementById('login-container').style.display = 'none';
            
            // Clear any verification check timers
            if (window.verificationCheckTimer) {
                clearInterval(window.verificationCheckTimer);
                window.verificationCheckTimer = null;
            }
        }
    });
    
    console.log('Event listeners set up complete');
});
