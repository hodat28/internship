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
    // Loại bỏ lớp active khỏi tất cả các tab
    document.querySelectorAll(".nav-link").forEach(function (tab) {
      tab.classList.remove("active");
    });
    // Thêm lớp active vào tab được chọn
    selectedTab.classList.add("active");

    // Ẩn tất cả nội dung
    document.querySelectorAll(".content").forEach(function (content) {
      content.classList.remove("active");
    });
    // Hiển thị nội dung tương ứng
    document.getElementById(contentId).classList.add("active");
  }