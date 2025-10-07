document.addEventListener('DOMContentLoaded', function() {
    const portfolioSwiper = new Swiper('.portfolio-swiper', {
        slidesPerView: 1,
        spaceBetween: 40,
        loop: true,
        centeredSlides: false,
        pagination: {
            el: '.portfolio-swiper .swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.portfolio-swiper .swiper-button-next',
            prevEl: '.portfolio-swiper .swiper-button-prev',
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 35
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 40
            },
            1280: {
                slidesPerView: 5,
                spaceBetween: 40
            }
        }
    });

    const teamSwiper = new Swiper('.team-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: false,
        pagination: {
            el: '.team-swiper .swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.team-swiper .swiper-button-next',
            prevEl: '.team-swiper .swiper-button-prev',
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 25
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30
            },
            1280: {
                slidesPerView: 5,
                spaceBetween: 30
            }
        }
    });
});
