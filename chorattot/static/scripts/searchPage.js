import serverUrl from "./config.js";
import { relativeTimeFromNow, formatMoney, getCity } from "./utils.js";

loadPosts();

async function loadPosts(page="") {
  const url = `${serverUrl}/posts/all?product_name=${document.querySelector(".keyword").innerText.trim()}&pageSize=12&page=${page}`;
  const postContainer = document.querySelector(".posts");
  postContainer.innerHTML = "";

  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("d-none");

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
  } catch (error) {
    console.error(error.message);
    postContainer.innerHTML = "<h2>Không tìm thấy tin mới nhất!</h2>";
  } finally {
    spinner.classList.add("d-none");
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
        loadPosts(page); // Gọi lại API với số trang mới
      }
    });
  });
}
