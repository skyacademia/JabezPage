const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // 안드로이드 아이폰을 검사해 체크
const sectionInfo = [
    {
        // section-1
        multipleValue: 3,
        obj: document.querySelector("#scroll-section-1"),
        values: {
            message1_fadeIn_opacity: [0, 1, { start: 0, end: 0.14 }],
            message1_fadeIn_transform: [10, 0, { start: 0, end: 0.14 }],
            message1_fadeOut_opacity: [1, 0, { start: 0.18, end: 0.32 }],
            message1_fadeOut_transform: [0, -10, { start: 0.18, end: 0.32 }],
            message2_fadeIn_opacity: [0, 1, { start: 0.34, end: 0.48 }],
            message2_fadeIn_transform: [10, 0, { start: 0.34, end: 0.48 }],
            message2_fadeOut_opacity: [1, 0, { start: 0.52, end: 0.66 }],
            message2_fadeOut_transform: [0, -10, { start: 0.52, end: 0.66 }],
        }
    },
    {
        // section-2
        multipleValue: 6,
        obj: document.querySelector("#scroll-section-2"),
        values: {
            message1_fadeIn_opacity: [0, 1, { start: 0, end: 0.07 }],
            message1_fadeIn_transform: [10, 0, { start: 0, end: 0.07 }],
            message1_fadeOut_opacity: [1, 0, { start: 0.09, end: 0.16 }],
            message1_fadeOut_transform: [0, -10, { start: 0.09, end: 0.16 }],
            message2_fadeIn_opacity: [0, 1, { start: 0.18, end: 0.25 }],
            message2_fadeIn_transform: [10, 0, { start: 0.18, end: 0.25 }],
            message2_fadeOut_opacity: [1, 0, { start: 0.27, end: 0.34 }],
            message2_fadeOut_transform: [0, -10, { start: 0.27, end: 0.34 }],
            message3_fadeIn_opacity: [0, 1, { start: 0.36, end: 0.43 }],
            message3_fadeIn_transform: [10, 0, { start: 0.36, end: 0.43 }],
            message3_fadeOut_opacity: [1, 0, { start: 0.45, end: 0.52 }],
            message3_fadeOut_transform: [0, -10, { start: 0.45, end: 0.52 }],
            message4_fadeIn_opacity: [0, 1, { start: 0.54, end: 0.61 }],
            message4_fadeIn_transform: [10, 0, { start: 0.54, end: 0.61 }],
            message4_fadeOut_opacity: [1, 0, { start: 0.63, end: 0.7 }],
            message4_fadeOut_transform: [0, -10, { start: 0.63, end: 0.7 }],
        }
    },
    {
        // section-3
        multipleValue: 1,
        obj: document.querySelector("#scroll-section-3"),
    },
    {
        // section-4
        multipleValue: 0,
        obj: document.querySelector("#scroll-section-4"),
    },
]
const infiniteScrollInfo = {
    id: 1,
    isfetching: true,
}
const youtubeIframeInfo = {
    widthRatio: 16,
    heightRatio: 9,
}
const modal = document.getElementById("myModal");

window.addEventListener("click", function (event) {
    if (event.target == modal) {
        if (modal.classList.contains("d-flex")) {
            modal.classList.remove("d-flex");
        }
        modal.classList.add("d-none");
        event.target.querySelector("iframe").src = "";
        document.body.style.overflow = "auto";
    }
})
modal.querySelector(".modal-content").addEventListener("click", function (event) {
    if (event.target == this) {
        if (modal.classList.contains("d-flex")) {
            modal.classList.remove("d-flex");
        }
        modal.classList.add("d-none");
        event.target.querySelector("iframe").src = "";
        document.body.style.overflow = "auto";
    }
})
let lastScrollTop = 0;

