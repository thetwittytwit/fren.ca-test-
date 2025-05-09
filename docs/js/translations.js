// Translation object for the data-attribute system
const translations = {
    en: {
        registerTitle: "Create Account",
        registerSubtitle: "Join fren.ca",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        emailConfirmLabel: "Confirm Email",
        emailConfirmPlaceholder: "your@email.com",
        passwordLabel: "Password",
        passwordConfirmLabel: "Confirm Password",
        termsCheckbox: "I agree to the Terms of Service and Privacy Policy",
        termsLink: "Terms of Service",
        privacyLink: "Privacy Policy",
        registerButton: "Create Account",
        backToLoginButton: "Back to Login",
        passwordStrength: "Strong password",
        passwordRequirements: "Password should have:",
        passwordLength: "8+ characters.",
        passwordNumber: "At least 1 number.",
        passwordUpper: "At least 1 uppercase letter.",
        passwordSpecial: "At least 1 special character.",
        errorEmailRequired: "Please enter your email address",
        errorEmailMatch: "Email addresses do not match",
        errorPasswordRequired: "Please enter your password",
        errorPasswordMatch: "Passwords do not match",
        errorTermsRequired: "You must accept the Terms of Service and Privacy Policy",
        successAccountCreated: "Account created! Please check your email to verify your address."
    },
    fr: {
        registerTitle: "Créer un compte",
        registerSubtitle: "Rejoindre fren.ca",
        emailLabel: "Courriel",
        emailPlaceholder: "votre@courriel.com",
        emailConfirmLabel: "Confirmer le courriel",
        emailConfirmPlaceholder: "votre@courriel.com",
        passwordLabel: "Mot de passe",
        passwordConfirmLabel: "Confirmer le mot de passe",
        termsCheckbox: "J'accepte les Conditions d'utilisation et la Politique de confidentialité",
        termsLink: "Conditions d'utilisation",
        privacyLink: "Politique de confidentialité",
        registerButton: "Créer un compte",
        backToLoginButton: "Retour à la connexion",
        passwordStrength: "Mot de passe fort",
        passwordRequirements: "Le mot de passe doit avoir:",
        passwordLength: "8+ caractères.",
        passwordNumber: "Au moins 1 chiffre.",
        passwordUpper: "Au moins 1 majuscule.",
        passwordSpecial: "Au moins 1 caractère spécial.",
        errorEmailRequired: "Veuillez entrer votre adresse courriel",
        errorEmailMatch: "Les adresses courriel ne correspondent pas",
        errorPasswordRequired: "Veuillez entrer votre mot de passe",
        errorPasswordMatch: "Les mots de passe ne correspondent pas",
        errorTermsRequired: "Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité",
        successAccountCreated: "Compte créé! Veuillez vérifier votre courriel."
    }
};

// Function to update UI text based on language
function updateUILanguage(lang) {
    // Update all elements with a data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update href attributes for links
    document.querySelectorAll('[data-i18n-href]').forEach(element => {
        const key = element.getAttribute('data-i18n-href');
        if (translations[lang][key]) {
            element.href = translations[lang][key];
        }
    });
}

export { translations, updateUILanguage };