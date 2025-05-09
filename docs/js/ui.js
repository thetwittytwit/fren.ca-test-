// Update password strength indicator for login forms
function updatePasswordStrength(password, lang) {
    const indicator = document.getElementById(`strength-indicator-${lang}`);
    const feedback = document.getElementById(`password-feedback-${lang}`);
    
    if (!password) {
        indicator.style.width = '0%';
        feedback.textContent = '';
        return;
    }
    
    const validation = window.validatePassword(password);
    
    // Calculate strength percentage
    let strength = 0;
    if (validation.minLength) strength += 25;
    if (validation.hasNumber) strength += 25;
    if (validation.hasUpper) strength += 25;
    if (validation.hasSpecial) strength += 25;
    
    // Update indicator
    indicator.style.width = `${strength}%`;
    
    // Set color based on strength
    if (strength < 50) {
        indicator.style.backgroundColor = '#FF4136'; // Weak - Red
    } else if (strength < 100) {
        indicator.style.backgroundColor = '#FF851B'; // Medium - Orange
    } else {
        indicator.style.backgroundColor = '#2ECC40'; // Strong - Green
    }
    
    // Update feedback text
    if (lang === 'en') {
        if (!validation.valid) {
            let feedbackText = 'Password should have:';
            if (!validation.minLength) feedbackText += ' 8+ characters.';
            if (!validation.hasNumber) feedbackText += ' At least 1 number.';
            if (!validation.hasUpper) feedbackText += ' At least 1 uppercase letter.';
            if (!validation.hasSpecial) feedbackText += ' At least 1 special character.';
            feedback.textContent = feedbackText;
        } else {
            feedback.textContent = 'Strong password';
        }
    } else {
        if (!validation.valid) {
            let feedbackText = 'Le mot de passe doit avoir:';
            if (!validation.minLength) feedbackText += ' 8+ caractères.';
            if (!validation.hasNumber) feedbackText += ' Au moins 1 chiffre.';
            if (!validation.hasUpper) feedbackText += ' Au moins 1 majuscule.';
            if (!validation.hasSpecial) feedbackText += ' Au moins 1 caractère spécial.';
            feedback.textContent = feedbackText;
        } else {
            feedback.textContent = 'Mot de passe fort';
        }
    }
}

// Update password strength indicator for registration form
function updateRegistrationPasswordStrength(password) {
    const regStrengthIndicator = document.getElementById('reg-strength-indicator');
    const regPasswordFeedback = document.getElementById('reg-password-feedback');
    const currentLanguage = window.currentLanguage;
    const translations = window.translations;
    
    if (!password) {
        regStrengthIndicator.style.width = '0%';
        regPasswordFeedback.textContent = '';
        return;
    }
    
    const validation = window.validatePassword(password);
    
    // Calculate strength percentage
    let strength = 0;
    if (validation.minLength) strength += 25;
    if (validation.hasNumber) strength += 25;
    if (validation.hasUpper) strength += 25;
    if (validation.hasSpecial) strength += 25;
    
    // Update indicator
    regStrengthIndicator.style.width = `${strength}%`;
    
    // Set color based on strength
    if (strength < 50) {
        regStrengthIndicator.style.backgroundColor = '#FF4136'; // Weak - Red
    } else if (strength < 100) {
        regStrengthIndicator.style.backgroundColor = '#FF851B'; // Medium - Orange
    } else {
        regStrengthIndicator.style.backgroundColor = '#2ECC40'; // Strong - Green
    }
    
    // Update feedback text using translations
    if (!validation.valid) {
        let feedbackText = translations[currentLanguage].passwordRequirements;
        if (!validation.minLength) feedbackText += ' ' + translations[currentLanguage].passwordLength;
        if (!validation.hasNumber) feedbackText += ' ' + translations[currentLanguage].passwordNumber;
        if (!validation.hasUpper) feedbackText += ' ' + translations[currentLanguage].passwordUpper;
        if (!validation.hasSpecial) feedbackText += ' ' + translations[currentLanguage].passwordSpecial;
        regPasswordFeedback.textContent = feedbackText;
    } else {
        regPasswordFeedback.textContent = translations[currentLanguage].passwordStrength;
    }
}

