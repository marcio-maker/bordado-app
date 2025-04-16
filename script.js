document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (mantido)
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.getElementById('navbar');
    
    menuBtn.addEventListener('click', function() {
        navbar.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Smooth scrolling (mantido)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ... (código anterior mantido até a parte do formulário)

// Form submission modernizado
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    // Função para mostrar erros
    const showError = (field, message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.classList.add('invalid');
    };

    // Função para limpar erros
    const clearError = (field) => {
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) errorDiv.remove();
        field.classList.remove('invalid');
    };

    // Validação em tempo real
    const validateField = (field) => {
        clearError(field);
        
        if (!field.value.trim()) {
            showError(field, 'Este campo é obrigatório');
            return false;
        }
        
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            showError(field, 'Por favor, insira um email válido');
            return false;
        }
        
        if (field.type === 'tel' && field.value.replace(/\D/g, '').length < 10) {
            showError(field, 'Telefone deve ter pelo menos 10 dígitos');
            return false;
        }
        
        return true;
    };

}
        
        // Adiciona máscara para telefone
        const phone = document.getElementById('phone');
        if (phone) {
            phone.addEventListener('input', function(e) {
                this.value = this.value.replace(/\D/g, '')
                    .replace(/^(\d{2})(\d)/g, '($1) $2')
                    .replace(/(\d)(\d{4})$/, '$1-$2');
            });
        }
        
        // Validação durante a digitação
        quoteForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
        });
        
        // Envio moderno com fetch
        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Valida todos os campos
            let isValid = true;
            quoteForm.querySelectorAll('input, textarea').forEach(field => {
                if (!validateField(field)) isValid = false;
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }
            
            // Mostra loader
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/submit_quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        details: document.getElementById('details').value
                    })
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    // Feedback visual moderno
                    const successDiv = document.createElement('div');
                    successDiv.className = 'success-message';
                    successDiv.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <p>${data.message}</p>
                    `;
                    quoteForm.parentNode.insertBefore(successDiv, quoteForm);
                    quoteForm.reset();
                    
                    // Remove após 5 segundos
                    setTimeout(() => {
                        successDiv.style.opacity = '0';
                        setTimeout(() => successDiv.remove(), 300);
                    }, 5000);
                } else {
                    alert(data.message || 'Ocorreu um erro. Tente novamente.');
                }
            } catch (error) {
                alert('Erro de conexão. Por favor, tente novamente mais tarde.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Efeito parallax moderno
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    }
    
    // Intersection Observer para animações
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.product-card, .section-title, .contact-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => observer.observe(element));
    };
    
    animateOnScroll();
});
