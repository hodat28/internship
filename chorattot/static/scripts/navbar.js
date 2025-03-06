import serverUrl from "./config.js";

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
  const categories  = await getCategoryList();
  categories.forEach((element) => {
    categoryContainer.innerHTML += `<li><a class="dropdown-item" href="#">${element}</a></li>`;
  });
}


loadCategory();