// resize 이벤트 발생 시 iframe의 크기를 조절
function resizeIframe() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const iframe = modal.querySelector("iframe");

    // 데스크탑에서 길이, 높이 변경 시 iframe의 크기를 조절
    if (isMobile != true && (width > height)) {
        const iframeHeight = height * 0.8;
        const iframeWidth = (iframeHeight * youtubeIframeInfo.widthRatio) / youtubeIframeInfo.heightRatio;
        iframe.style.width = iframeWidth + "px";
        iframe.style.height = iframeHeight + "px";
    } else if (isMobile != true && (width < height)) {
        const iframeWidth = width * 0.8;
        const iframeHeight = (iframeWidth * youtubeIframeInfo.heightRatio) / youtubeIframeInfo.widthRatio;
        iframe.style.width = iframeWidth + "px";
        iframe.style.height = iframeHeight + "px";
    }

    // mobile에서 가로, 세로 모드 전환 시 iframe의 크기를 조절
    // 세로 모드일 때
    if (isMobile && window.matchMedia("(orientation: portrait)").matches) {
        const iframeWidth = width * 0.9;
        const iframeHeight = (iframeWidth * youtubeIframeInfo.heightRatio) / youtubeIframeInfo.widthRatio;
        iframe.style.width = iframeWidth + "px";
        iframe.style.height = iframeHeight + "px";
    }
    // 가로 모드일 때
    else if (isMobile && window.matchMedia("(orientation: landscape)").matches) {
        const iframeHeight = height * 0.8;
        const iframeWidth = (iframeHeight * youtubeIframeInfo.widthRatio) / youtubeIframeInfo.heightRatio;
        iframe.style.width = iframeWidth + "px";
        iframe.style.height = iframeHeight + "px";
    }
}

// resize 이벤트 발생 시 section의 높이를 조절
function resizeSection() {
    // section-1, section-2, section-3의 높이 설정
    for (let i = 0; i < sectionInfo.length; i++) {
        if (sectionInfo[i].multipleValue > 0) {
            sectionInfo[i].obj.style.height = `${sectionInfo[i].multipleValue * window.innerHeight}px`;
        }
    }
}

resizeSection();
window.addEventListener("resize", () => {
    resizeSection();
    resizeIframe();
});

