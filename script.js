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
    // 4. توليد ودمج صورة اللوجو داخل الـ QR للتحميل
    // ==========================================
    const qrImage = document.getElementById("qr-image");
    const downloadBtn = document.getElementById("download-qr-btn");

    if (qrImage) {
        const currentUrl = encodeURIComponent(window.location.href);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${currentUrl}&color=0a1128&ecc=H`;
        
        qrImage.src = qrUrl;

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const imgQr = new Image();
                const imgLogo = new Image();
                
                imgQr.crossOrigin = "anonymous";
                imgLogo.crossOrigin = "anonymous";
                
                imgQr.src = qrUrl;

                imgQr.onload = () => {
                    canvas.width = imgQr.width;
                    canvas.height = imgQr.height;

                    // 1. رسم الـ QR Code الأساسي
                    ctx.drawImage(imgQr, 0, 0);

                    // 2. تحميل صورة اللوجو لرسمها في منتصف الـ Canvas
                    imgLogo.src = 'logo.png';
                    imgLogo.onload = () => {
                        const centerX = canvas.width / 2;
                        const centerY = canvas.height / 2;
                        const logoSize = 110; // حجم اللوجو في الصورة المحملة

                        // رسم خلفية دائريّة بيضاء خلف اللوجو
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, logoSize / 2 + 6, 0, Math.PI * 2);
                        ctx.fillStyle = "#ffffff";
                        ctx.fill();
                        ctx.lineWidth = 4;
                        ctx.strokeStyle = "#001f54";
                        ctx.stroke();

                        // رسم اللوجو داخل الدائرة
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(imgLogo, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);
                        ctx.restore();

                        // 3. تصدير الصورة وتحميلها
                        const mergedImageData = canvas.toDataURL("image/png");
                        const link = document.createElement('a');
                        link.href = mergedImageData;
                        link.download = 'Biladuna-QRCode.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        showToast('تم تحميل الـ QR Code بنجاح');
                    };

                    // في حال تعذر تحميل صورة اللوجو يتم التحميل بدونها
                    imgLogo.onerror = () => {
                        const mergedImageData = canvas.toDataURL("image/png");
                        const link = document.createElement('a');
                        link.href = mergedImageData;
                        link.download = 'Biladuna-QRCode.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    };
                };
            });
        }
    }
});
