import serverUrl from "./config.js";
import { relativeTimeFromNow, formatMoney } from "./utils.js";

const productId = document.querySelector(".product-id").innerText;
let isPhoneDisplay = false;
let phone = "";

console.log(productId);
loadDetail();

async function loadDetail() {
  const url = `${serverUrl}/posts/${productId}`;
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("d-none");

  try {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const imagesContainer = document.querySelector(".carousel-inner");
    const thumbnailsContainer = document.querySelector("#product-thumbnails");
    
    document.title = json.data.title;
    document.querySelector(".title").innerText = json.data.title;
    document.querySelector(".name").innerText = json.data.product_name;
    document.querySelector(".price").innerText = formatMoney(Number(json.data.price)) + " đ";
    document.querySelector(".category-status .category").innerText = json.data.Category.name;
    document.querySelector(".category-status .category").href = `/product/filter/${json.data.Category.name}`;
    document.querySelector(".category-status .status").innerText = json.data.product_status;
    document.querySelector(".location").innerText = json.data.location;
    document.querySelector(".update-at").innerText = `Cập nhật ${relativeTimeFromNow(json.data.updated_at)}`;
    document.querySelector(".seller-avatar").src = json.data.User.UserInfo.avatar_url;
    document.querySelector(".seller-name").innerText = json.data.User.UserInfo.name;
    document.querySelector(".rating").innerText = json.data.User.UserInfo.rating;
    document.querySelector(".description").innerText = json.data.description;

    phone = json.data.User.UserInfo.phone; 

    document.querySelector(".btn-phone span").innerText = phone.substring(0, phone.length - 4) + "****";

    json.data.images.forEach((img, index) => {
      imagesContainer.innerHTML += 
      `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${img.image_url}" class="d-block" alt="...">
        </div>
      `;

      thumbnailsContainer.innerHTML += 
      `
        <img src="${img.image_url}" class="thumbnail ${index === 0 ? 'active-thumbnail' : ''}" 
          data-bs-target="#product-images" data-bs-slide-to="${index}" onclick="changeSlide(${index})">
      `;
    });
    
  } catch (error) {
      console.error(error.message);
  } finally {
    spinner.classList.add("d-none");
  }
  
}

window.changeSlide = function(index) {
  const carousel = new bootstrap.Carousel(document.querySelector("#product-images"));
  carousel.to(index);

  // Đổi active thumbnail
  document.querySelectorAll(".thumbnail").forEach(img => img.classList.remove("active-thumbnail"));
  document.querySelectorAll(".thumbnail")[index].classList.add("active-thumbnail");
};

document.querySelector(".btn-phone").addEventListener("click", () => {
  if (!isPhoneDisplay) {
    document.querySelector(".btn-phone span").innerText = phone;
    isPhoneDisplay = true;
  }
});
