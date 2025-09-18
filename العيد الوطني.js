document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('imageUploader').click();
});

document.getElementById('imageUploader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const userImageElement = document.getElementById('userImage');
            userImageElement.src = e.target.result;
            userImageElement.style.display = 'block';
            document.getElementById('downloadButton').style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('downloadButton').addEventListener('click', function() {
    const container = document.querySelector(".frame-container");

    html2canvas(container).then(canvas => {
        // إنشاء رابط لتنزيل الصورة
        const link = document.createElement('a');
        link.download = 'صورة_العيد_الوطني.png';
        link.href = canvas.toDataURL();
        link.click();

        // **هنا يتم إضافة الصورة إلى معرض الصور**
        addImageToGallery(canvas.toDataURL('image/png'));
    });
});

// دالة جديدة لإضافة الصورة إلى المعرض
function addImageToGallery(imageDataURL) {
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const newImage = document.createElement('img');
    newImage.src = imageDataURL;
    newImage.alt = 'صورة مشاركة';

    galleryItem.appendChild(newImage);
    galleryContainer.appendChild(galleryItem);
}
