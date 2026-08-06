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

                    // تحميل صورة اللوجو لرسمها في منتصف الـ Canvas
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

                        // 4. تصدير الصورة وتحميلها
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
