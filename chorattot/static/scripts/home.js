const postsContainer = document.querySelector(".content-container .posts");

const slideIndex = [];

const showSlides = (n, no) => {
    let i;
    let x = document.getElementsByClassName(`product-image-${no}`);
    if (!x.length) return; 

    if (n > x.length) {
        slideIndex[no] = 1;
    }
    if (n < 1) {
        slideIndex[no] = x.length;
    }

    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    x[slideIndex[no] - 1].style.display = "block";
}

const plusSlides = (n, no) => {
    showSlides(slideIndex[no] += n, no);
}

const loadPosts = () => {
    for (let postIndex = 0; postIndex < 7; postIndex++) {
        let img = '';
        for (let imgIndex = 0; imgIndex < 5; imgIndex++) {
            img += `
                <div class="product-image-${postIndex} fade" style="display: none;">
                    <img src="https://loremflickr.com/200/200?random=${imgIndex + 1 + postIndex}" alt="product">
                </div>
            `;
        }

        postsContainer.innerHTML += `
            <div class="post">
                <div class="content">
                    <div class="top">
                        <a href="" class="left-side">
                            <div class="avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-circle-outline</title><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" /></svg>
                            </div>
                            <div class="seller">
                                <div class="name">Nguyen Van A</div>
                                <div class="address">Da Nang, Viet Nam</div>
                            </div>
                        </a>
                        <div class="right-side">
                            <div class="date">18/2/2025</div>
                            <div class="category">&#x2022;Đồ gia dụng</div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="product">
                            <div class="name">Máy giặt Panasonic</div>
                            <div class="price">800,000 VND</div>
                            <div style="font-style: italic;">Mô tả:</div>
                            <ul class="desc">
                                <li>Còn bảo hành</li>
                                <li>Miễn phí lắp đặt</li>
                                <li>Miễn phí lắp đặt</li>
                            </ul>
                        </div>
                        <div class="images">
                            ${img}
                            <a class="prev" onclick="plusSlides(-1, ${postIndex})">&#10094;</a>
                            <a class="next" onclick="plusSlides(1, ${postIndex})">&#10095;</a>
                        </div>
                    </div>
                </div>
                <div class="interact">
                    <button class="message">Nhắn tin</button>
                    <button class="share">Chia sẻ</button>
                </div>
            </div>
        `;

        slideIndex[postIndex] = 1;
        showSlides(1, postIndex);
    }
    
}

loadPosts();