function hideAllLoginForms() {
    // Hide all boxes within login container
    document.getElementById('fr-login').style.display = 'none';
    document.getElementById('en-login').style.display = 'none';
    document.getElementById('fr-verification').style.display = 'none';
    document.getElementById('en-verification').style.display = 'none';
    document.getElementById('registration-box').style.display = 'none';
}

function showLandingPage() {
    document.getElementById('landing-page').style.display = 'flex';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'none';
}

function goToLogin(lang) {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('dashboard-container').style.display = 'none';
    
    // Hide all forms within the container first, then show the appropriate one
    hideAllLoginForms();
    
    // Show the correct language login form
    if (lang === 'en') {
        document.getElementById('en-login').style.display = 'block';
    } else {
        document.getElementById('fr-login').style.display = 'block';
    }
    
    // Update current language
    window.currentLanguage = lang;
    updateLanguageIndicators();
}

function updateLanguageIndicators() {
    const currentLanguage = window.currentLanguage;
    const frSwitch = document.getElementById('fr-switch');
    const enSwitch = document.getElementById('en-switch');
    const frSwitchDashboard = document.getElementById('fr-switch-dashboard');
    const enSwitchDashboard = document.getElementById('en-switch-dashboard');
    const footerEn = document.getElementById('footer-en');
    const footerFr = document.getElementById('footer-fr');
    
    // Update language indicators based on current language
    if (currentLanguage === 'fr') {
        frSwitch.style.fontWeight = '700';
        enSwitch.style.fontWeight = '400';
        if (frSwitchDashboard && enSwitchDashboard) {
            frSwitchDashboard.style.fontWeight = '700';
            enSwitchDashboard.style.fontWeight = '400';
        }
        footerFr.style.display = 'block';
        footerEn.style.display = 'none';
        document.documentElement.lang = 'fr';
    } else {
        enSwitch.style.fontWeight = '700';
        frSwitch.style.fontWeight = '400';
        if (frSwitchDashboard && enSwitchDashboard) {
            enSwitchDashboard.style.fontWeight = '700';
            frSwitchDashboard.style.fontWeight = '400';
        }
        footerEn.style.display = 'block';
        footerFr.style.display = 'none';
        document.documentElement.lang = 'en';
    }
}

function switchLanguage(lang) {
    const currentLanguage = window.currentLanguage;
    const updateUILanguage = window.updateUILanguage;
    
    // Update language state
    window.currentLanguage = lang;
    
    // Update the registration form if it's visible
    if (document.getElementById('registration-box').style.display === 'block') {
        updateUILanguage(lang);
    }
    
    // Update language indicators
    updateLanguageIndicators();
    
    // Determine which screen to show based on current container
    if (document.getElementById('dashboard-container').style.display === 'flex') {
        // Dashboard is showing - update it
        if (lang === 'fr') {
            document.getElementById('fr-dashboard').style.display = 'block';
            document.getElementById('en-dashboard').style.display = 'none';
        } else {
            document.getElementById('en-dashboard').style.display = 'block';
            document.getElementById('fr-dashboard').style.display = 'none';
        }
    } else if (document.getElementById('login-container').style.display === 'flex') {
        // If registration form is showing, just update the text
        if (document.getElementById('registration-box').style.display === 'block') {
            return;
        }
        
        // Login container is showing - determine if login or verification should show
        const user = window.auth.currentUser;
        if (user && !user.emailVerified) {
            showVerificationScreen(lang);
        } else {
            showLogin(lang);
        }
    }
}

