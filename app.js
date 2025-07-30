// Wedding RSVP Website JavaScript
// Thiago & Juliana - September 7, 2025

document.addEventListener('DOMContentLoaded', function () {
    emailjs.init('n2MylDf00cBbRnG1P'); // ✅ Initialized only once
    initCountdown();
    initNavigation();
    initRSVPForm();
    initBackToTop();
    initFormConditionals();
    initMapFunctionality();
});

// COUNTDOWN TIMER
function initCountdown() {
    const weddingDate = new Date('2025-09-07T15:30:00').getTime(); // ✅ Set to 3:30 PM

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            updateElement('days', days);
            updateElement('hours', hours);
            updateElement('minutes', minutes);
            updateElement('seconds', seconds);
        } else {
            const countdownContainer = document.querySelector('.countdown');
            if (countdownContainer) {
                countdownContainer.innerHTML = `
                    <div class="countdown__celebration">
                        <span class="countdown__number">🎉</span>
                        <span class="countdown__label">We got married!</span>
                    </div>
                `;
            }
        }
    }

    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toString().padStart(2, '0');
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// NAVIGATION
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    window.addEventListener('scroll', highlightActiveNavLink);
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const navHeight = document.querySelector('.nav').offsetHeight;
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// RSVP
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function initFormConditionals() {
    const confirmationSelect = document.getElementById('confirmacao');
    const guestsGroup = document.getElementById('acompanhantes-group');
    const notesLabel = document.getElementById('observacoes-label');
    const notesField = document.getElementById('observacoes');
    const submitButton = document.querySelector('#rsvp-form button[type="submit"]');

    if (confirmationSelect && guestsGroup) {
        confirmationSelect.addEventListener('change', function () {
            if (this.value === 'Não') {
                guestsGroup.style.display = 'none';
                document.getElementById('acompanhantes').value = '0';
                notesLabel.textContent = 'Leave a message for the couple 💌';
                notesField.placeholder = 'Write your message, wishes or kind words 💖';
                if (submitButton) submitButton.textContent = 'Submit';
            } else if (this.value === 'Sim') {
                guestsGroup.style.display = 'block';
                notesLabel.textContent = 'Dietary restrictions or notes';
                notesField.placeholder = 'E.g., Vegetarian, allergies, etc.';
                if (submitButton) submitButton.textContent = 'Confirm Attendance 💝';
            } else {
                guestsGroup.style.display = 'none';
                notesLabel.textContent = 'Dietary restrictions or notes';
                notesField.placeholder = 'E.g., Vegetarian, allergies, etc.';
                if (submitButton) submitButton.textContent = 'Confirm Attendance 💝';
            }
        });
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');

    if (!validateForm(form)) return;

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending... 💌';
    submitButton.disabled = true;

    const rsvpData = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone') || 'Not provided',
        confirmacao: formData.get('confirmacao'),
        acompanhantes: formData.get('acompanhantes') || '0',
        observacoes: formData.get('observacoes') || 'None',
        timestamp: new Date().toLocaleString('pt-BR'),
        local: 'Qiosque Moana - Barra da Tijuca, RJ',
        data: 'September 7, 2025',
        horarios: 'Ceremony: 3:30 PM | Reception: same location'
    };

    try {
        const result = await emailjs.send('service_8c7kan5', 'template_kwb4w5u', rsvpData);
        console.log('✅ Email sent successfully:', result);
        showConfirmationMessage();
        form.reset();
        initFormConditionals();
    } catch (error) {
        console.error('❌ Error sending RSVP:', error);
        showErrorMessage('An error occurred while sending your RSVP. Please try again or contact us directly.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    form.querySelectorAll('.field-error').forEach(error => error.remove());

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });

    const emailField = form.querySelector('#email');
    if (emailField && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email');
        isValid = false;
    }

    const confirmacao = form.querySelector('#confirmacao').value;
    const acompanhantes = form.querySelector('#acompanhantes').value;

    if (confirmacao === 'Sim' && acompanhantes && acompanhantes.split('\n').length > 5) {
        showFieldError(form.querySelector('#acompanhantes'), 'Maximum of 5 guests allowed');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#c53030';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#c53030';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
}

function showConfirmationMessage() {
    const form = document.getElementById('rsvp-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    const confirmacao = document.getElementById('confirmacao').value;

    if (form && confirmationMessage) {
        let message = '';

        if (confirmacao === 'Não') {
            message = `
                <div class="confirmation-message__icon">💌</div>
                <h3>Message Received!</h3>
                <p>We’ll miss you, but thank you for letting us know. 💌 We hope to see you at another celebration!</p>
                <a href="https://thiagotms1.github.io/listadecasamento/" target="_blank" class="btn btn--primary" style="margin-top: 16px;">
                    🎁 View Wedding Gift List
                </a>
            `;
        } else {
            message = `
                <div class="confirmation-message__icon">✅</div>
                <h3>RSVP Received!</h3>
                <p>Thank you for confirming your attendance. We look forward to seeing you on our big day!</p>
                <p><small>Location: Qiosque Moana - Barra da Tijuca, RJ<br>
                Date: September 7, 2025 (Sunday)<br>
                Ceremony: 3:30 PM | Reception: Same location</small></p>
                <a href="https://thiagotms1.github.io/listadecasamento/" target="_blank" class="btn btn--primary" style="margin-top: 16px;">
                    🎁 View Wedding Gift List
                </a>
            `;
        }

        confirmationMessage.innerHTML = message;
        form.classList.add('hidden');
        confirmationMessage.classList.remove('hidden');
        confirmationMessage.classList.add('fade-in');
        confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showErrorMessage(message) {
    const form = document.getElementById('rsvp-form');
    let errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'error-message';
        errorMessage.className = 'error-message';
        errorMessage.style.cssText = `
            background: #fef2f2;
            border: 2px solid #fecaca;
            color: #dc2626;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
        `;
        form.parentNode.appendChild(errorMessage);
    }

    errorMessage.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 8px;">⚠️</div>
        <p style="margin: 0;">${message}</p>
    `;

    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        if (errorMessage) errorMessage.remove();
    }, 5000);
}

// BACK TO TOP
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            backToTopButton.style.opacity = window.scrollY > 300 ? '1' : '0.7';
            backToTopButton.style.visibility = 'visible';
        });
    }
}

// MAP
function initMapFunctionality() {
    const mapIframe = document.querySelector('.map-container iframe');
    if (mapIframe) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'map-loading';
        loadingIndicator.innerHTML = '📍 Loading map...';
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            font-size: 16px;
            z-index: 10;
        `;

        mapIframe.parentNode.insertBefore(loadingIndicator, mapIframe);

        mapIframe.addEventListener('load', () => {
            setTimeout(() => {
                loadingIndicator.remove();
            }, 1000);
        });
    }
}
