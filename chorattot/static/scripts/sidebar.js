let isExpanded = true;
const toggleButton = document.querySelector(".sidebar .toggle-sidebar");
const toggleIcon = document.querySelector(".sidebar .toggle-sidebar svg");
const sidebar = document.querySelector(".sidebar");
const logo = document.querySelector(".sidebar .logo");

const collapseLink = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Thu nhỏnhỏ</title><path d="M18.41,7.41L17,6L11,12L17,18L18.41,16.59L13.83,12L18.41,7.41M12.41,7.41L11,6L5,12L11,18L12.41,16.59L7.83,12L12.41,7.41Z" /></svg>`;

const expandLink = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Mở rộng</title><path d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z" /></svg>`;

toggleButton.addEventListener("click", () => {
  if (isExpanded === true) {
    document.querySelectorAll(".sidebar .text").forEach(text => {
      text.style.display = 'none';
    });
    isExpanded = false;
    sidebar.classList.add("sidebar-collapse");
    logo.style.width = "50px";
    toggleButton.innerHTML = expandLink;
    toggleButton.style.right = "-30%";
  }
  else {
    document.querySelectorAll(".sidebar .text").forEach(text => {
      text.style.display = 'block';
    });
    isExpanded = true;
    sidebar.classList.remove("sidebar-collapse");
    logo.style.width = "100px";
    toggleButton.innerHTML = collapseLink;
    toggleButton.style.right = "-10%";
  }
});