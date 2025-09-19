let cropper;

document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('imageUploader').click();
});

document.getElementById('imageUploader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const userImageElement = document.getElementById('userImage');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userImageElement.src = e.target.result;
            userImageElement.style.display = 'block';

            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(userImageElement, {
                aspectRatio: 0.8, // تم تعديلها لتجعل مربع القص بيضاويًا
                viewMode: 1,
                dragMode: 'move', // يسمح بتحريك الصورة
                cropBoxMovable: false, // يمنع تحريك مربع القص
               cropBoxResizable: false, // يمنع تغيير حجم مربع القص
                minCropBoxWidth: 100,
                minCropBoxHeight: 100,
                autoCropArea: 0.8,
                ready: function () {
                    const cropper = this.cropper;
                    
                    // تحديد حجم ومكان مربع القص بشكل ثابت
                    cropper.setCropBoxData({
                        width: 280, // يمكنك تغيير هذا الحجم
                        height: 360, // يمكنك تغيير هذا الحجم
                        left: (cropper.containerData.width - 280) / 2, // تمرير مربع القص أفقيا
                        top: (cropper.containerData.height - 360) / 2 + 10 // تمرير مربع القص عموديا ورفعه قليلا
                    });

                    // يجعل مربع القص دائريًا/بيضاويًا
                    this.cropper.cropBox.querySelector('.cropper-face').style.borderRadius = '50%';
                }
            });

            document.getElementById('downloadButton').style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('downloadButton').addEventListener('click', function() {
    if (cropper) {
        // زيادة الأبعاد هنا لتحسين الجودة
        const finalImageURL = cropper.getCroppedCanvas({
            width: 2000,
            height: 2000,
        }).toDataURL('image/png');

        // الآن يمكنك استخدام finalImageURL لدمجها مع الإطار
        // لدمجها، ستحتاج إلى Canvas جديد
        const finalCanvas = document.createElement('canvas');
        const context = finalCanvas.getContext('2d');
        const frameImage = document.querySelector('.frame-image');

        // يجب أن يكون الكانفاس النهائي بنفس الأبعاد العالية
        finalCanvas.width = 2000;
        finalCanvas.height = 2000;

        const croppedImage = new Image();
        croppedImage.src = finalImageURL;
        croppedImage.onload = function() {
            // رسم الصورة المقصوصة على الكانفاس النهائي
            context.drawImage(croppedImage, 0, 0, finalCanvas.width, finalCanvas.height);
            
            // رسم الإطار فوق الصورة، مع التأكد من أن الإطار يتم رسمه بالحجم الصحيح
            const frameRatio = frameImage.naturalWidth / frameImage.naturalHeight;
            let frameWidth = finalCanvas.width;
            let frameHeight = finalCanvas.height;
            if (finalCanvas.width / finalCanvas.height > frameRatio) {
                frameWidth = finalCanvas.height * frameRatio;
            } else {
                frameHeight = finalCanvas.width / frameRatio;
            }
            context.drawImage(frameImage, (finalCanvas.width - frameWidth) / 2, (finalCanvas.height - frameHeight) / 2, frameWidth, frameHeight);

            // تنزيل الصورة النهائية
            const link = document.createElement('a');
            link.download = 'صورة_العيد_الوطني.png';
            link.href = finalCanvas.toDataURL('image/png');
            link.click();

            addImageToGallery(finalCanvas.toDataURL('image/png'));
        };

    } else {
        alert('الرجاء رفع صورة أولاً.');
    }
});

function addImageToGallery(imageDataURL) {
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const newImage = document.createElement('img');
    newImage.src = imageDataURL;
    newImage.alt = 'صورة مشاركة';

    galleryItem.appendChild(newImage);
    galleryContainer.prepend(galleryItem);
}
