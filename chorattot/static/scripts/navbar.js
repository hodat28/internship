document.addEventListener('DOMContentLoaded', function() {
    fetch('https://nodejs-latest-yoo9.onrender.com/api/user/get/user1@example.com')
      .then(response => response.json())
      .then(data => {
        // Gán dữ liệu vào các phần tử trong trang
        document.querySelector('.cover-image').src = data.cover_image_url;
        document.querySelector('.avatar').src = data.avatar_url;
        document.querySelector('.content-below h4').textContent = data.name;
        document.querySelector('.content-below p').textContent = data.address;
        document.querySelector('.star-rating').textContent = data.rating;
        // Cập nhật các phần tử khác tương tự
      })
      .catch(error => console.error('Error fetching user data:', error));
  });