// Setup verification check
function setupVerificationCheck() {
    // Clear any existing timers
    if (window.verificationCheckTimer) {
        clearInterval(window.verificationCheckTimer);
    }
    
    // Check every 3 seconds if the user has verified their email
    window.verificationCheckTimer = setInterval(() => {
        const user = window.auth.currentUser;
        if (user) {
            // Force refresh the token to get updated verification status
            user.getIdToken(true)
                .then(() => {
                    // Reload user to get latest verification status
                    return user.reload();
                })
                .then(() => {
                    // Check if user is now verified
                    if (window.auth.currentUser.emailVerified) {
                        console.log('Email verified, redirecting to dashboard');
                        clearInterval(window.verificationCheckTimer);
                        showDashboard();
                    }
                })
                .catch(error => {
                    console.error('Error refreshing token:', error);
                });
        } else {
            // No user, clear the interval
            clearInterval(window.verificationCheckTimer);
        }
    }, 3000);
}

function showVerificationScreen(lang) {
    // Make sure login container is visible
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('dashboard-container').style.display = 'none';
    
    // Hide all login forms and verification screens first
    hideAllLoginForms();
    
    // Show verification screen based on language
    if (lang === 'en') {
        document.getElementById('en-verification').style.display = 'block';
    } else {
        document.getElementById('fr-verification').style.display = 'block';
    }
    
    // Start checking for verification status
    setupVerificationCheck();
}

function showLogin(lang) {
    // First check if the user is logged in and verified
    const user = window.auth.currentUser;
    if (user && user.emailVerified) {
        // User is verified - show dashboard instead of login
        console.log('User is already verified, showing dashboard instead of login');
        showDashboard();
        return;
    }
    
    // Otherwise proceed with showing the login form
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('dashboard-container').style.display = 'none';
    
    // Hide all verification screens and login forms first
    hideAllLoginForms();
    
    // Show login form based on language
    if (lang === 'en') {
        document.getElementById('en-login').style.display = 'block';
    } else {
        document.getElementById('fr-login').style.display = 'block';
    }
}

function showDashboard() {
    // Clear any verification check timers
    if (window.verificationCheckTimer) {
        clearInterval(window.verificationCheckTimer);
        window.verificationCheckTimer = null;
    }
    
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'flex';
    
    // Update welcome message
    const user = window.auth.currentUser;
    if (user) {
        document.getElementById('welcome-email-en').textContent = `Logged in as: ${user.email}`;
        document.getElementById('welcome-email-fr').textContent = `Connecté en tant que: ${user.email}`;
    }
    
    // Apply current language to dashboard
    if (window.currentLanguage === 'fr') {
        document.getElementById('fr-dashboard').style.display = 'block';
        document.getElementById('en-dashboard').style.display = 'none';
    } else {
        document.getElementById('en-dashboard').style.display = 'block';
        document.getElementById('fr-dashboard').style.display = 'none';
    }
    
    // Re-attach logout event listeners if they're missing
    const logoutEn = document.getElementById('logout-en');
    const logoutFr = document.getElementById('logout-fr');
    
    if (logoutEn) {
        logoutEn.removeEventListener('click', window.handleLogout);
        logoutEn.addEventListener('click', window.handleLogout);
    }
    if (logoutFr) {
        logoutFr.removeEventListener('click', window.handleLogout);
        logoutFr.addEventListener('click', window.handleLogout);
    }
}

function showRegistration() {
    // Make sure login container is visible
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('dashboard-container').style.display = 'none';
    
    // Hide all forms
    hideAllLoginForms();
    
    // Show registration form and update text based on current language
    document.getElementById('registration-box').style.display = 'block';
    window.updateUILanguage(window.currentLanguage);
    
    // Clear any existing form data
    document.getElementById('registration-form').reset();
    document.getElementById('reg-strength-indicator').style.width = '0%';
    document.getElementById('reg-password-feedback').textContent = '';
    document.getElementById('reg-error').textContent = '';
}

export {
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
};