// 페이지 처음 로딩 시 이미지를 불러오기 위해 사용
async function preloadImages() {
    // id변수를 활용해서 /api/centerData/로 데이터를 ajax 요청한다.
    if (infiniteScrollInfo.isfetching) {
        const contentArea = document.querySelector("#scroll-section-4").querySelector(".content-area");
        const rowTag = document.createElement("div")
        let animationDelayTime = 0;
        rowTag.classList.add("row");
        rowTag.classList.add("mb-md-3");

        // id변수를 활용해서 /data로 데이터를 ajax 요청한다.
        for (let i = 0; i < 6; i++) {
            if (infiniteScrollInfo.isfetching == false) {
                break;
            }
            const response = await fetch(`/api/memberData/${infiniteScrollInfo.id}`);
            const json = await response.json();
            // 데이터가 빈 배열이면 더이상 데이터를 가져오지 않는다.
            if (json.length === 0) {
                infiniteScrollInfo.isfetching = false;
                return;
            }
            json.forEach((info) => {
                const memberName = info.MemberName;
                const memberYoutubeThumnailPath = info.MemberYoutubeThumbnailLink;
                const memberText = info.MemberText;
                const youtubeLink = info.MemberYoutubeLink;
                const blogLink = info.MemberBlogLink;

                const colTag = document.createElement("div");
                const cardTag = document.createElement("div");
                const cardImageTag = document.createElement("img");
                const cardBodyTag = document.createElement("div");

                const cardTitleTag = document.createElement("h5");
                const cardTextTag = document.createElement("p");
                const cardBlogTag = document.createElement("a");

                colTag.classList.add("col-md-4");
                colTag.classList.add("card-default-setting");
                colTag.classList.add("animation-fadeIn-down-bounce");
                colTag.style.animationDelay = `${animationDelayTime}s`;

                cardTag.classList.add("card");
                cardTag.classList.add("shadow-sm");
                cardTag.classList.add("mb-3");
                cardTag.setAttribute("data-src", `${youtubeLink}`);

                cardImageTag.classList.add("card-img-top");
                cardImageTag.src = `${memberYoutubeThumnailPath}`;
                cardImageTag.style.width = "100%";
                cardImageTag.style.height = `${(cardImageTag.style.width * youtubeIframeInfo.heightRatio) / youtubeIframeInfo.widthRatio}px`;

                cardBodyTag.classList.add("card-body");

                cardTitleTag.classList.add("card-title");
                cardTitleTag.innerText = memberName;

                cardTextTag.classList.add("card-text");
                cardTextTag.innerText = memberText;

                cardBlogTag.setAttribute("href", `${blogLink}`);
                cardBlogTag.setAttribute("target", "_blank");
                cardBlogTag.addEventListener("click", function(event) {
                    event.stopPropagation();
                });
                cardBlogTag.classList.add("btn");
                cardBlogTag.classList.add("btn-outline-primary");
                cardBlogTag.classList.add("btn-sm");
                cardBlogTag.innerHTML = "블로그 보러가기";

                cardBodyTag.appendChild(cardTitleTag);
                cardBodyTag.appendChild(cardTextTag);
                cardBodyTag.appendChild(cardBlogTag);

                cardTag.appendChild(cardImageTag);
                cardTag.appendChild(cardBodyTag);

                cardTag.addEventListener("click", function () {
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    const iframe = modal.querySelector("iframe");
                    // 가로 모드일 때
                    if (width > height) {
                        const iframeHeight = height * 0.8;
                        const iframeWidth = (iframeHeight * youtubeIframeInfo.widthRatio) / youtubeIframeInfo.heightRatio;
                        iframe.style.width = iframeWidth + "px";
                        iframe.style.height = iframeHeight + "px";
                    } else if (width < height) {
                        const iframeWidth = isMobile ? width * 0.9 : width * 0.8;
                        const iframeHeight = (iframeWidth * youtubeIframeInfo.heightRatio) / youtubeIframeInfo.widthRatio;
                        iframe.style.width = iframeWidth + "px";
                        iframe.style.height = iframeHeight + "px";
                    }
                    iframe.src = this.getAttribute("data-src");

                    if (modal.classList.contains("d-none")) {
                        modal.classList.remove("d-none");
                    }
                    modal.classList.add("d-flex");
                    document.body.style.overflow = "hidden";
                });

                colTag.appendChild(cardTag);

                rowTag.appendChild(colTag);

                animationDelayTime += 0.1;
            })
            infiniteScrollInfo.id++;
        }
        //rowTag 내 Coltag가 1개라도 있으면 rowTag를 contentArea에 추가한다.
        if (rowTag.querySelectorAll(".col-md-4").length > 0) {
            contentArea.appendChild(rowTag);
        }
    }
}
window.addEventListener("load", () => {
    preloadImages()
})

function calculateValue(animationValues, scrollInSection, activedSectionHeight) {
    let returnValue = 0;
    const scrollRateInSection = scrollInSection / activedSectionHeight;
    if (animationValues.length == 3) {
        const animationStartPoint = activedSectionHeight * animationValues[2].start;
        const animationEndPoint = activedSectionHeight * animationValues[2].end;
        const scrollInPart = scrollInSection - animationStartPoint;
        const scrollRateInPart = scrollInPart / (animationEndPoint - animationStartPoint);

        if (scrollInSection >= animationStartPoint && scrollInSection <= animationEndPoint) {
            returnValue = scrollRateInPart * (animationValues[1] - animationValues[0]) + animationValues[0];
        }
        else if (scrollInSection < animationStartPoint) {
            returnValue = animationValues[0];
        } else if (scrollInSection > animationEndPoint) {
            returnValue = animationValues[1];
        }
    } else {
        returnValue = scrollRateInSection * (animationValues[1] - animationValues[0]) + animationValues[0];
    }
    return returnValue;
}

