document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Scroll Reveal Animation (مع أمان الإظهار)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -20px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // دعم المتصفحات القديمة - إظهار كل شيء فوراً
        revealElements.forEach(el => el.classList.add('active'));
    }

    // احتياط أمان: إظهار كافة العناصر بعد ثانية واحدة لضمان عدم اختفاء أي قسم
    setTimeout(() => {
        revealElements.forEach(el => el.classList.add('active'));
    }, 1000);


    // ==========================================
    // 2. Ripple Effect on Buttons
    // ==========================================
    const rippleButtons = document.querySelectorAll('.ripple');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const circle = document.createElement('span');
            circle.classList.add('ripple-effect');
            circle.style.top = `${y}px`;
            circle.style.left = `${x}px`;
            circle.style.width = circle.style.height = `${Math.max(rect.width, rect.height)}px`;

            const existingRipple = this.querySelector('.ripple-effect');
            if (existingRipple) {
                existingRipple.remove();
            }

            this.appendChild(circle);
        });
    });


    // ==========================================
    // 3. Copy to Clipboard & Toast Notification
    // ==========================================
    const copyButtons = document.querySelectorAll('.btn-copy');
    const toastContainer = document.getElementById('toast-container');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');

            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('تم نسخ الرقم بنجاح');
                    
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>تم النسخ</span>`;
                    btn.style.borderColor = '#10b981';
                    btn.style.color = '#10b981';

                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.borderColor = '';
                        btn.style.color = '';
                    }, 2000);

                }).catch(err => {
                    console.error('فشل النسخ: ', err);
                });
            }
        });
    });

    function showToast(message) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 3000);
    }


    // ==========================================
    // 4. توليد وتحميل الـ QR Code المستقر
    // ==========================================
    const qrContainer = document.getElementById("qrcode");
    const downloadBtn = document.getElementById("download-qr-btn");

    if (qrContainer) {
        qrContainer.innerHTML = '';

        // التأكد من تحميل مكتبة QRCodeStyling
        if (typeof QRCodeStyling !== 'undefined') {
            try {
                const qrCode = new QRCodeStyling({
                    width: 200,
                    height: 200,
                    type: "canvas",
                    data: window.location.href,
                    dotsOptions: {
                        color: "#0a1128",
                        type: "rounded"
                    },
                    backgroundOptions: {
                        color: "#ffffff",
                    }
                });

                qrCode.append(qrContainer);

                if (downloadBtn) {
                    downloadBtn.addEventListener('click', () => {
                        qrCode.download({ name: "Biladuna-QRCode", extension: "png" });
                        showToast('تم تحميل الـ QR Code بنجاح');
                    });
                }
            } catch (err) {
                console.error("خطأ في إنشاء الـ QR Code: ", err);
            }
        }
    }
});
