const menuContainer = document.querySelector(".header-container .menu-container");
const menuButton = document.querySelector(".header-container .menu-container button");
const normalMenu = document.querySelector(".header-container .menu-container .dropdown-content");
const smallMenu = document.querySelector(".header-container .menu-container .mobile-content");

let isMenuOpen = false;

const openMenu = () => {
  const isInSmallScreen = window.matchMedia("(max-width: 1024px)");
  if (isInSmallScreen.matches) { 
    smallMenu.style.display = "block";
  } else {
    normalMenu.style.display = "block";
  }
  isMenuOpen = true;
};

const closeMenu = () => {
  isMenuOpen = false;
  normalMenu.style.display = "none";
  smallMenu.style.display = "none";
};

menuContainer.addEventListener("click", () => {
  if (isMenuOpen) {
    closeMenu();
  }
  else {
    openMenu();
  }
});