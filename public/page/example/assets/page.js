const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
      },
});
const intersectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.querySelectorAll('.animation-item').forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.remove('animation-fadeOut-down');
                item.classList.add('animation-fadeIn-down');
            });

        } else {
            const target = entry.target;
            target.querySelectorAll('.animation-item').forEach((item, index) => {
                item.classList.remove('animation-fadeIn-down');
                item.classList.add('animation-fadeOut-down');
            });
        }
    });
}, { threshold: [0] });
intersectionObserver.observe(document.querySelector('#section-1'));

const intersectionObserver2 = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;

            target.classList.remove('animation-fadeOut-down');
            target.classList.add('animation-fadeIn-down');
        } else {
            const target = entry.target;
            target.classList.remove('animation-fadeIn-down');
            target.classList.add('animation-fadeOut-down');

        }
    });
}, { threshold: [0] });
document.querySelector('#section-2').querySelectorAll('.animation-item').forEach((item, index) => {
    intersectionObserver2.observe(item);
});
const intersectionObserver3 = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.classList.remove('animation-fadeOut-down');
            target.classList.add('animation-fadeIn-down');
        } else {
            const target = entry.target;
            target.classList.remove('animation-fadeIn-down');
            target.classList.add('animation-fadeOut-down');

        }
    });
}, { threshold: [0] });
document.querySelector('#section-3').querySelectorAll('.animation-item').forEach((item, index) => {
    intersectionObserver3.observe(item);
});
const intersectionObserver4 = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.querySelectorAll('.animation-item').forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.remove('animation-fadeOut-down');
                item.classList.add('animation-fadeIn-down');
            });
        } else {
            const target = entry.target;
            target.querySelectorAll('.animation-item').forEach((item, index) => {
                item.classList.remove('animation-fadeIn-down');
                item.classList.add('animation-fadeOut-down');
            });
        }
    });
}, { threshold: [0] });
intersectionObserver4.observe(document.querySelector('#section-4'));
const intersectionObserver5 = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.classList.remove('animation-fadeOut-down');
            target.classList.add('animation-fadeIn-down');
        } else {
            const target = entry.target;
            target.classList.remove('animation-fadeIn-down');
            target.classList.add('animation-fadeOut-down');
        }
    });
}, { threshold: [0] });
document.querySelector('#section-5').querySelectorAll('.animation-item').forEach((item, index) => {
    intersectionObserver5.observe(item);
});

// 스크롤이 되면 네비게이션바가 나타나거나 사라지게 하는 이벤트
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        navbar.style.transform = 'translateY(-100%)';
        } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
});

// 네비게이션바의 메뉴를 클릭하면 해당 섹션으로 이동하는 이벤트
document.querySelector('.navbar a').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const imageModal = document.querySelector('#imageModal');
imageModal.addEventListener('show.bs.modal', (e) => {
    const target = e.relatedTarget;
    const imageSrc = target.querySelector('img').src;
    const title = target.querySelector('.card-title').textContent;
    const description = target.querySelector('.card-text').textContent;

    const modalTitle = imageModal.querySelector('.modal-body .modal-title');
    const mordalImage = imageModal.querySelector('.modal-body .modal-image img');
    const modalDescription = imageModal.querySelector('.modal-body .modal-description');

    modalTitle.textContent = title;
    mordalImage.src = imageSrc;
    modalDescription.textContent = description;
});
imageModal.addEventListener('hidden.bs.modal', (e) => {
    const modalTitle = imageModal.querySelector('.modal-body .modal-title');
    const mordalImage = imageModal.querySelector('.modal-body .modal-image img');
    const modalDescription = imageModal.querySelector('.modal-body .modal-description');

    modalTitle.textContent = '';
    mordalImage.src = '';
    modalDescription.textContent = '';
});