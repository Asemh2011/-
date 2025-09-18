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
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                cropBoxMovable: false,
                cropBoxResizable: false,
                minCropBoxWidth: 100,
                minCropBoxHeight: 100,
                autoCropArea: 1.2,
                ready: function () {
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
        // احصل على الصورة النهائية من Cropper
        const finalImageURL = cropper.getCroppedCanvas({
            width: 500,
            height: 500,
        }).toDataURL('image/png');

        // الآن يمكنك استخدام finalImageURL لدمجها مع الإطار
        // لدمجها، ستحتاج إلى Canvas جديد
        const finalCanvas = document.createElement('canvas');
        const context = finalCanvas.getContext('2d');
        const frameImage = document.querySelector('.frame-image');

        finalCanvas.width = frameImage.offsetWidth;
        finalCanvas.height = frameImage.offsetHeight;

        // رسم الصورة النهائية من Cropper على Canvas
        const croppedImage = new Image();
        croppedImage.src = finalImageURL;
        croppedImage.onload = function() {
            // رسم الصورة في المنتصف وتحديد حجمها
            context.drawImage(croppedImage, (finalCanvas.width * 0.2), (finalCanvas.height * 0.2), (finalCanvas.width * 0.6), (finalCanvas.height * 0.6));

            // رسم الإطار فوق الصورة
            context.drawImage(frameImage, 0, 0, finalCanvas.width, finalCanvas.height);

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
