const citySelect = document.querySelector(".modal #select-city");
const districtSelect = document.querySelector(".modal #select-district");
const wardSelect = document.querySelector(".modal #select-ward");
const street = document.querySelector(".modal #street");
const addressSelect = document.querySelector("#select-address");
const titleInput = document.querySelector("#title");
const priceInput = document.querySelector("#price");
const nameInput = document.querySelector("#product-name");
const descInput = document.querySelector("#description");
const form = document.querySelector(".upload-post");

const MAX_IMAGES = 6; // Giới hạn tối đa số ảnh
const imageInput = document.getElementById("image-input");
const imageContainer = document.getElementById("image-container");
const addMoreButton = document.getElementById("add-more-btn");
const hiddenFileInput = document.getElementById("hidden-file-input");
let selectedFiles = new Set(); // Lưu danh sách file đã chọn

let ward = "";
let district = "";
let city = "";
let address = "";

document.getElementById("select-address").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
  document.body.style.overflow = "hidden";
});

document.getElementById("close-modal").addEventListener("click", (e) => {
  document.getElementById("modal").style.display = "none";
  document.body.style.overflow = "auto";
  validateAddress();
  e.preventDefault();
});

document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
  document.body.style.overflow = "auto";
  validateAddress();
});

window.addEventListener("click", function (event) {
  if (event.target === document.getElementById("modal")) {
    document.getElementById("modal").style.display = "none";
    document.body.style.overflow = "auto";
    validateAddress();
  }
});

titleInput.addEventListener("blur", validateTitle);
titleInput.addEventListener("input", validateTitle);

priceInput.addEventListener("blur", validatePrice);
priceInput.addEventListener("input", validatePrice);

nameInput.addEventListener("blur", validateName);
nameInput.addEventListener("input", validateName);

descInput.addEventListener("blur", validateDesc);
descInput.addEventListener("input", validateDesc);

loadProvince();

citySelect.addEventListener("change", () => {
  const provinceCode = citySelect.value;
  if (provinceCode === "0") {
    districtSelect.disabled = true;
    wardSelect.disabled = true;
    districtSelect.innerHTML = `<option value="0">Chọn Quận/Huyện</option>`;
    wardSelect.innerHTML = `<option value="0">Chọn Phường/Xã</option>`;
  } else {
    loadDistrict(provinceCode);
  }
  updateAddressDisplay();
});

districtSelect.addEventListener("change", () => {
  const districtCode = districtSelect.value;
  if (districtCode === "0") {
    wardSelect.disabled = true;
    wardSelect.innerHTML = `<option value="0">Chọn Phường/Xã</option>`;
  } else {
    loadWard(districtCode);
  }
  updateAddressDisplay();
});

wardSelect.addEventListener("change", updateAddressDisplay);
street.addEventListener("input", updateAddressDisplay);

form.addEventListener("submit", (e) => {
  const validName = validateName();
  const validPrice = validatePrice();
  const validTitle = validateTitle();
  const validDesc = validateDesc();
  const validAdd = validateAddress();
  const validImages = validateImages();
  if (!validName || !validPrice || !validTitle || !validDesc || !validAdd || !validImages) {
    e.preventDefault();
  }
});

function validateTitle() {
  if (titleInput.value.trim().length < 2) {
    titleInput.nextElementSibling.innerText = "Vui lòng nhập tiêu đề, ít nhất 2 kí tự!";
    titleInput.style.borderColor = "red";
    return false;
  }
  titleInput.nextElementSibling.innerText = "";
  titleInput.style.borderColor = "var(--green)";
  return true;
}

function validateDesc() {
  if (descInput.value.trim().split(" ").length < 10) {
    descInput.nextElementSibling.innerText = "Vui lòng nhập mô tả, ít nhất 10 từ, tối đa 300 kí tự!";
    descInput.style.borderColor = "red";
    return false;
  }
  descInput.nextElementSibling.innerText = "";
  descInput.style.borderColor = "var(--green)";
  return true;
}

function validatePrice() {
  if (priceInput.value === "" || Number(priceInput.value) < 10000) {
    priceInput.nextElementSibling.innerText = "Vui lòng nhập giá, tối thiểu là 10000!";
    priceInput.style.borderColor = "red";
    return false;
  }
  priceInput.nextElementSibling.innerText = "";
  priceInput.style.borderColor = "var(--green)";
  return true;
}