function playAnimation(activeSectionIndex, previousHeight) {
    const yoffset = window.scrollY;
    const sectionObj = sectionInfo[activeSectionIndex].obj;
    const sectionValues = sectionInfo[activeSectionIndex].values
    const activeSectionHeight = sectionObj.clientHeight;
    const scrollInSection = yoffset - previousHeight;
    const scrollRateInSection = scrollInSection / activeSectionHeight;
    const textArea = sectionObj.querySelector(".content-area");
    const contentList = textArea.querySelectorAll(".content");

    switch (activeSectionIndex) {
        case 0:
            {
                const message1_fadeIn_opacity_value = calculateValue(sectionValues.message1_fadeIn_opacity, scrollInSection, activeSectionHeight);
                const message1_fadeIn_transition_value = calculateValue(sectionValues.message1_fadeIn_transform, scrollInSection, activeSectionHeight);
                const message1_fadeOut_opacity_value = calculateValue(sectionValues.message1_fadeOut_opacity, scrollInSection, activeSectionHeight);
                const message1_fadeOut_transition_value = calculateValue(sectionValues.message1_fadeOut_transform, scrollInSection, activeSectionHeight);
                const message2_fadeIn_opacity_value = calculateValue(sectionValues.message2_fadeIn_opacity, scrollInSection, activeSectionHeight);
                const message2_fadeIn_transition_value = calculateValue(sectionValues.message2_fadeIn_transform, scrollInSection, activeSectionHeight);
                const message2_fadeOut_opacity_value = calculateValue(sectionValues.message2_fadeOut_opacity, scrollInSection, activeSectionHeight);
                const message2_fadeOut_transition_value = calculateValue(sectionValues.message2_fadeOut_transform, scrollInSection, activeSectionHeight);

                if (scrollRateInSection <= 0.16) {
                    contentList[0].querySelector('.message-1').style.opacity = message1_fadeIn_opacity_value;
                    contentList[0].querySelector('.message-1').style.transform = `translate(0,${message1_fadeIn_transition_value}%)`;
                } else {
                    contentList[0].querySelector('.message-1').style.opacity = message1_fadeOut_opacity_value;
                    contentList[0].querySelector('.message-1').style.transform = `translate(0,${message1_fadeOut_transition_value}%)`;
                }
                if (scrollRateInSection <= 0.50) {
                    contentList[1].querySelector('.message-2').style.opacity = message2_fadeIn_opacity_value;
                    contentList[1].querySelector('.message-2').style.transform = `translate(0,${message2_fadeIn_transition_value}%)`;
                } else {
                    contentList[1].querySelector('.message-2').style.opacity = message2_fadeOut_opacity_value;
                    contentList[1].querySelector('.message-2').style.transform = `translate(0,${message2_fadeOut_transition_value}%)`;
                }
                break;
            }
        case 1:
            {
                const message1_fadeIn_opacity_value = calculateValue(sectionValues.message1_fadeIn_opacity, scrollInSection, activeSectionHeight);
                const message1_fadeIn_transition_value = calculateValue(sectionValues.message1_fadeIn_transform, scrollInSection, activeSectionHeight);
                const message1_fadeOut_opacity_value = calculateValue(sectionValues.message1_fadeOut_opacity, scrollInSection, activeSectionHeight);
                const message1_fadeOut_transition_value = calculateValue(sectionValues.message1_fadeOut_transform, scrollInSection, activeSectionHeight);
                const message2_fadeIn_opacity_value = calculateValue(sectionValues.message2_fadeIn_opacity, scrollInSection, activeSectionHeight);
                const message2_fadeIn_transition_value = calculateValue(sectionValues.message2_fadeIn_transform, scrollInSection, activeSectionHeight);
                const message2_fadeOut_opacity_value = calculateValue(sectionValues.message2_fadeOut_opacity, scrollInSection, activeSectionHeight);
                const message2_fadeOut_transition_value = calculateValue(sectionValues.message2_fadeOut_transform, scrollInSection, activeSectionHeight);
                const message3_fadeIn_opacity_value = calculateValue(sectionValues.message3_fadeIn_opacity, scrollInSection, activeSectionHeight);
                const message3_fadeIn_transition_value = calculateValue(sectionValues.message3_fadeIn_transform, scrollInSection, activeSectionHeight);
                const message3_fadeOut_opacity_value = calculateValue(sectionValues.message3_fadeOut_opacity, scrollInSection, activeSectionHeight);
                const message3_fadeOut_transition_value = calculateValue(sectionValues.message3_fadeOut_transform, scrollInSection, activeSectionHeight);
                const message4_fadeIn_opacity_value = calculateValue(sectionValues.message4_fadeIn_opacity, scrollInSection, activeSectionHeight);
                const message4_fadeIn_transition_value = calculateValue(sectionValues.message4_fadeIn_transform, scrollInSection, activeSectionHeight);
                const message4_fadeOut_opacity_value = calculateValue(sectionValues.message4_fadeOut_opacity, scrollInSection, activeSectionHeight);
                const message4_fadeOut_transition_value = calculateValue(sectionValues.message4_fadeOut_transform, scrollInSection, activeSectionHeight);

                if (scrollRateInSection <= 0.08) {
                    contentList[0].querySelector('.message-1').style.opacity = message1_fadeIn_opacity_value;
                    contentList[0].querySelector('.message-1').style.transform = `translate(0,${message1_fadeIn_transition_value}%)`;
                } else {
                    contentList[0].querySelector('.message-1').style.opacity = message1_fadeOut_opacity_value;
                    contentList[0].querySelector('.message-1').style.transform = `translate(0,${message1_fadeOut_transition_value}%)`;
                }
                if (scrollRateInSection <= 0.26) {
                    contentList[1].querySelector('.message-2').style.opacity = message2_fadeIn_opacity_value;
                    contentList[1].querySelector('.message-2').style.transform = `translate(0,${message2_fadeIn_transition_value}%)`;
                } else {
                    contentList[1].querySelector('.message-2').style.opacity = message2_fadeOut_opacity_value;
                    contentList[1].querySelector('.message-2').style.transform = `translate(0,${message2_fadeOut_transition_value}%)`;
                }
                if (scrollRateInSection <= 0.44) {
                    contentList[2].querySelector('.message-3').style.opacity = message3_fadeIn_opacity_value;
                    contentList[2].querySelector('.message-3').style.transform = `translate(0,${message3_fadeIn_transition_value}%)`;
                } else {
                    contentList[2].querySelector('.message-3').style.opacity = message3_fadeOut_opacity_value;
                    contentList[2].querySelector('.message-3').style.transform = `translate(0,${message3_fadeOut_transition_value}%)`;
                }
                if (scrollRateInSection <= 0.62) {
                    contentList[3].querySelector('.message-4').style.opacity = message4_fadeIn_opacity_value;
                    contentList[3].querySelector('.message-4').style.transform = `translate(0,${message4_fadeIn_transition_value}%)`;
                } else {
                    contentList[3].querySelector('.message-4').style.opacity = message4_fadeOut_opacity_value;
                    contentList[3].querySelector('.message-4').style.transform = `translate(0,${message4_fadeOut_transition_value}%)`;
                }
                break;
            }
    }

}

