import serverUrl from "./config.js";

const searchBar = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");

document.addEventListener('DOMContentLoaded', function() {
  let email = document.cookie.split('; ').find(row => row.startsWith('user_email=')).split('=')[1];
  email = email.substring(1, email.length - 1)
  console.log(email);
  
    fetch(`${serverUrl}/users/get/${email}`)
      .then(response => response.json())
      .then(data => {
        data.cover_image_url != null ? document.querySelector('.cover-image').src = data.cover_image_url : "https://cellphones.com.vn/sforum/wp-content/uploads/2024/04/anh-bia-facebook-30.jpg";
        data.avatar_url != null ? document.querySelector('.avatar').src = data.avatar_url : "https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg";
        data.name == null ? document.querySelector('.user-name').textContent = "Tên chưa cập nhật" : data.name;
        data.address == null ? document.querySelectorAll('.user-address')[0].innerHTML = "Việt Nam" : data.address;
        data.address == null ? document.querySelectorAll('.user-address')[1].innerHTML = "Việt Nam" : data.address;
        data.phone != null ? document.querySelector('.user-phone').textContent = data.phone : "Chưa cập nhật";
        data.rating != null ? document.querySelector('.star-rating').textContent = `★★★★★ (${data.rating} đánh giá)` : "★★★★★ (10 đánh giá)";
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
