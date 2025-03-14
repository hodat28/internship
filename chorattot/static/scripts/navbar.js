import serverUrl from "./config.js";

const searchBar = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");

document.addEventListener('DOMContentLoaded', function() {
  const email = document.cookie.split('; ').find(row => row.startsWith('user_email=')).split('=')[1];
    fetch(`${serverUrl}/user/get/${email}`)
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

searchBar.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.keyCode === 13) {
    navigateSearch();
  }
});

searchBtn.addEventListener("click", navigateSearch);

function navigateSearch() {
  window.location.href = `/product/search?key=${searchBar.value.trim()}`;
}

export async function getCategoryList() {
  const url = `${serverUrl}/categories/names`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    // alert("Lỗi không thể lấy danh mục!");
  }
}

async function loadCategory() {
  const categoryContainer = document.querySelector(".category-container");
  const categories = await getCategoryList();
  categories.forEach((element) => {
    categoryContainer.innerHTML += `<li><a class="dropdown-item" href="/product/filter/${element.name}">${element.name}</a></li>`;
  });
}


loadCategory();