function findActiveSection() {
    const scrollY = window.scrollY;
    let totalSectionHeight = 0;
    let activeSectionIndex = 0;
    for (let i = 0; i < sectionInfo.length; i++) {
        totalSectionHeight += sectionInfo[i].obj.clientHeight;
        if (scrollY > totalSectionHeight) {
            activeSectionIndex++
        } else if (scrollY <= totalSectionHeight) {
            break;
        }
    }
    return activeSectionIndex;
}

function calculatePriviousHeight(activeSectionIndex) {
    let previousHeight = 0;
    for (let i = 0; i < activeSectionIndex; i++) {
        previousHeight += sectionInfo[i].obj.clientHeight;
    }
    return previousHeight;
}

function controlNavbar() {
    const navbar = document.querySelector(".navbar");
    let scrollTop = document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        navbar.style.top = `-76px`; // 스크롤을 내릴 때 nav를 숨김
    } else {
        navbar.style.top = "0"; // 스크롤을 올릴 때 nav를 보임
    }
    lastScrollTop = scrollTop;
}

document.addEventListener("scroll", () => {
    const activeSectionIndex = findActiveSection();
    const previousHeight = calculatePriviousHeight(activeSectionIndex);
    playAnimation(activeSectionIndex, previousHeight);
    controlNavbar();
});

