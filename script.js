// ===== MAIN JAVASCRIPT FILE =====
// Contains all interactive functionality for the website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbarScroll();
    initAnimations();
    initFormValidations();
    initScrollToTop();
    initImageLazyLoading();
    initServiceCards();
    initTooltips();
    initCounters();
    initBackToTopButton();
    
    console.log('EXPRESS Website - Script loaded successfully!');
});

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolling
        if (currentScroll > 50) {
            navbar.classList.add('navbar-scrolled', 'shadow');
        } else {
            navbar.classList.remove('navbar-scrolled', 'shadow');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

// ===== ANIMATIONS ON SCROLL =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add specific animation classes
                if (entry.target.classList.contains('fade-in-up')) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
                if (entry.target.classList.contains('fade-in-left')) {
                    entry.target.style.animation = 'fadeInLeft 0.8s ease forwards';
                }
                if (entry.target.classList.contains('fade-in-right')) {
                    entry.target.style.animation = 'fadeInRight 0.8s ease forwards';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

// ===== FORM VALIDATIONS =====
// ===== FORM VALIDATIONS (ĐÃ SỬA ĐỂ GỬI ĐƯỢC FORMSPREE) =====
function initFormValidations() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // 1. Kiểm tra tính hợp lệ (Validate)
            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Thêm style lỗi của Bootstrap
                this.classList.add('was-validated');
                
                // Cuộn tới trường bị lỗi đầu tiên
                const firstInvalid = this.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    firstInvalid.focus();
                }
            } else {
                // 2. Nếu Form hợp lệ
                
                // --- SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY ---
                
                // Kiểm tra xem đây có phải là form liên hệ không (dựa vào ID hoặc Action)
                const isContactForm = this.id === 'contactForm' || this.action.includes('formspree');

                if (isContactForm) {
                    // Nếu là Contact Form:
                    // Chỉ đổi nút thành "Đang xử lý..." cho đẹp
                    const submitBtn = this.querySelector('button[type="submit"]');
                    if(submitBtn) {
                        submitBtn.innerHTML = '<span class="loading"></span> Đang gửi...';
                        submitBtn.disabled = true;
                    }
                    
                    // KHÔNG DÙNG e.preventDefault() ĐỂ FORM ĐƯỢC GỬI ĐI FORMSPREE
                    // Dữ liệu sẽ bay đi và trang web sẽ chuyển hướng
                    return; 
                }

                // --- HẾT PHẦN SỬA ĐỔI ---

                // Với các form khác (ví dụ form demo khác), giữ nguyên code mô phỏng cũ
                e.preventDefault(); // Chặn gửi thật
                
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<span class="loading"></span> Đang xử lý...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showToast('Thành công!', 'Yêu cầu của bạn đã được gửi thành công.', 'success');
                    this.reset();
                    this.classList.remove('was-validated');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
        
        // Real-time validation (Giữ nguyên)
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
            
            input.addEventListener('blur', function() {
                this.classList.add('touched');
            });
        });
    });
}

// ===== TOAST NOTIFICATIONS =====
function showToast(title, message, type = 'info') {
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    // Add to container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000,
        animation: true
    });
    
    toast.show();
    
    // Remove after hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'btn btn-danger btn-lg scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.style.position = 'fixed';
    scrollBtn.style.bottom = '30px';
    scrollBtn.style.right = '30px';
    scrollBtn.style.zIndex = '999';
    scrollBtn.style.display = 'none';
    scrollBtn.style.width = '50px';
    scrollBtn.style.height = '50px';
    scrollBtn.style.borderRadius = '50%';
    scrollBtn.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
            setTimeout(() => {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.transform = 'scale(1)';
            }, 10);
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'scale(0.8)';
            setTimeout(() => {
                scrollBtn.style.display = 'none';
            }, 300);
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== IMAGE LAZY LOADING =====
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== SERVICE CARDS INTERACTION =====
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        // Click effect
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}

// ===== TOOLTIPS =====
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus'
        });
    });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    const counterElements = document.querySelectorAll('.counter');
    
    if (counterElements.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target.toLocaleString() + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current).toLocaleString();
                        }
                    }, 16);
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counterElements.forEach(counter => {
            observer.observe(counter);
        });
    }
}

// ===== BACK TO TOP BUTTON ENHANCEMENT =====
function initBackToTopButton() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    
    if (scrollBtn) {
        // Add pulse animation every 30 seconds
        setInterval(() => {
            if (window.pageYOffset > 500) {
                scrollBtn.classList.add('pulse');
                setTimeout(() => {
                    scrollBtn.classList.remove('pulse');
                }, 1000);
            }
        }, 30000);
    }
}

// ===== PAGE TRANSITIONS =====
function pageTransition(url) {
    // Add fade out effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// ===== LOADING OVERLAY =====
function showLoadingOverlay(message = 'Đang tải...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.borderWidth = '5px';
    
    const text = document.createElement('p');
    text.textContent = message;
    text.style.marginTop = '20px';
    text.style.color = '#dc3545';
    text.style.fontWeight = '500';
    
    overlay.appendChild(spinner);
    overlay.appendChild(text);
    document.body.appendChild(overlay);
    
    return overlay;
}

function hideLoadingOverlay(overlay) {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchForms = document.querySelectorAll('.search-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm.length < 2) {
                showToast('Thông báo', 'Vui lòng nhập ít nhất 2 ký tự để tìm kiếm.', 'warning');
                return;
            }
            
            // Show loading
            const overlay = showLoadingOverlay('Đang tìm kiếm...');
            
            // Simulate search delay
            setTimeout(() => {
                hideLoadingOverlay(overlay);
                showToast('Tìm kiếm', `Đã tìm thấy kết quả cho: "${searchTerm}"`, 'info');
            }, 1000);
        });
    });
}

// ===== DATE & TIME DISPLAY =====
function updateDateTime() {
    const dateTimeElements = document.querySelectorAll('.current-datetime');
    
    if (dateTimeElements.length > 0) {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const formatted = now.toLocaleDateString('vi-VN', options);
        
        dateTimeElements.forEach(el => {
            el.textContent = formatted;
        });
    }
}

// Update date every second
setInterval(updateDateTime, 1000);
updateDateTime();

// ===== ADDITIONAL STYLES DYNAMICALLY =====
const additionalStyles = `
    .pulse {
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
        100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
    }
    
    .is-valid {
        border-color: #28a745 !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
    }
    
    .touched:invalid {
        border-color: #dc3545;
    }
    
    .navbar-scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    .loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    img:not(.loaded) {
        opacity: 0;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.EXPRESS = {
    showToast,
    showLoadingOverlay,
    hideLoadingOverlay,
    pageTransition,
    initSearch
};
