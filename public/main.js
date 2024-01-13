const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // 안드로이드 아이폰을 검사해 체크
const sectionInfo = [
    {
        // section-1
        multipleValue: isMobile ? 6 : 3,
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
        multipleValue: isMobile ? 6 : 3,
        obj: document.querySelector("#scroll-section-2"),
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
        // section-3
        multipleValue: 1.5,
        obj: document.querySelector("#scroll-section-3"),
    },
    {
        // section-4
        multipleValue: 0,
        obj: document.querySelector("#scroll-section-4"),
    },
]
const messageInfo = [
    {
        // section-1
        obj: [document.querySelector("#scroll-section-1").querySelectorAll(".content")[0],
            document.querySelector("#scroll-section-1").querySelectorAll(".content")[1]
        ],
        values: {
            message1_fadeIn: { start: 0, end: 0.14 },
            message1_fadeOut: { start: 0.18, end: 0.32 },
            message2_fadeIn: { start: 0.54, end: 0.68 },
            message2_fadeOut: { start: 0.72, end: 0.86 },
        }

    },
    {
        // section-2
        obj: [document.querySelector("#scroll-section-2").querySelectorAll(".content")[0],
            document.querySelector("#scroll-section-2").querySelectorAll(".content")[1]],
        values: {
            message1_fadeIn: { start: 0, end: 0.14 },
            message1_fadeOut: { start: 0.18, end: 0.32 },
            message2_fadeIn: { start: 0.54, end: 0.68 },
            message2_fadeOut: { start: 0.72, end: 0.86 },
        }

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
const touchInfo = {
    startY: 0,
    endY: 0,
}

const modal = document.getElementById("myModal");
let currentDivIndex = 0;


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

function createElement(tagName, attributes, children) {
    const element = document.createElement(tagName);
    for (const key in attributes) {
        if (key === 'classList') {
            attributes[key].forEach(className => element.classList.add(className));
        } else if (key === 'style') {
            for (const styleKey in attributes[key]) {
                element.style[styleKey] = attributes[key][styleKey];
            }
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }
    (children || []).forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}

async function fetchData(id) {
    try {
        const response = await fetch(`/api/memberData/${id}`);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Failed to fetch data', error);
        return [];
    }
}

function createCard(info,rowTag,id) {
    // 카드 생성 로직
        const memberYoutubeTitle = info.MemberYoutubeTitle;
        const memberYoutubeThumnailPath = info.MemberYoutubeThumbnailLink;
        const memberText = info.MemberText;
        const youtubeLink = info.MemberYoutubeLink;

        const colTag = createElement('div', {
            classList: ['col-md-4', 'card-default-setting', 'animation-fadeIn-down-bounce'],
            style: { animationDelay: `${(id%3>0 ? id%3 : 3) * 0.1}s` }
        });
    
        const cardTag = createElement('div', { classList: ['card', 'shadow-sm', 'mb-3'], 'data-src': youtubeLink });
        const cardImageTag = createElement('img', { src: memberYoutubeThumnailPath, classList: ['card-img-top'], style: { width: '100%', height: '14.5rem' } });
        const cardBodyTag = createElement('div', { classList: ['card-body'] });
    
        const cardTitleTag = createElement('h5', { classList: ['card-title'] }, [memberYoutubeTitle]);

        cardBodyTag.appendChild(cardTitleTag);
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
}

async function loadAndCreateCards(id,rowTag) {
    const json = await fetchData(id);

    // 데이터가 빈 배열이면 더이상 데이터를 가져오지 않는다.
    if (json.length === 0) {
        infiniteScrollInfo.isfetching = false;
        return;
    }

    json.forEach((info) => {
        createCard(info,rowTag,id);
    });
}

// 페이지 처음 로딩 시 이미지를 불러오기 위해 사용
async function preloadImages() {
    // id변수를 활용해서 /api/centerData/로 데이터를 ajax 요청한다.
    if (infiniteScrollInfo.isfetching) {
        const contentArea = document.querySelector("#scroll-section-4").querySelector(".content-area");
        const rowTag = createElement('div', {
            classList: ['row', 'mb-md-3']
        });

        // id변수를 활용해서 /data로 데이터를 ajax 요청한다.
        for (let i = 0; i < 6; i++) {
            if (infiniteScrollInfo.isfetching == false) {
                break;
            }
            await loadAndCreateCards(infiniteScrollInfo.id,rowTag);
            infiniteScrollInfo.id++;
        }
        //rowTag 내 Coltag가 1개라도 있으면 rowTag를 contentArea에 추가한다.
        if (rowTag.querySelectorAll(".col-md-4").length > 0) {
            contentArea.appendChild(rowTag);
        }
    }
}

history.scrollRestoration = "manual";
window.addEventListener("load", (e) => {
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
                    contentList[0].style.opacity = message1_fadeIn_opacity_value;
                    contentList[0].style.transform = `translate(0,${message1_fadeIn_transition_value}%)`;
                } else {
                    contentList[0].style.opacity = message1_fadeOut_opacity_value;
                    contentList[0].style.transform = `translate(0,${message1_fadeOut_transition_value}%)`;
                }
                if (scrollRateInSection <= 0.50) {
                    contentList[1].style.opacity = message2_fadeIn_opacity_value;
                    contentList[1].style.transform = `translate(0,${message2_fadeIn_transition_value}%)`;
                } else {
                    contentList[1].style.opacity = message2_fadeOut_opacity_value;
                    contentList[1].style.transform = `translate(0,${message2_fadeOut_transition_value}%)`;
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
                if (scrollRateInSection <= 0.16) {
                    contentList[0].style.opacity = message1_fadeIn_opacity_value;
                    contentList[0].style.transform = `translate(0,${message1_fadeIn_transition_value}%)`;
                } else {
                    contentList[0].style.opacity = message1_fadeOut_opacity_value;
                    contentList[0].style.transform = `translate(0,${message1_fadeOut_transition_value}%)`;
                }
                if (scrollRateInSection <= 0.50) {
                    contentList[1].style.opacity = message2_fadeIn_opacity_value;
                    contentList[1].style.transform = `translate(0,${message2_fadeIn_transition_value}%)`;
                } else {
                    contentList[1].style.opacity = message2_fadeOut_opacity_value;
                    contentList[1].style.transform = `translate(0,${message2_fadeOut_transition_value}%)`;
                }
                break;
            }
    }
}

function handleAnimation(message, addAnimation, removeAnimation) {
    if (message.classList.contains(removeAnimation)) {
        message.classList.remove(removeAnimation);
    }
    if(message.classList.contains(addAnimation) != true){
        message.classList.add(addAnimation);
    }
}

function playMobileAnimation(activeSectionIndex, previousHeight, direction) {
    const yoffset = window.scrollY;
    const sectionObj = sectionInfo[activeSectionIndex].obj;
    const activeSectionHeight = sectionObj.clientHeight;
    const scrollInSection = yoffset - previousHeight;
    const scrollRateInSection = scrollInSection / activeSectionHeight;
    switch (activeSectionIndex) {
        case 0:
            {
                const messageInSection = messageInfo[0];
                const message1 = messageInSection.obj[0];
                const message2 = messageInSection.obj[1];
                const animationValues = messageInSection.values;
                if (0.05<scrollRateInSection && scrollRateInSection <= animationValues.message1_fadeIn.end) {
                    if(direction == 1){
                        handleAnimation(message1,"animation-fadeIn-down","animation-fadeOut-down");
                    }else if(direction == 0){
                        handleAnimation(message1,"animation-fadeOut-down","animation-fadeIn-down");
                    }
                } else if (animationValues.message1_fadeOut.start<=scrollRateInSection && scrollRateInSection<= animationValues.message1_fadeOut.end) {
                    if(direction == 1){
                        handleAnimation(message1,"animation-fadeOut-down","animation-fadeIn-down");
                    }else if(direction == 0){
                        handleAnimation(message1,"animation-fadeIn-down","animation-fadeOut-down");
                    }
                }
                if (animationValues.message1_fadeOut.end<scrollRateInSection && scrollRateInSection<animationValues.message2_fadeIn.start) {
                    if(direction == 1){
                        handleAnimation(message2,"animation-fadeIn-down","animation-fadeOut-down");
                    }else if(direction == 0){
                        handleAnimation(message2,"animation-fadeOut-down","animation-fadeIn-down");
                    }
                }
                else if (animationValues.message2_fadeIn.start<=scrollRateInSection && scrollRateInSection<= animationValues.message2_fadeIn.end) {
                    if(direction == 1){
                        handleAnimation(message2,"animation-fadeIn-down","animation-fadeOut-down");
                    } else if(direction == 0){
                        handleAnimation(message2,"animation-fadeOut-down","animation-fadeIn-down");
                    }
                } else if(animationValues.message2_fadeOut.start<=scrollRateInSection && scrollRateInSection<= animationValues.message2_fadeOut.end ) {
                    if(direction == 1){
                        handleAnimation(message2,"animation-fadeOut-down","animation-fadeIn-down");
                    }else if(direction==0){
                        handleAnimation(message2,"animation-fadeIn-down","animation-fadeOut-down");
                    }
                }
                if(scrollRateInSection>animationValues.message2_fadeOut.end){
                    messageInSection.obj.forEach((message) => {
                        if (message.classList.contains("animation-fadeIn-down")) {
                            message.classList.remove("animation-fadeIn-down");
                        }
                    });
                }
                break;
            }
        case 1:
            {
                const messageInSection = messageInfo[1];
                const message1 = messageInSection.obj[0];
                const message2 = messageInSection.obj[1];
                const animationValues = messageInSection.values;
                if (0.05<scrollRateInSection && scrollRateInSection <= animationValues.message1_fadeIn.end) {
                    if(direction == 1){
                        handleAnimation(message1,"animation-fadeIn-down","animation-fadeOut-down");
                    }else if(direction == 0){
                        handleAnimation(message1,"animation-fadeOut-down","animation-fadeIn-down");
                    }
                } else if (animationValues.message1_fadeOut.start<=scrollRateInSection && scrollRateInSection<= animationValues. message1_fadeOut.end) {
                    if(direction == 1 && message1.style){
                        handleAnimation(message1,"animation-fadeOut-down","animation-fadeIn-down");
                    }else if(direction == 0){
                        handleAnimation(message1,"animation-fadeIn-down","animation-fadeOut-down");
                    }
                }
                if (animationValues.message1_fadeOut.end<scrollRateInSection && scrollRateInSection<= animationValues.message2_fadeIn.start) {
                    if(direction == 1){
                        handleAnimation(message2,"animation-fadeIn-down","animation-fadeOut-down");
                    }else if(direction == 0){
                        handleAnimation(message2,"animation-fadeOut-down","animation-fadeIn-down");
                    }
                }
                else if (animationValues.message2_fadeIn.start<=scrollRateInSection && scrollRateInSection<= animationValues.message2_fadeIn.end) {
                    if(direction == 1){
                        handleAnimation(message2,"animation-fadeIn-down","animation-fadeOut-down");
                    } else if(direction == 0){
                        handleAnimation(message2,"animation-fadeOut-down","animation-fadeIn-down");
                        if (message2.classList.contains("animation-fadeIn-down")) {
                            message2.classList.remove("animation-fadeIn-down");
                        }
                        if(message2.classList.contains("animation-fadeOut-down") != true){
                            message2.classList.add("animation-fadeOut-down");
                        }
                    }
                } else if(animationValues.message2_fadeOut.start<=scrollRateInSection && scrollRateInSection<= animationValues.message2_fadeOut.end ) {
                    if(direction == 1){
                        handleAnimation(message2,"animation-fadeOut-down","animation-fadeIn-down");
                    }else if(direction==0){
                        handleAnimation(message2,"animation-fadeIn-down","animation-fadeOut-down");
                    }
                }
                if(scrollRateInSection>animationValues.message2_fadeOut.end){
                    messageInSection.obj.forEach((message) => {
                        if (message.classList.contains("animation-fadeIn-down")) {
                            message.classList.remove("animation-fadeIn-down");
                        }
                    });
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
    let direction = 0; // 0 : up, 1 : down
    if (scrollTop > lastScrollTop) {
        navbar.style.top = `-76px`; // 스크롤을 내릴 때 nav를 숨김
        direction = 1;
    } else {
        navbar.style.top = "0"; // 스크롤을 올릴 때 nav를 보임
    }
    lastScrollTop = scrollTop;
    return direction;
}

document.addEventListener("scroll", (e) => {
    const activeSectionIndex = findActiveSection();
    const previousHeight = calculatePriviousHeight(activeSectionIndex);
    if (isMobile != true) {
        playAnimation(activeSectionIndex, previousHeight);
        controlNavbar();
    }else if(isMobile){
        const direction = controlNavbar();
        playMobileAnimation(activeSectionIndex, previousHeight, direction);
        
    }
});

const intersectionObserverSection3 = new IntersectionObserver((entries, observer) => {
    const [entry] = entries;
    const contentArea = entry.target.querySelector(".content-area");
    const sectionTitle = contentArea.querySelector("h2");
    const buttonDiv = contentArea.querySelector("div");
    let animationDelayTime = 0.1;
    // scroll-section-3이 닿으면 title과 버튼을 보여준다.
    if (entry.isIntersecting) {
        handleAnimation(sectionTitle,"animation-fadeIn-down","animation-fadeOut-down");
        handleAnimation(buttonDiv,"animation-fadeIn-down","animation-fadeOut-down");
        buttonDiv.style.animationDelay = `${animationDelayTime}s`;
    }
    // scroll-section-3에서 벗어나면 title과 버튼을 숨긴다.
    else if (entry.isIntersecting == false) {
        handleAnimation(sectionTitle,"animation-fadeOut-down","animation-fadeIn-down");
        handleAnimation(buttonDiv,"animation-fadeOut-down","animation-fadeIn-down");
    }
}, { threshold: 0.5 })

intersectionObserverSection3.observe(document.querySelector("#scroll-section-3"));



const intersectionObserverSection4 = new IntersectionObserver((entries, observer) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
        const contentArea = entry.target.querySelector(".content-area");
        const sectionTitle = contentArea.querySelector("h2");
        const rows = contentArea.querySelectorAll(".row");
        let animationDelayTime = 0;
        handleAnimation(sectionTitle,"animation-fadeIn-noMove","animation-fadeOut-noMove");
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

        handleAnimation(sectionTitle,"animation-fadeOut-noMove","animation-fadeIn-noMove");
        rows.forEach((row) => {
            const cols = row.querySelectorAll(".col-md-4")
            cols.forEach((col) => {
                handleAnimation(col,"animation-fadeOut-down-bounce","animation-fadeIn-down-bounce");
            })
        })
    }
})

intersectionObserverSection4.observe(document.querySelector("#scroll-section-4"));

const intersectionObserverUnlimitedScroll = new IntersectionObserver(async (entries, observer) => {
    const [entry] = entries;
    if (entry.isIntersecting && infiniteScrollInfo.isfetching) {
        const contentArea = document.querySelector("#scroll-section-4").querySelector(".content-area");
        const rowTag = createElement('div', {
            classList: ['row', 'mb-md-3']
        });

        // id변수를 활용해서 /data로 데이터를 ajax 요청한다.
        for (let i = 0; i < 3; i++) {
            if (infiniteScrollInfo.isfetching == false) {
                break;
            }
            await loadAndCreateCards(infiniteScrollInfo.id,rowTag);
            infiniteScrollInfo.id++;
        }
        if (rowTag.querySelectorAll(".col-md-4").length > 0) {
            contentArea.appendChild(rowTag);
        }
        contentArea.appendChild(rowTag);
    }
}, { threshold: 1.0 })

intersectionObserverUnlimitedScroll.observe(document.querySelector("footer"));