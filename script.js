document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Scroll Reveal Animation
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => el.classList.add('active'));


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
    // 4. توليد ودمج كلمة Biladuna داخل صورة الـ QR للتحميل
    // ==========================================
    const qrImage = document.getElementById("qr-image");
    const downloadBtn = document.getElementById("download-qr-btn");

    if (qrImage) {
        const currentUrl = encodeURIComponent(window.location.href);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${currentUrl}&color=0a1128&ecc=H`;
        
        qrImage.src = qrUrl;

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                // إنشاء Canvas لدمج الصورة مع كلمة Biladuna
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = qrUrl;

                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // 1. رسم الـ QR Code الأساسي
                    ctx.drawImage(img, 0, 0);

                    // 2. رسم خلفية الكبسولة في المنتصف
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const boxWidth = 170;
                    const boxHeight = 55;
                    const radius = 25;

                    ctx.fillStyle = "#001f54";
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 6;

                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(centerX - boxWidth/2, centerY - boxHeight/2, boxWidth, boxHeight, radius);
                    } else {
                        ctx.rect(centerX - boxWidth/2, centerY - boxHeight/2, boxWidth, boxHeight);
                    }
                    ctx.fill();
                    ctx.stroke();

                    // 3. كتابة كلمة Biladuna داخل الصورة
                    ctx.fillStyle = "#90e0ef";
                    ctx.font = "bold 26px Arial, sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("Biladuna", centerX, centerY);

                    // 4. تحويل الـ Canvas إلى رابط تنزيل مباشر
                    const mergedImageData = canvas.toDataURL("image/png");
                    const link = document.createElement('a');
                    link.href = mergedImageData;
                    link.download = 'Biladuna-QRCode.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    showToast('تم تحميل الـ QR Code بنجاح');
                };
            });
        }
    }
});
