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
    // 4. توليد وتحميل الـ QR Code المدمج بكلمة Biladuna
    // ==========================================
    const qrContainer = document.getElementById("qrcode");
    const downloadBtn = document.getElementById("download-qr-btn");

    if (qrContainer) {
        // تنظيف أي محتوى سابق
        qrContainer.innerHTML = '';

        // 1. توليد الـ QR Code الأساسي
        const qrcode = new QRCode(qrContainer, {
            text: window.location.href,
            width: 220,
            height: 220,
            colorDark : "#0a1128",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        // 2. دمج كلمة Biladuna في المنتصف بعد اكتمال التوليد
        setTimeout(() => {
            const canvas = qrContainer.querySelector('canvas');
            const imgElement = qrContainer.querySelector('img');

            if (canvas) {
                const ctx = canvas.getContext('2d');
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // رسم خلفية الكبسولة في منتصف الـ QR
                ctx.fillStyle = "#001f54"; // لون أزرق داكن نفس لون الهوية
                ctx.strokeStyle = "#ffffff"; // إطار أبيض
                ctx.lineWidth = 3;
                
                const boxWidth = 90;
                const boxHeight = 30;
                const radius = 8;

                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(centerX - boxWidth/2, centerY - boxHeight/2, boxWidth, boxHeight, radius);
                } else {
                    ctx.rect(centerX - boxWidth/2, centerY - boxHeight/2, boxWidth, boxHeight);
                }
                ctx.fill();
                ctx.stroke();

                // كتابة كلمة Biladuna في المنتصف
                ctx.fillStyle = "#90e0ef"; // لون نص أزرق فاتح براق
                ctx.font = "bold 14px Arial, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("Biladuna", centerX, centerY);

                // تحويل الـ Canvas المدمج إلى صورة PNG حقيقية
                const finalImageData = canvas.toDataURL("image/png");

                // تحديث الصورة في الصفحة ليتضمّن النص دائماً
                if (imgElement) {
                    imgElement.src = finalImageData;
                    imgElement.style.display = "block";
                    imgElement.style.margin = "0 auto";
                    canvas.style.display = "none"; // إخفاء الكانفاس وإظهار الصورة النهائية
                }

                // 3. إعداد زر التحميل للصورة المدمجة
                if (downloadBtn) {
                    // إزالة أي مستمعات أحداث سابقة
                    const newBtn = downloadBtn.cloneNode(true);
                    downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);

                    newBtn.addEventListener('click', () => {
                        const link = document.createElement('a');
                        link.href = finalImageData;
                        link.download = 'Biladuna-QRCode.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        showToast('تم تحميل الـ QR Code بنجاح');
                    });
                }
            }
        }, 600); // إعطاء مهلة 600 ملي ثانية لضمان اكتمال بناء الـ QR Code أولاً
    }
