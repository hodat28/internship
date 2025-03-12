import serverUrl from "./config.js";

const searchBar = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");

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
    const json = await response.json();
    return json;
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
