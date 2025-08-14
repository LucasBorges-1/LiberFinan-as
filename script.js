// Simple script for smooth scrolling for non-product links
document.querySelectorAll('a[href^="#"]:not(.product-cta)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Checkout logic
const productCtas = document.querySelectorAll('.product-cta');
const checkoutSection = document.getElementById('checkout');
const productNameEl = document.getElementById('product-name-checkout');
const productPriceEl = document.getElementById('product-price-checkout');
const paymentForm = document.getElementById('payment-form');
const paymentSuccessEl = document.getElementById('payment-success');

productCtas.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();

        // Get product info from data attributes
        const name = button.dataset.product;
        const price = button.dataset.price;

        // Populate checkout section
        productNameEl.textContent = name;
        productPriceEl.textContent = price;
        
        // Reset form view
        paymentForm.style.display = 'flex';
        paymentSuccessEl.classList.add('hidden');
        paymentForm.reset();

        // Show checkout section
        checkoutSection.classList.remove('hidden');

        // Scroll to checkout
        checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Card number formatting
const cardNumberInput = document.getElementById('card-number');
cardNumberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
});

// Expiry date formatting
const expiryInput = document.getElementById('expiry');
expiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Payment form submission simulation
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const inputs = paymentForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.classList.remove('error');
        if (!input.value) {
            isValid = false;
            input.classList.add('error');
        }
    });

    if (isValid) {
        // Hide form, show success message
        paymentForm.style.display = 'none';
        paymentSuccessEl.classList.remove('hidden');
        
        // Play success sound
        playSuccessSound();
    }
});


// WebAudio API for sound
let audioContext;
let successBuffer;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

async function loadSuccessSound() {
    if (!successBuffer) {
        try {
            const response = await fetch('payment-success.mp3');
            const arrayBuffer = await response.arrayBuffer();
            successBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error loading sound:', error);
        }
    }
}

function playSuccessSound() {
    if (!audioContext || !successBuffer) {
        console.log('Audio not ready');
        return;
    }
    const source = audioContext.createBufferSource();
    source.buffer = successBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// Initialize audio on first user interaction (e.g., clicking a CTA)
// This is required by modern browsers to allow audio playback.
document.body.addEventListener('click', () => {
    if (!audioContext) {
        initAudio();
        loadSuccessSound();
    }
}, { once: true });