function validateName() {
  if (nameInput.value.trim().length < 2) {
    nameInput.nextElementSibling.innerText = "Vui lòng nhập tên sản phẩm, ít nhất 2 kí tự!";
    nameInput.style.borderColor = "red";
    return false;
  }
  nameInput.nextElementSibling.innerText = "";
  nameInput.style.borderColor = "var(--green)";
  return true;
}

function validateAddress() {
  if (city.length === 0 || district.length === 0 || ward.length === 0) {
    addressSelect.nextElementSibling.innerText = "Vui lòng chọn địa chỉ!";
    addressSelect.style.borderColor = "red";
    return false;
  }
  addressSelect.nextElementSibling.innerText = "";
  addressSelect.style.borderColor = "var(--green)";
  return true;
}

function validateImages() {
  console.log(selectedFiles);
  if (selectedFiles.size === 0) {
    imageContainer.nextElementSibling.innerText = "Vui lòng tải lên ít nhất một ảnh!";
    imageInput.style.borderColor = "red";
    return false;
  }
  imageContainer.nextElementSibling.innerText = "";
  imageInput.style.borderColor = "var(--green)";
  return true;
}

async function loadProvince() {
  const url = "https://provinces.open-api.vn/api";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    citySelect.innerHTML = `<option value="0">Chọn Tỉnh/Thành phố</option>`;
    json.forEach((element) => {
      citySelect.innerHTML += `<option value="${element.code}">${element.name}</option>`;
    });
  } catch (error) {
    console.error(error.message);
    alert("Lỗi không thể lấy danh sách tỉnh/thành phố!");
  }
}

async function loadDistrict(provinceCode) {
  const url = "https://provinces.open-api.vn/api/d/";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    districtSelect.innerHTML = `<option value="0">Chọn Quận/Huyện</option>`;
    json
      .filter((p) => p.province_code == provinceCode)
      .forEach((element) => {
        districtSelect.innerHTML += `<option value="${element.code}">${element.name}</option>`;
      });

    districtSelect.disabled = false;
    wardSelect.disabled = true;
    wardSelect.innerHTML = `<option value="0">Chọn Phường/Xã</option>`;

    district = "";
    ward = "";
    updateAddressDisplay();
  } catch (error) {
    console.error(error.message);
    alert("Lỗi không thể lấy danh sách quận/huyện!");
  }
}

async function loadWard(districtCode) {
  const url = "https://provinces.open-api.vn/api/w/";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    wardSelect.innerHTML = `<option value="0">Chọn Phường/Xã</option>`;
    json
      .filter((p) => p.district_code == districtCode)
      .forEach((element) => {
        wardSelect.innerHTML += `<option value="${element.code}">${element.name}</option>`;
      });

    wardSelect.disabled = false;
    ward = "";
    updateAddressDisplay();
  } catch (error) {
    console.error(error.message);
    alert("Lỗi không thể lấy danh sách phường/xã!");
  }
}

function updateAddressDisplay() {
  address = street.value.trim();
  city = citySelect.value !== "0" ? citySelect.options[citySelect.selectedIndex].text : "";
  district = districtSelect.value !== "0" ? districtSelect.options[districtSelect.selectedIndex].text : "";
  ward = wardSelect.value !== "0" ? wardSelect.options[wardSelect.selectedIndex].text : "";

  const fullAddress = [address, ward, district, city].filter((part) => part).join(", ");
  addressSelect.innerText = fullAddress || "Chọn địa chỉ";
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
      imageWrapper.classList.add("image-wrapper");

      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-image");

      const removeBtn = document.createElement("button");
      removeBtn.innerText = "×";
      removeBtn.classList.add("remove-btn");
      removeBtn.addEventListener("click", function() {
          imageWrapper.remove();
          selectedFiles.delete(fileKey); // Xóa file khỏi danh sách đã chọn
          updateUI(); // Cập nhật lại giao diện sau khi xóa ảnh
          validateImages();
      });

      imageWrapper.appendChild(img);
      imageWrapper.appendChild(removeBtn);
      imageContainer.appendChild(imageWrapper);
      updateUI();
    };
    reader.readAsDataURL(file);
  }
}

function updateUI() {
  let currentImageCount = imageContainer.children.length;
  if (currentImageCount === 0) {
      addMoreButton.style.display = "none";
      imageInput.style.display = "block"; // Hiện lại "Chọn tệp"
  } else {
      imageInput.style.display = "none"; // Ẩn "Chọn tệp" khi có ảnh
      addMoreButton.style.display = currentImageCount < MAX_IMAGES ? "block" : "none"; // Hiện nút "+" nếu chưa đủ 6 ảnh
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