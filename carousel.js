const images = document.querySelector('.carousel-images');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let index = 0;

nextBtn.addEventListener('click', () => {
    index = (index + 1) % images.children.length;
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    index = (index - 1 + images.children.length) % images.children.length;
    updateCarousel();
});

function updateCarousel() {
    images.style.transform = `translateX(-${index * 100}%)`;
}
