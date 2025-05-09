import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    sendPasswordResetEmail, 
    sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmIh93J8Mub45ifggCud3VzfYgQMtVIXU",
    authDomain: "frenca-test-database.firebaseapp.com",
    projectId: "frenca-test-database",
    storageBucket: "frenca-test-database.firebasestorage.app",
    messagingSenderId: "541348424936",
    appId: "1:541348424936:web:8467a8a05587f009552d5d",
    measurementId: "G-L9Y9KTSB8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Password validation function
function validatePassword(password) {
    // At least 8 characters, 1 number, 1 uppercase, 1 special char
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        valid: minLength && hasNumber && hasUpper && hasSpecial,
        minLength,
        hasNumber,
        hasUpper,
        hasSpecial
    };
}

// Authentication functions
async function handleLogin(event, lang) {
    event.preventDefault();
    console.log('Login attempt:', lang);
    const email = document.getElementById(`email-${lang}`).value;
    const password = document.getElementById(`password-${lang}`).value;
    console.log('Email:', email, 'Password length:', password.length);
    const errorElement = document.getElementById(`error-${lang}`);
    const loadingSpinner = document.getElementById(`loading-spinner-${lang}`);
    
    // Custom validation
    if (!email) {
        errorElement.textContent = lang === 'en' ? 
            'Please enter your email address' : 
            'Veuillez entrer votre adresse courriel';
        return;
    }
    
    if (!password) {
        errorElement.textContent = lang === 'en' ? 
            'Please enter your password' : 
            'Veuillez entrer votre mot de passe';
        return;
    }
    
    try {
        // Show loading spinner
        loadingSpinner.style.display = 'block';
        errorElement.textContent = '';
        
        console.log('Attempting Firebase login...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', userCredential.user.email);
        // Success is handled by onAuthStateChanged
    } catch (error) {
        console.error('Login error:', error);
        handleAuthError(error, lang);
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
}

async function handleRegistration() {
    const regEmail = document.getElementById('reg-email');
    const regEmailConfirm = document.getElementById('reg-email-confirm');
    const regPassword = document.getElementById('reg-password');
    const regPasswordConfirm = document.getElementById('reg-password-confirm');
    const termsCheckbox = document.getElementById('terms-checkbox');
    const regError = document.getElementById('reg-error');
    const loadingSpinnerReg = document.getElementById('loading-spinner-reg');
    
    const email = regEmail.value;
    const emailConfirm = regEmailConfirm.value;
    const password = regPassword.value;
    const passwordConfirm = regPasswordConfirm.value;
    const termsAccepted = termsCheckbox.checked;
    
    // Import for currentLanguage global variable
    const currentLanguage = window.currentLanguage;
    const translations = window.translations;
    
    // Reset error styling
    regError.style.color = 'var(--primary)';
    regError.textContent = '';
    
    // Validation
    if (!email) {
        regError.textContent = translations[currentLanguage].errorEmailRequired;
        return;
    }
    
    if (email !== emailConfirm) {
        regError.textContent = translations[currentLanguage].errorEmailMatch;
        return;
    }
    
    if (!password) {
        regError.textContent = translations[currentLanguage].errorPasswordRequired;
        return;
    }
    
    if (password !== passwordConfirm) {
        regError.textContent = translations[currentLanguage].errorPasswordMatch;
        return;
    }
    
    // Validate password strength
    const validation = validatePassword(password);
    if (!validation.valid) {
        regError.textContent = currentLanguage === 'en' ? 
            'Password must be at least 8 characters with 1 number, 1 uppercase letter, and 1 special character' : 
            'Le mot de passe doit comporter au moins 8 caractères avec 1 chiffre, 1 lettre majuscule et 1 caractère spécial';
        return;
    }
    
    // Check terms acceptance
    if (!termsAccepted) {
        regError.textContent = translations[currentLanguage].errorTermsRequired;
        return;
    }
    
    try {
        // Show loading spinner
        loadingSpinnerReg.style.display = 'block';
        regError.textContent = '';
        
        console.log('Attempting Firebase createUser...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Account created:', userCredential.user.email);
        
        // Send verification email
        await sendEmailVerification(userCredential.user);
        console.log('Verification email sent');
        
        // Show verification message
        regError.style.color = 'var(--success)';
        regError.textContent = translations[currentLanguage].successAccountCreated;
        
        // Show verification screen after short delay
        setTimeout(() => {
            window.showVerificationScreen(currentLanguage);
        }, 2000);
        
    } catch (error) {
        console.error('Registration error:', error);
        handleRegistrationError(error);
    } finally {
        // Hide loading spinner
        loadingSpinnerReg.style.display = 'none';
    }
}

async function resendVerification(lang) {
    const loadingSpinner = document.getElementById(`loading-spinner-verify-${lang}`);
    
    try {
        // Show loading spinner
        loadingSpinner.style.display = 'block';
        
        const user = auth.currentUser;
        if (user) {
            await sendEmailVerification(user);
            alert(lang === 'en' ? 
                'Verification email sent again!' : 
                'Courriel de vérification envoyé à nouveau!');
        } else {
            // User not logged in, show login form
            window.showLogin(lang);
        }
    } catch (error) {
        console.error('Error sending verification email:', error);
        alert(lang === 'en' ? 
            'Error sending verification email. Please try again.' : 
            'Erreur lors de l\'envoi du courriel de vérification. Veuillez réessayer.');
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
}

async function handleForgotPassword(lang) {
    console.log('Forgot password:', lang);
    const email = document.getElementById(`email-${lang}`).value;
    const errorElement = document.getElementById(`error-${lang}`);
    const loadingSpinner = document.getElementById(`loading-spinner-${lang}`);
    
    if (!email) {
        console.log('Missing email for forgot password');
        errorElement.textContent = lang === 'en' ? 
            'Please enter your email address' : 
            'Veuillez entrer votre adresse courriel';
        return;
    }
    
    try {
        // Show loading spinner
        loadingSpinner.style.display = 'block';
        errorElement.textContent = '';
        
        console.log('Sending password reset email...');
        await sendPasswordResetEmail(auth, email);
        errorElement.style.color = 'var(--success)';
        errorElement.textContent = lang === 'en' ? 
            'Password reset email sent!' : 
            'Courriel de réinitialisation envoyé!';
        setTimeout(() => {
            errorElement.textContent = '';
            errorElement.style.color = 'var(--primary)';
        }, 3000);
    } catch (error) {
        console.error('Forgot password error:', error);
        handleAuthError(error, lang);
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        // Redirect to landing page - UI function will handle this
        window.showLandingPage();
        
        // Clear forms
        document.getElementById('email-en').value = '';
        document.getElementById('password-en').value = '';
        document.getElementById('email-fr').value = '';
        document.getElementById('password-fr').value = '';
        
        // Clear errors
        document.getElementById('error-en').textContent = '';
        document.getElementById('error-fr').textContent = '';
        
        // Reset password strength indicators
        window.updatePasswordStrength('', 'en');
        window.updatePasswordStrength('', 'fr');
        
        // Clear any verification check timers
        if (window.verificationCheckTimer) {
            clearInterval(window.verificationCheckTimer);
            window.verificationCheckTimer = null;
        }
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

function handleRegistrationError(error) {
    console.error('Registration error:', error.code, error.message);
    
    const regError = document.getElementById('reg-error');
    const currentLanguage = window.currentLanguage;
    
    // Reset error styling
    regError.style.color = 'var(--primary)';
    
    switch(error.code) {
        case 'auth/email-already-in-use':
            regError.textContent = currentLanguage === 'en' ? 
                'Email is already in use. Try logging in instead.' : 
                'Ce courriel est déjà utilisé. Essayez de vous connecter.';
            break;
        case 'auth/invalid-email':
            regError.textContent = currentLanguage === 'en' ? 
                'Please enter a valid email address.' : 
                'Veuillez entrer une adresse courriel valide.';
            break;
        case 'auth/weak-password':
            regError.textContent = currentLanguage === 'en' ? 
                'Password is too weak. Please use a stronger password.' : 
                'Le mot de passe est trop faible. Veuillez utiliser un mot de passe plus fort.';
            break;
        case 'auth/network-request-failed':
            regError.textContent = currentLanguage === 'en' ? 
                'Network error. Please check your connection.' : 
                'Erreur réseau. Veuillez vérifier votre connexion.';
            break;
        default:
            regError.textContent = currentLanguage === 'en' ? 
                'An error occurred. Please try again.' : 
                'Une erreur s\'est produite. Veuillez réessayer.';
    }
}

function handleAuthError(error, lang) {
    console.error('Auth error:', error.code, error.message);
    const errorElement = document.getElementById(`error-${lang}`);
    
    // Reset error styling
    errorElement.style.color = 'var(--primary)';
    
    switch(error.code) {
        case 'auth/email-already-in-use':
            errorElement.textContent = lang === 'en' ? 
                'Email is already in use. Try logging in instead.' : 
                'Ce courriel est déjà utilisé. Essayez de vous connecter.';
            break;
        case 'auth/invalid-email':
            errorElement.textContent = lang === 'en' ? 
                'Please enter a valid email address.' : 
                'Veuillez entrer une adresse courriel valide.';
            break;
        case 'auth/user-disabled':
            errorElement.textContent = lang === 'en' ? 
                'This account has been disabled.' : 
                'Ce compte a été désactivé.';
            break;
        case 'auth/user-not-found':
            errorElement.textContent = lang === 'en' ? 
                'No account found with this email.' : 
                'Aucun compte trouvé avec ce courriel.';
            break;
        case 'auth/wrong-password':
            errorElement.textContent = lang === 'en' ? 
                'Incorrect password.' : 
                'Mot de passe incorrect.';
            break;
        case 'auth/weak-password':
            errorElement.textContent = lang === 'en' ? 
                'Password is too weak. Please use a stronger password.' : 
                'Le mot de passe est trop faible. Veuillez utiliser un mot de passe plus fort.';
            break;
        case 'auth/network-request-failed':
            errorElement.textContent = lang === 'en' ? 
                'Network error. Please check your connection.' : 
                'Erreur réseau. Veuillez vérifier votre connexion.';
            break;
        case 'auth/too-many-requests':
            errorElement.textContent = lang === 'en' ? 
                'Too many attempts. Please try again later.' : 
                'Trop de tentatives. Veuillez réessayer plus tard.';
            break;
        default:
            errorElement.textContent = lang === 'en' ? 
                'An error occurred. Please try again.' : 
                'Une erreur s\'est produite. Veuillez réessayer.';
    }
}

export { 
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
};