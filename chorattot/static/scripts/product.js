function loadPosts() {
    for (let i = 0; i < 10; i++) {
        document.querySelector(".posts").innerHTML += 
        `
            <a href="#" class="col text-decoration-none">
                <div class="card">
                <img src="https://loremflickr.com/200/200?random=${i}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h6 class="card-title">Hyundai Accent 2024 1.5 AT adasd dasdasd da</h6>
                    <p class="card-text text-danger price">300.000.000 đ</p>
                    <div class="card-text time-address text-secondary d-flex justify-content-between">
                    <span class="time">1 phút trước</span>
                    <span class="address text-truncate">&#x2022;Hồ Chí Minh</span>
                    </div>
                </div>
                </div>
            </a>
        `;
    }
}

loadPosts();
