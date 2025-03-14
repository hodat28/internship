document.addEventListener('DOMContentLoaded', function() {
  fetch('https://nodejs-cgor.onrender.com/api/admin/users/a@v.com')
    .then(response => response.json())
    .then(data => {
      // Gán dữ liệu vào các phần tử trong trang
      document.querySelector('.star-rating').textContent = Math.round(data.rating)-2;
      document.querySelector('.avatar').src = data.avatar_url;
      document.querySelector('.content-below h4').textContent = data.name;
      document.querySelector('.content-below p').textContent = data.address;
      document.getElementById('phone').textContent = data.phone;
      document.getElementById('email').textContent = `Email: ${data.email}`;
      document.getElementById('address').textContent = `Địa chỉ: ${data.address}`;
      
      // Cập nhật rating dưới dạng sao
      const ratingContainer = document.querySelector('.star-rating');
      ratingContainer.innerHTML = ''; // Xóa các ngôi sao cũ nếu có
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        if (i <= data.rating) {
          star.classList.add('filled'); // Gán class nếu sao đã được đánh giá
        } else {
          star.classList.add('empty'); // Gán class cho sao trống
        }
        ratingContainer.appendChild(star);
      }
    })
    .catch(error => console.error('Error fetching user data:', error));
});
document
    .getElementById("gioi-thieu-tab")
    .addEventListener("click", function (event) {
      event.preventDefault();
      toggleActiveTab(this, "gioi-thieu-content");
    });

document
    .getElementById("danh-gia-tab")
    .addEventListener("click", function (event) {
      event.preventDefault();
      toggleActiveTab(this, "danh-gia-content");
    });

function toggleActiveTab(selectedTab, contentId) {
    document.querySelectorAll(".nav-link").forEach(function (tab) {
      tab.classList.remove("active");
    });

    selectedTab.classList.add("active");

    // Ẩn tất cả nội dung
    document.querySelectorAll(".content").forEach(function (content) {
      content.classList.remove("active");
    });
    // Hiển thị nội dung tương ứng
    document.getElementById(contentId).classList.add("active");
}