// Authentication JavaScript

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.initializeIcons();
        this.setupEventListeners();
        this.setupPasswordValidation();
        this.setupFormValidation();
    }

    initializeIcons() {
        lucide.createIcons();
    }

    setupEventListeners() {
        // Password toggle functionality
        this.setupPasswordToggle();
        
        // Form submissions
        this.setupFormSubmissions();
        
        // Social login buttons
        this.setupSocialLogin();
    }

    setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('[id^="toggle"]');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const input = button.parentElement.querySelector('input');
                const icon = button.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.setAttribute('data-lucide', 'eye-off');
                } else {
                    input.type = 'password';
                    icon.setAttribute('data-lucide', 'eye');
                }
                
                lucide.createIcons();
            });
        });
    }

    setupPasswordValidation() {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', (e) => {
            this.validatePassword(e.target.value);
        });

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', (e) => {
                this.validatePasswordMatch(passwordInput.value, e.target.value);
            });
        }
    }

    validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password)
        };

        // Update visual indicators
        Object.keys(checks).forEach(check => {
            const element = document.getElementById(`${check}-check`);
            if (element) {
                const icon = element.querySelector('i');
                const isValid = checks[check];
                
                if (isValid) {
                    element.classList.remove('text-gray-400');
                    element.classList.add('text-emerald-500');
                    icon.setAttribute('data-lucide', 'check');
                } else {
                    element.classList.remove('text-emerald-500');
                    element.classList.add('text-gray-400');
                    icon.setAttribute('data-lucide', 'x');
                }
            }
        });

        lucide.createIcons();
        return Object.values(checks).every(check => check);
    }

    validatePasswordMatch(password, confirmPassword) {
        const confirmInput = document.getElementById('confirmPassword');
        if (!confirmInput) return;

        if (confirmPassword && password !== confirmPassword) {
            confirmInput.classList.add('input-error');
            this.showFieldError(confirmInput, 'Passwords do not match');
            return false;
        } else {
            confirmInput.classList.remove('input-error');
            this.hideFieldError(confirmInput);
            return true;
        }
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('input-error')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Password validation
        else if (input.id === 'password') {
            isValid = this.validatePassword(value);
            if (!isValid) {
                errorMessage = 'Password must meet all requirements';
            }
        }
        // Confirm password validation
        else if (input.id === 'confirmPassword') {
            const passwordInput = document.getElementById('password');
            if (passwordInput && value !== passwordInput.value) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            }
        }

        // Update field appearance
        if (isValid) {
            input.classList.remove('input-error');
            input.classList.add('input-success');
            this.hideFieldError(input);
        } else {
            input.classList.remove('input-success');
            input.classList.add('input-error');
            this.showFieldError(input, errorMessage);
        }

        return isValid;
    }

    showFieldError(input, message) {
        this.hideFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert after the input container, not inside it
        const container = input.parentElement;
        const nextElement = container.nextElementSibling;
        if (nextElement) {
            container.parentElement.insertBefore(errorDiv, nextElement);
        } else {
            container.parentElement.appendChild(errorDiv);
        }
    }

    hideFieldError(input) {
        // Look for error message in the parent container
        const container = input.parentElement.parentElement;
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    setupFormSubmissions() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(new FormData(loginForm));
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(new FormData(registerForm));
            });
        }
    }

    async handleLogin(formData) {
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Validate form
        if (!this.validateLoginForm(email, password)) {
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Store login state
            if (remember) {
                localStorage.setItem('rememberLogin', 'true');
            }
            localStorage.setItem('userEmail', email);
            
            // Show success message
            this.showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            this.showNotification('Login failed. Please check your credentials.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleRegister(formData) {
        const submitBtn = document.querySelector('#registerForm button[type="submit"]');
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const terms = formData.get('terms');

        // Validate form
        if (!this.validateRegisterForm(name, email, password, confirmPassword, terms)) {
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Show success message
            this.showNotification('Account created successfully! Please sign in.', 'success');
            
            // Redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            
        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    validateLoginForm(email, password) {
        let isValid = true;
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!email || !this.validateField(emailInput)) {
            isValid = false;
        }
        
        if (!password || !this.validateField(passwordInput)) {
            isValid = false;
        }
        
        return isValid;
    }

    validateRegisterForm(name, email, password, confirmPassword, terms) {
        let isValid = true;
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const termsInput = document.getElementById('terms');
        
        if (!name || !this.validateField(nameInput)) {
            isValid = false;
        }
        
        if (!email || !this.validateField(emailInput)) {
            isValid = false;
        }
        
        if (!password || !this.validateField(passwordInput)) {
            isValid = false;
        }
        
        if (!confirmPassword || !this.validateField(confirmPasswordInput)) {
            isValid = false;
        }
        
        if (!terms) {
            this.showNotification('Please accept the terms and conditions', 'error');
            isValid = false;
        }
        
        return isValid;
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            button.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                </div>
            `;
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            
            // Restore original text based on form
            if (button.closest('#loginForm')) {
                button.textContent = 'Sign In';
            } else if (button.closest('#registerForm')) {
                button.textContent = 'Create Account';
            }
        }
    }

    setupSocialLogin() {
        const socialButtons = document.querySelectorAll('.social-btn, button[class*="border-gray-600"]');
        
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.textContent.trim();
                this.handleSocialLogin(provider);
            });
        });
    }

    handleSocialLogin(provider) {
        this.showNotification(`${provider} login is not implemented yet`, 'info');
    }

    simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, 2000);
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
        
        // Set colors based on type
        switch (type) {
            case 'success':
                notification.classList.add('bg-emerald-600', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-600', 'text-white');
                break;
            case 'info':
                notification.classList.add('bg-blue-600', 'text-white');
                break;
            default:
                notification.classList.add('bg-gray-600', 'text-white');
        }
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        lucide.createIcons();
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
    
    // Check if user is already logged in
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
        // Redirect to dashboard if already logged in
        window.location.href = 'index.html';
    }
});

// Utility functions
function formatEmail(email) {
    return email.toLowerCase().trim();
}

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function validatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return {
        score: strength,
        level: strength < 2 ? 'weak' : strength < 4 ? 'medium' : 'strong'
    };
}