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
        const finalImageURL = cropper.getCroppedCanvas({
            width: 500,
            height: 500,
        }).toDataURL('image/png');

        const finalCanvas = document.createElement('canvas');
        const context = finalCanvas.getContext('2d');
        const frameImage = document.querySelector('.frame-image');

        finalCanvas.width = frameImage.offsetWidth;
        finalCanvas.height = frameImage.offsetHeight;

        const croppedImage = new Image();
        croppedImage.src = finalImageURL;
        croppedImage.onload = function() {
            context.drawImage(croppedImage, 0, 0, finalCanvas.width, finalCanvas.height);
            context.drawImage(frameImage, 0, 0, finalCanvas.width, finalCanvas.height);

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
