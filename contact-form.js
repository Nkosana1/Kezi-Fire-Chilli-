// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.btn-submit');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    const formMessage = document.getElementById('formMessage');

    // Form validation
    function validateField(field) {
        const fieldName = field.name;
        const errorElement = document.getElementById(fieldName + 'Error');
        let isValid = true;
        let errorMessage = '';

        // Remove previous error styling
        field.classList.remove('error');

        // Check required fields
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = `${getFieldLabel(fieldName)} is required`;
        }

        // Email validation
        if (fieldName === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation (optional but if provided, should be valid)
        if (fieldName === 'phone' && field.value.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(field.value.trim()) || field.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Display error
        if (!isValid) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
        } else {
            errorElement.textContent = '';
        }

        return isValid;
    }

    function getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    function validateForm() {
        const fields = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        // Also validate optional phone if provided
        const phoneField = form.querySelector('#phone');
        if (phoneField && phoneField.value.trim()) {
            if (!validateField(phoneField)) {
                isFormValid = false;
            }
        }

        return isFormValid;
    }

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide previous messages
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';

        // Validate form
        if (!validateForm()) {
            showMessage('Please correct the errors in the form', 'error');
            return;
        }

        // Disable submit button
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';

        // Collect form data
        const formData = {
            name: form.querySelector('#name').value.trim(),
            email: form.querySelector('#email').value.trim(),
            phone: form.querySelector('#phone').value.trim() || null,
            message: form.querySelector('#message').value.trim()
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                form.reset();
                // Clear all error messages
                document.querySelectorAll('.error-message').forEach(el => {
                    el.textContent = '';
                });
                document.querySelectorAll('.error').forEach(el => {
                    el.classList.remove('error');
                });
            } else {
                showMessage(data.message || 'An error occurred. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    });

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

