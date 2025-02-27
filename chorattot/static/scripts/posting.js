import { getCategoryList } from "./navbar.js";

const categoryContainer = document.querySelector("#category");
const titleInput = document.querySelector("#title");
const priceInput = document.querySelector("#price");
const nameInput = document.querySelector("#product-name");
const descInput = document.querySelector("#description");
const citySelect = document.querySelector(".city-select");
const districtSelect = document.querySelector(".district-select");
const wardSelect = document.querySelector(".ward-select");
const form = document.querySelector(".upload-post");
const MAX_IMAGES = 6; // Giới hạn tối đa số ảnh
const imageInput = document.getElementById("image-input");
const imageContainer = document.getElementById("image-container");
const addMoreButton = document.getElementById("add-more-btn");
const hiddenFileInput = document.getElementById("hidden-file-input");
let selectedFiles = new Set(); // Lưu danh sách file đã chọn

loadCategory();
loadProvince();

citySelect.addEventListener("change", () => {
  loadDistrict(citySelect.value);
});

districtSelect.addEventListener("change", () => {
  loadWard(districtSelect.value);
});

async function loadCategory() {
  const categories = await getCategoryList();
  categories.forEach((category) => {
    categoryContainer.innerHTML += 
      `
        <option value="${category}">${category}</option>
      `;
  });
}

form.addEventListener("submit", e => {
  const validName = validateName();
  const validPrice = validatePrice();
  const validTitle = validateTitle();
  const validDesc = validateDesc();
  const validImages = validateImages();

  if (!validName || !validPrice || !validTitle || !validDesc || !validImages) {
    e.preventDefault();
  }
});

titleInput.addEventListener("change", validateTitle);
nameInput.addEventListener("change", validateName);
descInput.addEventListener("change", validateDesc);
priceInput.addEventListener("change", validatePrice);

async function loadProvince() {
  const url = "https://provinces.open-api.vn/api";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    json.forEach((element) => {
      citySelect.innerHTML += `<option value="${element.code}">${element.name}</option>`;
    });
    await loadDistrict(citySelect.value);
  } catch (error) {
    console.error(error.message);
    alert("Lỗi không thể lấy danh sách tỉnh/thành phố!");
  }
}

async function loadDistrict(provinceCode) {
  const url = "https://provinces.open-api.vn/api/d/";
  districtSelect.innerHTML = "";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    json
      .filter((p) => p.province_code == provinceCode)
      .forEach((element) => {
        districtSelect.innerHTML += `<option value="${element.code}">${element.name}</option>`;
      });
    await loadWard(districtSelect.value)
  } catch (error) {
    console.error(error.message);
    alert("Lỗi không thể lấy danh sách quận/huyện!");
  }
}

async function loadWard(districtCode) {
  const url = "https://provinces.open-api.vn/api/w/";
  wardSelect.innerHTML = "";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    json
      .filter((p) => p.district_code == districtCode)
      .forEach((element) => {
        wardSelect.innerHTML += `<option value="${element.code}">${element.name}</option>`;
      });
  } catch (error) {
    console.error(error.message);
    alert("Lỗi không thể lấy danh sách phường/xã!");
  }
}

function validateTitle() {
  if (titleInput.value.trim().length < 5) {
    titleInput.nextElementSibling.nextElementSibling.classList.add("d-block");
    return false;
  }
  titleInput.nextElementSibling.nextElementSibling.classList.remove("d-block");
  return true;
}

function validateDesc() {
  if (descInput.value.trim().length < 10) {
    descInput.nextElementSibling.nextElementSibling.classList.add("d-block");
    return false;
  }
  descInput.nextElementSibling.nextElementSibling.classList.remove("d-block");
  return true;
}

function validatePrice() {
  if (priceInput.value === "" || Number(priceInput.value) < 10000) {
    priceInput.nextElementSibling.nextElementSibling.classList.add("d-block");
    return false;
  }
  priceInput.nextElementSibling.nextElementSibling.classList.remove("d-block");
  return true;
}

function validateName() {
  if (nameInput.value.trim().length < 2) {
    nameInput.nextElementSibling.nextElementSibling.classList.add("d-block");
    return false;
  }
  priceInput.nextElementSibling.nextElementSibling.classList.remove("d-block");
  return true;
}

function validateImages() {
  console.log(selectedFiles.size);
  if (selectedFiles.size < 2) {
    imageInput.classList.add("is-invalid");
    return false;
  }
  imageInput.classList.remove("is-invalid");
  return true;
}

function handleFiles(files) {
  let newFilesAdded = false;
  let currentImageCount = imageContainer.children.length;
  let filesToProcess = Array.from(files).slice(0, MAX_IMAGES - currentImageCount); // Chỉ lấy số lượng vừa đủ

  for (const file of filesToProcess) {
    if (!file.type.startsWith("image/")) continue; // Chỉ nhận file ảnh
    const fileKey = file.name + file.size; // Tạo key duy nhất cho file
    if (selectedFiles.has(fileKey)) continue; // Bỏ qua file đã chọn

    selectedFiles.add(fileKey);
    newFilesAdded = true;

    const reader = new FileReader();
    reader.onload = function(e) {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("image-wrapper", "me-3");

      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-image");

      const removeBtn = document.createElement("button");
      removeBtn.innerText = "×";
      removeBtn.classList.add("remove-btn", "btn", "btn-danger", "position-absolute", "top-0", "right-0", "z-1", "p-0");
      removeBtn.addEventListener("click", function() {
          imageWrapper.remove();
          selectedFiles.delete(fileKey); // Xóa file khỏi danh sách đã chọn
          updateUI(); // Cập nhật lại giao diện sau khi xóa ảnh
          validateImages();
      });

      imageWrapper.appendChild(removeBtn);
      imageWrapper.appendChild(img);
      imageContainer.appendChild(imageWrapper);
      updateUI();
    };
    reader.readAsDataURL(file);
  }
}

function updateUI() {
  let currentImageCount = imageContainer.children.length;
  if (currentImageCount === 0) {
      addMoreButton.classList.add("d-none");
      imageInput.classList.remove("d-none"); // Hiện lại "Chọn tệp"
  } else {
      imageInput.classList.add("d-none"); // Ẩn "Chọn tệp" khi có ảnh
      if (currentImageCount < MAX_IMAGES) {
        addMoreButton.classList.remove("d-none");
      }
      else {
        addMoreButton.classList.add("d-none");
      }
      // addMoreButton.style.display = currentImageCount < MAX_IMAGES ? "block" : "none"; // Hiện nút "+" nếu chưa đủ 6 ảnh
  }
}

imageInput.addEventListener("change", function(event) {
  handleFiles(event.target.files);
  imageInput.value = ""; // Cho phép chọn lại cùng file
  validateImages();
});

hiddenFileInput.addEventListener("change", function(event) {
  handleFiles(event.target.files);
  hiddenFileInput.value = "";
  validateImages();
});

addMoreButton.addEventListener("click", function() {
  hiddenFileInput.click();
});
