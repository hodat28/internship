import serverUrl from "./config.js";
import { getCategoryList } from "./navbar.js";
import { relativeTimeFromNow, formatMoney, getCity } from "./utils.js";

const category = document.querySelector(".category-name");
const categoryPick = document.querySelector(".category-pick");
const minPrice = document.getElementById("min-price");
const maxPrice = document.getElementById("max-price");
const priceText = document.getElementById("price-range-text");
const progress = document.querySelector(".progress");
const minGap = 20000; // Khoảng cách tối thiểu giữa hai giá
const filterButton = document.querySelector(".filter-button");
const params = new URLSearchParams();

init();
minPrice.addEventListener("input", updatePriceRange);
maxPrice.addEventListener("input", updatePriceRange);

filterButton.addEventListener("click", async () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("d-none");

  const minVal = parseInt(minPrice.value);
  const maxVal = parseInt(maxPrice.value); 
  const categoryName = categoryPick.value;
  const orderByTime = document.querySelector("#sort-select").value === "newPost";
  const productStatus = document.querySelector("#status-select").value;
  const location = document.querySelector("#location").value.trim();
  const productName = document.querySelector("#product-name").value.trim();
  
  params.set("location", location);
  params.set("min_price", minVal);
  params.set("max_price", maxVal);
  params.set("newPost", orderByTime);
  params.set("product_status", productStatus);
  params.set("product_name", productName);

  await loadPost(params);

  spinner.classList.add("d-none");

});

function updatePriceRange() {
  let minVal = parseInt(minPrice.value);
  let maxVal = parseInt(maxPrice.value);

  // Khi kéo nút min sát nút max, di chuyển cả max lên
  if (maxVal - minVal < minGap) {
      minPrice.value = maxVal - minGap;
      minVal = parseInt(minPrice.value);
  }

  // Khi kéo nút max sát nút min, giới hạn lại
  if (maxVal - minVal < minGap) {
      maxPrice.value = minVal + minGap;
      maxVal = parseInt(maxPrice.value);
  }

  // Hiển thị giá dạng có dấu phẩy
  priceText.textContent = `${formatMoney(minVal)} - ${formatMoney(maxVal)} VND`;

  // Cập nhật thanh progress
  let minPercent = (minVal / minPrice.max) * 100;
  let maxPercent = (maxVal / maxPrice.max) * 100;
  progress.style.left = minPercent + "%";
    progress.style.width = (maxPercent - minPercent) + "%";
}

async function init() {
  if (category.innerText !== "all") {
    document.title = category.innerText;
  }
  else {
    category.innerText = "Tất cả danh mục";
  }

  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("d-none");

  const categories = await getCategoryList();
  categories.forEach((element) => {
    categoryPick.innerHTML += 
      `
        <li class="nav-item">
          <a class="nav-link ${category === element.name ? 'active' : ''}" aria-current="page" href="/product/filter/${encodeURIComponent(element.name)}">${element.name}</a>
        </li>
      `;
  });

  loadPost();
  updatePriceRange();


  spinner.classList.add("d-none");
}

async function loadPost(params = "", page = "") {
  const url = `${serverUrl}/posts/all?${params}&pageSize=12&categoryName=${category.innerText !== "Tất cả danh mục" ? category.innerText : ''}&page=${page}`;
  const postContainer = document.querySelector(".posts");
  postContainer.innerHTML = "";
  
  // console.log(url);
  try {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const { totalPages, currentPage } = json.data;

    json.data.data.forEach((data) => {
        postContainer.innerHTML += 
        `
            <a href="/product/detail/${data.id}" class="col text-decoration-none">
                <div class="card post">
                <img src="${data.images.length > 0 && data.images[0].image_url}" class="card-img-top img-thumbnail" alt="product image">
                <div class="card-body">
                    <h6 class="card-title">${data.title}</h6>
                    <p class="card-text text-danger price">${formatMoney(Number(data.price))} đ</p>
                    <div class="card-text time-address text-secondary d-flex justify-content-between">
                    <span class="time">${relativeTimeFromNow(data.created_at)}</span>
                    <span class="address text-truncate">&#x2022;${getCity(data.location)}</span>
                    </div>
                </div>
                </div>
            </a>
        `;
    });

    renderPagination(totalPages, currentPage);
  } 
  catch (error) {
    console.error(error.message);
    postContainer.innerHTML = "<h2>Không tìm thấy tin mới nhất!</h2>";
  } 
}

function renderPagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = `
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        ${Array.from({ length: totalPages }, (_, i) => `
          <li class="page-item ${currentPage === i + 1 ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
          </li>
        `).join('')}
        <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  `;

  // Gán sự kiện click cho các nút phân trang
  document.querySelectorAll(".pagination .page-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = e.target.getAttribute("data-page");
      if (page) {
        loadPost(params, page); // Gọi lại API với số trang mới
      }
    });
  });
}


