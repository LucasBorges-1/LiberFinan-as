// Smooth scrolling para links que não sejam botões de compra
document.querySelectorAll('a[href^="#"]:not(.product-cta)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
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
        e.preventDefault(); // impede a âncora de agir antes

        // Pega dados do produto
        const name = button.dataset.product;
        const price = button.dataset.price;

        // Atualiza os campos do checkout
        productNameEl.textContent = name;
        productPriceEl.textContent = price;

        // Reseta o formulário
        paymentForm.reset();
        paymentForm.style.display = 'flex';
        paymentSuccessEl.classList.add('hidden');

        // Mostra a seção do checkout
        checkoutSection.classList.remove('hidden');

        // Rola até o checkout
        checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Formatação número do cartão
const cardNumberInput = document.getElementById('card-number');
cardNumberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value
        .replace(/[^\d]/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
});

// Formatação data de validade
const expiryInput = document.getElementById('expiry');
expiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Simulação envio do pagamento
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
        paymentForm.style.display = 'none';
        paymentSuccessEl.classList.remove('hidden');
        playSuccessSound();
    }
});

// WebAudio API para som
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
            console.error('Erro ao carregar som:', error);
        }
    }
}

function playSuccessSound() {
    if (!audioContext || !successBuffer) {
        console.log('Áudio não carregado');
        return;
    }
    const source = audioContext.createBufferSource();
    source.buffer = successBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

document.body.addEventListener('click', () => {
    if (!audioContext) {
        initAudio();
        loadSuccessSound();
    }
}, { once: true });
