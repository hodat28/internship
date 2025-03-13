import { displayCarousel } from "./carousel.js";
import serverUrl from "./config.js";
import { relativeTimeFromNow, formatMoney, getCity } from "./utils.js";

async function loadPosts() {
    const url = `${serverUrl}/posts/newpost`;
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
    } catch (error) {
        console.error(error.message);
        postContainer.innerHTML = "<h2>Không tìm thấy tin mới nhất!</h2>";
    }
}



displayCarousel();
loadPosts();