const intersectionObserverSection3 = new IntersectionObserver((entries, observer) => {
    const [entry] = entries;
    const contentArea = entry.target.querySelector(".content-area");
    const sectionTitle = contentArea.querySelector("h2");
    const buttonDiv = contentArea.querySelector("div");
    let animationDelayTime = 0.1;
    // scroll-section-3이 닿으면 title과 버튼을 보여준다.
    if (entry.isIntersecting) {
        if (sectionTitle.classList.contains("animation-fadeOut-down")) {
            sectionTitle.classList.remove("animation-fadeOut-down");
        }
        sectionTitle.classList.add("animation-fadeIn-down");

        if (buttonDiv.classList.contains("animation-fadeOut-down")) {
            buttonDiv.classList.remove("animation-fadeOut-down");
        }
        buttonDiv.classList.add("animation-fadeIn-down");
        buttonDiv.style.animationDelay = `${animationDelayTime}s`;
    }
    // scroll-section-3에서 벗어나면 title과 버튼을 숨긴다.
    else if (entry.isIntersecting == false) {
        if (sectionTitle.classList.contains("animation-fadeIn-down")) {
            sectionTitle.classList.remove("animation-fadeIn-down");
        }
        sectionTitle.classList.add("animation-fadeOut-down");

        if (buttonDiv.classList.contains("animation-fadeIn-down")) {
            buttonDiv.classList.remove("animation-fadeIn-down");
        }
        buttonDiv.classList.add("animation-fadeOut-down");
    }
})

intersectionObserverSection3.observe(document.querySelector("#scroll-section-3"));



const intersectionObserverSection4 = new IntersectionObserver((entries, observer) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
        const contentArea = entry.target.querySelector(".content-area");
        const sectionTitle = contentArea.querySelector("h2");
        const rows = contentArea.querySelectorAll(".row");
        let animationDelayTime = 0;
        if (sectionTitle.classList.contains("animation-fadeOut-noMove")) {
            sectionTitle.classList.remove("animation-fadeOut-noMove");
        }
        sectionTitle.classList.add("animation-fadeIn-noMove");
        rows.forEach((row) => {
            const cols = row.querySelectorAll(".col-md-4")
            cols.forEach((col) => {
                if (col.classList.contains("animation-fadeOut-down-bounce")) {
                    col.classList.remove("animation-fadeOut-down-bounce");
                }
                if (col.classList.contains("animation-fadeIn-down-bounce") != true) {
                    col.classList.add("animation-fadeIn-down-bounce");
                    col.style.animationDelay = `${animationDelayTime}s`;
                    animationDelayTime += 0.1;
                }
            })
        })
    }
    else if (entry.isIntersecting == false) {
        const contentArea = entry.target.querySelector(".content-area");
        const sectionTitle = contentArea.querySelector("h2");
        const rows = contentArea.querySelectorAll(".row");

        if (sectionTitle.classList.contains("animation-fadeIn-noMove")) {
            sectionTitle.classList.remove("animation-fadeIn-noMove");
            sectionTitle.classList.add("animation-fadeOut-noMove");
        }
        rows.forEach((row) => {
            const cols = row.querySelectorAll(".col-md-4")
            cols.forEach((col) => {
                if (col.classList.contains("animation-fadeIn-down-bounce")) {
                    col.classList.remove("animation-fadeIn-down-bounce");
                    col.classList.add("animation-fadeOut-down-bounce");
                }
            })
        })
    }
})

intersectionObserverSection4.observe(document.querySelector("#scroll-section-4"));

