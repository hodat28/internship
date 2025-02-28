const imageLinks = [
  "https://cdn.chotot.com/admincentre/f1V1P5j8Zje-AdlQj1mCDi_iXhE8IF08hR2QMgJlHgM/preset:raw/plain/05cca3a73b31789c414b0592be1787a7-2893641460692669751.jpg",
  "https://cdn.chotot.com/admincentre/XOMVkEuirj7S_Dz8L6BxK8IRdf5rpZ2Y_uIso06W7L0/preset:raw/plain/86004bd119e9d07e376413ebace4373b-2883913672886655493.jpg",
  "https://cdn.chotot.com/admincentre/y1HCh1WF5UpTzwbGSaBUxujd7fdRfb0_2mDcmCHuhO0/preset:raw/plain/7a899bc0a302337f44b20a7160eeaf36-2920006492961784216.jpg",
  "https://cdn.chotot.com/admincentre/npSk7LBNuYPTv5tQhhzQiYhKUjVBSoBgy5nswpcsj_M/preset:raw/plain/39c1698dcea57acc8f6cef15682b7c74-2916808592433388299.jpg",
  "https://cdn.chotot.com/admincentre/pF8CoHNbWdBbXLTn4dCVCrj5AY1Sn_sanBKJjVxrtvA/preset:raw/plain/8e906b0361485a2dd3422018e7fb8992-2904675887129086002.jpg" 
];

export function displayCarousel() {
  const indicator = document.querySelector(".carousel-indicators");
  const imageContainer = document.querySelector(".carousel-inner");

  imageLinks.forEach((link, index) => {
    indicator.innerHTML += 
      `
        <button type="button" data-bs-target="#carousel" data-bs-slide-to="${index}" ${index === 0 ? 'class="active"' : ''}  aria-current="true" aria-label="Slide ${index + 1}"></button>
      `;
      
    imageContainer.innerHTML += 
      `
        <div class="carousel-item ${index === 0 ? 'active' : ''}" data-bs-interval="1000">
        <img
          src=${link}
          class="d-block w-100"
          alt="..."
        />
    </div>
      `;
  })
}
