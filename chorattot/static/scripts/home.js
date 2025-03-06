import { displayCarousel } from "./carousel.js";
import serverUrl from "./config.js";
import { relativeTimeFromNow } from "./utils.js";

async function loadPosts() {
    const url = `${serverUrl}/post/newpost`;
    const postContainer = document.querySelector(".posts");
    postContainer.innerHTML = "";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        
        json.data.forEach((data) => {
            postContainer.innerHTML += 
            `
                <a href="/product/detail/${data.id}" class="col text-decoration-none">
                    <div class="card">
                    <img src="${data.images.length > 0 && data.images[0].image_url}" class="card-img-top img-thumbnail" alt="product image">
                    <div class="card-body">
                        <h6 class="card-title">${data.title}</h6>
                        <p class="card-text text-danger price">${data.price} đ</p>
                        <div class="card-text time-address text-secondary d-flex justify-content-between">
                        <span class="time">${relativeTimeFromNow(data.created_at)}</span>
                        <span class="address text-truncate">&#x2022;${getCity(data.location)}</span>
                        </div>
                    </div>
                    </div>
                </a>
            `;
        });
    } catch (error) {
        console.error(error.message);
        postContainer.innerHTML = "<h2>Không tìm thấy tin mới nhất!</h2>";
    }
}

function getCity(location) {
    const cityIndex = location.lastIndexOf("Thành phố");
    const provinceIndex = location.lastIndexOf("Tỉnh");
        
    if (cityIndex !== -1 ) {
        return location.substring(cityIndex + 10);
    }
    else if (provinceIndex !== -1) {
        return location.substring(provinceIndex + 5);
    }
    return location;
}

displayCarousel();
loadPosts();