const intersectionObserverUnlimitedScroll = new IntersectionObserver(async (entries, observer) => {
    const [entry] = entries;
    if (entry.isIntersecting && infiniteScrollInfo.isfetching) {
        const contentArea = document.querySelector("#scroll-section-4").querySelector(".content-area");
        const rowTag = document.createElement("div")
        let animationDelayTime = 0;
        rowTag.classList.add("row");
        rowTag.classList.add("mb-md-3");

        // id변수를 활용해서 /data로 데이터를 ajax 요청한다.
        for (let i = 0; i < 3; i++) {
            if (infiniteScrollInfo.isfetching == false) {
                break;
            }
            const response = await fetch(`/api/memberData/${infiniteScrollInfo.id}`);
            const json = await response.json();
            // 데이터가 빈 배열이면 더이상 데이터를 가져오지 않는다.
            if (json.length === 0) {
                infiniteScrollInfo.isfetching = false;
                return;
            }
            json.forEach((info) => {
                const memberName = info.MemberName;
                const memberYoutubeThumnailPath = info.MemberYoutubeThumbnailLink;
                const memberText = info.MemberText;
                const youtubeLink = info.MemberYoutubeLink;
                const blogLink = info.MemberBlogLink;

                const colTag = document.createElement("div");
                const cardTag = document.createElement("div");
                const cardImageTag = document.createElement("img");
                const cardBodyTag = document.createElement("div");

                const cardTitleTag = document.createElement("h5");
                const cardTextTag = document.createElement("p");
                const cardBlogTag = document.createElement("a");

                colTag.classList.add("col-md-4");
                colTag.classList.add("card-default-setting");
                colTag.classList.add("animation-fadeIn-down-bounce");
                colTag.style.animationDelay = `${animationDelayTime}s`;

                cardTag.classList.add("card");
                cardTag.classList.add("shadow-sm");
                cardTag.classList.add("mb-3");
                cardTag.setAttribute("data-src", `${youtubeLink}`);

                cardImageTag.classList.add("card-img-top");
                cardImageTag.src = `${memberYoutubeThumnailPath}`;
                cardImageTag.style.width = "100%";
                cardImageTag.style.height = `${(cardImageTag.style.width * youtubeIframeInfo.heightRatio) / youtubeIframeInfo.widthRatio}px`;

                cardBodyTag.classList.add("card-body");

                cardTitleTag.classList.add("card-title");
                cardTitleTag.innerText = memberName;

                cardTextTag.classList.add("card-text");
                cardTextTag.innerText = memberText;

                cardBlogTag.setAttribute("href", `${blogLink}`);
                cardBlogTag.setAttribute("target", "_blank");
                cardBlogTag.addEventListener("click", function(event) {
                    event.stopPropagation();
                });
                cardBlogTag.classList.add("btn");
                cardBlogTag.classList.add("btn-outline-primary");
                cardBlogTag.classList.add("btn-sm");
                cardBlogTag.innerHTML = "블로그 보러가기";

                cardBodyTag.appendChild(cardTitleTag);
                cardBodyTag.appendChild(cardTextTag);
                cardBodyTag.appendChild(cardBlogTag);

                cardTag.appendChild(cardImageTag);
                cardTag.appendChild(cardBodyTag);

                cardTag.addEventListener("click", function () {
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    const iframe = modal.querySelector("iframe");
                    // 가로 모드일 때
                    if (width > height) {
                        const iframeHeight = height * 0.8;
                        const iframeWidth = (iframeHeight * youtubeIframeInfo.widthRatio) / youtubeIframeInfo.heightRatio;
                        iframe.style.width = iframeWidth + "px";
                        iframe.style.height = iframeHeight + "px";
                    } else if (width < height) {
                        const iframeWidth = isMobile ? width * 0.9 : width * 0.8;
                        const iframeHeight = (iframeWidth * youtubeIframeInfo.heightRatio) / youtubeIframeInfo.widthRatio;
                        iframe.style.width = iframeWidth + "px";
                        iframe.style.height = iframeHeight + "px";
                    }
                    iframe.src = this.getAttribute("data-src");

                    if (modal.classList.contains("d-none")) {
                        modal.classList.remove("d-none");
                    }
                    modal.classList.add("d-flex");
                    document.body.style.overflow = "hidden";
                });

                colTag.appendChild(cardTag);

                rowTag.appendChild(colTag);

                animationDelayTime += 0.1;
            })
            infiniteScrollInfo.id++;
        }
        if (rowTag.querySelectorAll(".col-md-4").length > 0) {
            contentArea.appendChild(rowTag);
        }
        contentArea.appendChild(rowTag);
    }
}, { threshold: 1.0 })



intersectionObserverUnlimitedScroll.observe(document.querySelector("footer"));

