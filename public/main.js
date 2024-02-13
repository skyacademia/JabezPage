
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // 안드로이드 아이폰을 검사해 체크
class SectionInfoManager {
    constructor() {
        this.sectionInfo = [];
    }
    addSectionInfo(section) {
        this.sectionInfo.push(section);
    }
    getSectionInfo() {
        return this.sectionInfo;
    }
    getSectionInfoById(id) {
        return this.sectionInfo.find((section) => section.getId() == id);
    }
    getObjById(id) {
        return this.sectionInfo.find((section) => section.getId() == id).getObj();
    }
}
class SectionInfo {
    constructor(id, multipleValue, obj, values = {}) {
        this.id = id;
        this.multipleValue = multipleValue;
        this.obj = obj;
        this.values = values;
    }
    getId() {
        return this.id;
    }
    getMultipleValue() {
        return this.multipleValue;
    }
    getObj() {
        return this.obj;
    }
    getValues() {
        return this.values;
    }
}
const sectionInfoManager = new SectionInfoManager();

const sectionInfo = [
    {
        // section-1
        multipleValue: 2,
        obj: document.querySelector("#scroll-section-1"),
        values: {
            // message1_fadeIn_opacity: [0, 1, { start: 0, end: 0.14 }],
            // message1_fadeIn_transform: [10, 0, { start: 0, end: 0.14 }],
            // message1_fadeOut_opacity: [1, 0, { start: 0.18, end: 0.32 }],
            // message1_fadeOut_transform: [0, -10, { start: 0.18, end: 0.32 }],
            // message2_fadeIn_opacity: [0, 1, { start: 0.34, end: 0.48 }],
            // message2_fadeIn_transform: [10, 0, { start: 0.34, end: 0.48 }],
            // message2_fadeOut_opacity: [1, 0, { start: 0.52, end: 0.66 }],
            // message2_fadeOut_transform: [0, -10, { start: 0.52, end: 0.66 }],
        }
    },
    {
        // section-2
        multipleValue: 2,
        obj: document.querySelector("#scroll-section-2"),
    },
    {
        // section-3
        multipleValue: 2,
        obj: document.querySelector("#scroll-section-3"),
    },
    // 이후 contentSection은 동적으로 추가됨
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
class sectionInfiniteScrollInfo {
    constructor(sectionId) {
        this.id = 0;
        this.sectionId = sectionId;
        this.isfetching = true;
        this.sectionObj = document.querySelector(`section[data-contentSectionId='${sectionId}']`);
    }

    incrementId() {
        this.id++;
    }

    changeId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }

    stopFetching() {
        this.isfetching = false;
    }

    getIsFetching() {
        return this.isfetching;
    }
    getSectionId() {
        return this.sectionId;
    }
    getSectionObj() {
        return this.sectionObj;
    }
}

class InfiniteScrollManager {
    constructor() {
        this.sections = {};
    }

    addSection(sectionId) {
        this.sections[sectionId] = new sectionInfiniteScrollInfo(sectionId);
    }

    getSection(sectionId) {
        return this.sections[sectionId];
    }
    getSectionLength() {
        return Object.keys(this.sections).length;
    }

    removeSection(sectionId) {
        delete this.sections[sectionId];
    }

    stopFetching(sectionId) {
        this.sections[sectionId].stopFetching();
    }

    incrementId(sectionId) {
        this.sections[sectionId].incrementId();
    }

    changeId(sectionId, id) {
        this.sections[sectionId].changeId(id);
    }
    getSectionId(sectionId) {
        return this.sections[sectionId].getSectionId();
    }
    getIdBySection(sectionId) {
        return this.sections[sectionId].getId();
    }
    getIsFetching(sectionId) {
        return this.sections[sectionId].getIsFetching();
    }
    getSectionObj(sectionId) {
        return this.sections[sectionId].getSectionObj();
    }
    getSectionObjs() {
        return Object.values(this.sections).map((section) => section.getSectionObj());
    }
}
const youtubeIframeInfo = {
    widthRatio: 16,
    heightRatio: 9,
}
const touchInfo = {
    startY: 0,
    endY: 0,
}
const iconPathData = {
    playIcon: "m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393",
    pauseIcon: "M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5",
    muteIcon: "M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0",
    volumeUpIcon: [
        "M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z",
        "M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z",
        "M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"
    ]
}
let currentDivIndex = 0;
let lastScrollTop = 0;

// 비디오명 상수
const VIDEONAME = "jabez_background_video_2";
const MOBILEVIDEONAME = "jabez_background_video_2_fontSize";

// id에 scroll-section이 포함된 section들 중에서 content관련 id가 들어간 section의 정보를 infiniteScrollInfo에 추가하고, section정보에 조회 시작 ID를 추가.
const infiniteScrollManager = new InfiniteScrollManager();

function createSection(id, contentSectionName, contentSectionColor) {
    const startSectionId = 3;
    const section = createElement("section", { classList: ["container-fluid"], id: `scroll-section-${startSectionId + id}`, "data-contentSectionId": `${id}`, style: { backgroundColor: `${contentSectionColor}` } }); // parameter로 받아서 적용할 수 있도록 수정

    const container = createElement("div", { classList: ["container", "d-flex", "align-items-center", "justify-content-center", "flex-column"], style: { height: "100%" } });

    const contentArea = createElement("div", { classList: ["content-area", "w-100", "my-5"] });

    const heading = createElement("h2", { classList: ["content", "animation-content-right", "mb-5", "position-relative"] });

    const specialText = createElement("span", { classList: ["spacial-text"] }, [`${contentSectionName}`]); // parameter로 받아서 적용할 수 있도록 수정

    const caretIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    caretIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    caretIcon.setAttribute("width", "2rem");
    caretIcon.setAttribute("height", "2rem");
    caretIcon.setAttribute("fill", "currentColor");
    caretIcon.classList.add("bi", "bi-caret-down-fill", "position-absolute");
    caretIcon.setAttribute("viewBox", "0 0 16 16");

    const caretPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    caretPath.setAttribute("d", "M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0");

    caretIcon.appendChild(caretPath);
    heading.appendChild(specialText);
    heading.appendChild(caretIcon);

    const contentList = createElement("div", { classList: ["content-list"] });

    const row = createElement("row", { classList: ["row", "mb-md-3", "row-cols-md-3", "row-cols-sm-2", "row-cols-1", "content"] });

    contentList.appendChild(row);
    contentArea.appendChild(heading);
    contentArea.appendChild(contentList);
    container.appendChild(contentArea);
    section.appendChild(container);

    return section;
}

function createListItem(id, contentSectionName) {
    return createElement("li", { classList: ["list-group-item", "list-group-item-action", "list-group-item-light"], "data-contentListId": `${id}` }, [`${contentSectionName}`]); // parameter로 받아서 적용할 수 있도록 수정
}

// API 호출해서 section 정보를 가져온 뒤 section을 생성
async function createContentSectionInfo(sectionInfoManager) {
    const contentSections = this.document.querySelector(".content-sections");
    const contentListNavigator = this.document.querySelector(".contentListNavigator").querySelector(".list-group");
    const json = await fetchData("/api/section/get");
    json.forEach((data) => {
        const newSection = createSection(data.id, data.contentSectionName, data.contentSectionColor);
        contentSections.appendChild(newSection);
        const newListItem = createListItem(data.id, data.contentSectionName);
        contentListNavigator.appendChild(newListItem);
    });
    contentSections.querySelectorAll("section").forEach((section) => {
        const sectionId = section.getAttribute("id").split("-")[2];
        sectionInfoManager.addSectionInfo(new SectionInfo(sectionId, 0, { section: section }));
    });
}

function getTotalOffsetTop(element) {
    let totalOffsetTop = 0;

    while (element) {
        totalOffsetTop += element.offsetTop;
        element = element.offsetParent;
    }

    return totalOffsetTop;
}

function applyStyle(element, style) {
    Object.keys(style).forEach((key) => {
        element.style[key] = style[key];
    });
}

function applyStyleToElements(elements, style) {
    elements.forEach((element) => {
        applyStyle(element, style);
    });
}

async function fetchData(api) {
    if (api == null) {
        return [];
    }
    try {
        const response = await fetch(api);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Failed to fetch data', error);
        return [];
    }
}

function setInfiniteScrollManager(infiniteScrollManager) {
    const contentSectionArea = document.querySelector(".content-sections");
    const contentSections = contentSectionArea.querySelectorAll("section")
    if (contentSections.length === 0) {
        return;
    }
    contentSections.forEach(async (section) => {
        const sectionId = section.getAttribute("data-contentSectionId");
        infiniteScrollManager.addSection(sectionId);
        const json = await fetchData(`/api/content/get/SectionNum/${sectionId}`);
        if (json.length === 0) {
            infiniteScrollManager.changeId(sectionId, 0);
            infiniteScrollManager.stopFetching(sectionId);
        } else {
            json.forEach((info) => {
                createCard(info, section.querySelector(".row"), info.ID);
                infiniteScrollManager.changeId(sectionId, info.ID);
            });
        }
    });
}

function setDefaultSectionInfo(sectionInfoManager) {
    const section1 = new SectionInfo(1, 2, {
        section: document.querySelector("#scroll-section-1"),
        message1: document.querySelector("#scroll-section-1").querySelectorAll(".content")[0],
        message2: document.querySelector("#scroll-section-1").querySelectorAll(".content")[1]
    },
        {
            message1_fadeIn_opacity: [0, 1, { start: 0, end: 0.14 }],
            message1_fadeIn_transform: [10, 0, { start: 0, end: 0.14 }],
            message1_fadeOut_opacity: [1, 0, { start: 0.18, end: 0.32 }],
            message1_fadeOut_transform: [0, -10, { start: 0.18, end: 0.32 }],
            message2_fadeIn_opacity: [0, 1, { start: 0.34, end: 0.48 }],
            message2_fadeIn_transform: [10, 0, { start: 0.34, end: 0.48 }],
            message2_fadeOut_opacity: [1, 0, { start: 0.52, end: 0.66 }],
            message2_fadeOut_transform: [0, -10, { start: 0.52, end: 0.66 }],
            message1_fadeIn_mobile: { start: 0, end: 0.14 },
            message1_fadeOut_mobile: { start: 0.18, end: 0.32 },
            message2_fadeIn_mobile: { start: 0.54, end: 0.68 },
            message2_fadeOut_mobile: { start: 0.72, end: 0.86 },
        });
    const section2 = new SectionInfo(2, 2, {
        section: document.querySelector("#scroll-section-2"),
        message1: document.querySelector("#scroll-section-2").querySelectorAll(".content")[0],
        message2: document.querySelector("#scroll-section-2").querySelectorAll(".content")[1]
    }, {
        message1_fadeIn_opacity: [0, 1, { start: 0, end: 0.14 }],
        message1_fadeIn_transform: [10, 0, { start: 0, end: 0.14 }],
        message1_fadeOut_opacity: [1, 0, { start: 0.18, end: 0.32 }],
        message1_fadeOut_transform: [0, -10, { start: 0.18, end: 0.32 }],
        message2_fadeIn_opacity: [0, 1, { start: 0.34, end: 0.48 }],
        message2_fadeIn_transform: [10, 0, { start: 0.34, end: 0.48 }],
        message2_fadeOut_opacity: [1, 0, { start: 0.52, end: 0.66 }],
        message2_fadeOut_transform: [0, -10, { start: 0.52, end: 0.66 }],
        message1_fadeIn_mobile: { start: 0, end: 0.14 },
        message1_fadeOut_mobile: { start: 0.18, end: 0.32 },
        message2_fadeIn_mobile: { start: 0.54, end: 0.68 },
        message2_fadeOut_mobile: { start: 0.72, end: 0.86 },
    });
    const section3 = new SectionInfo(3, 2, { section: document.querySelector("#scroll-section-3") });
    sectionInfoManager.addSectionInfo(section1);
    sectionInfoManager.addSectionInfo(section2);
    sectionInfoManager.addSectionInfo(section3);
}
// 아이콘을 클릭하면 section으로 이동
function setScrollDownIcon() {
    const scrollDownIcons = document.querySelectorAll("svg[class*='scrollDown']");
    for (let i = 0; i < scrollDownIcons.length; i++) {
        scrollDownIcons[i].addEventListener("click", function (event) {
            const section = document.querySelector(`#scroll-section-${i + 2}`);
            window.scrollTo({ top: getTotalOffsetTop(section), behavior: "smooth" });
        });
    }
}
function setModalBehavior() {
    const modal = document.getElementById("myModal");

    modal.querySelector(".modal-content").addEventListener("click", function (event) {
        if (event.target == this) {
            if (modal.classList.contains("d-flex")) {
                modal.classList.remove("d-flex");
            }
            modal.classList.add("d-none");
            event.target.querySelector("iframe").src = "";
            document.body.style.overflow = "auto";
        }
    });

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
}
function setVideoSrc() {
    const video = document.querySelector("#scroll-section-2").querySelector("video");
    video.querySelectorAll("source")[0].setAttribute("src", `./video/${isMobile ? MOBILEVIDEONAME : VIDEONAME}.webm`);
    video.querySelectorAll("source")[1].setAttribute("src", `./video/${isMobile ? MOBILEVIDEONAME : VIDEONAME}.mp4`);
    video.load();
}
function setVideoClick() {
    const section = document.querySelector("#scroll-section-2");
    const mousePointer = section.querySelector(".mouse-cursor");
    section.querySelector(".sticky-area").addEventListener("mousemove", function (event) {
        if (mousePointer.classList.contains("hover") != true) {
            mousePointer.classList.add("hover");
        }

        mousePointer.style.left = `${event.offsetX}px`;
        mousePointer.style.top = `${event.offsetY}px`;

        /* 포인터를 부드럽게 움직이기 위한 로직 (transition 속성이 없어도 됨) - 동작하는 로직이기 때문에 남겨놓음 */
        // // 현재 아이콘의 위치
        // const iconX = parseFloat(mousePointer.style.left) || 0;
        // const iconY = parseFloat(mousePointer.style.top) || 0;

        // // 마우스의 현재 위치
        // const mouseX = event.offsetX;
        // const mouseY = event.offsetY;

        // // 비율 계산
        // const ratio = 0.3; // 조절 가능한 비율
        // const deltaX = (mouseX - iconX) * ratio;
        // const deltaY = (mouseY - iconY) * ratio;

        // 아이콘의 새로운 위치 설정
        // mousePointer.style.left = `${iconX + deltaX}px`;
        // mousePointer.style.top = `${iconY + deltaY}px`;
    });

    section.querySelector(".content-area").addEventListener("mouseleave", function (event) {
        mousePointer.classList.remove("hover");
    });

    // scroll-section-2의 video를 찾아서 재생/일시정지 한다.
    section.querySelector(".content-area").addEventListener("click", function (event) {
        const video = section.querySelector("video");
        if (video.paused) {
            video.play();
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", iconPathData.pauseIcon);
            mousePointer.replaceChildren(path);
        } else {
            video.pause();
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", iconPathData.playIcon);
            mousePointer.replaceChildren(path);
        }
    });

    section.querySelector(".volume-control").addEventListener("mouseover", function (event) {
        mousePointer.style.opacity = "0";
    });
    section.querySelector(".volume-control").addEventListener("mouseleave", function (event) {
        mousePointer.style.opacity = "1";
    });
    section.querySelector(".volume-control").addEventListener("click", function (event) {
        // scroll-section-2의 video를 찾아서 볼륩을 조절한다.
        const video = section.querySelector("video");
        if (video.muted) {
            video.muted = false;
            this.replaceChildren();
            // 아이콘의 path를 바꾼다.
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", iconPathData.volumeUpIcon[0]);
            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path2.setAttribute("d", iconPathData.volumeUpIcon[1]);
            const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path3.setAttribute("d", iconPathData.volumeUpIcon[2]);

            this.replaceChildren(path1, path2, path3);
        } else {
            video.muted = true;
            // 아이콘의 path를 바꾼다.
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", iconPathData.muteIcon)
            this.replaceChildren(path1);
        }
    });
}
function setContentSectionBehavior(infiniteScrollManager) {
    const contentListNavigator = document.querySelector(".contentListNavigator");
    document.querySelectorAll("section[data-contentSectionId]").forEach((section) => {
        const contentListId = section.getAttribute("data-contentSectionId");
        if (contentListId) {
            const h2 = section.querySelector("h2");
            h2.addEventListener("click", toggleContent);
            const relatedNavItem = contentListNavigator.querySelector(`[data-contentListId="${contentListId}"]`);
            if (relatedNavItem) {
                relatedNavItem.addEventListener("click", navigateToSection);
            }
        }
    });

    function navigateToSection(event) {
        const contentListId = this.getAttribute("data-contentListId");
        const contentSection = infiniteScrollManager.getSectionObj(contentListId);
        window.scrollTo({ top: getTotalOffsetTop(contentSection), behavior: "smooth" });

        const selectedH2 = contentSection.querySelector("h2.content");
        const contentSections = infiniteScrollManager.getSectionObjs();
        const h2InContentSections = contentSections.map((section) => section.querySelector("h2.content"));

        h2InContentSections.forEach((unselectedH2) => {
            if (unselectedH2 == selectedH2 || unselectedH2.classList.contains("show")) {
                unselectedH2.click();
            }
        });
    }

    function toggleContent(event) {
        const h2 = this;
        h2.classList.toggle("show");

        const contentList = h2.nextElementSibling;
        const isContentVisible = h2.classList.contains("show");

        animateContentList(contentList, isContentVisible);

        const contentListId = h2.closest("[data-contentSectionId]").getAttribute("data-contentSectionId");
        updateNavigationActiveState(contentListId, isContentVisible);
    }

    function animateContentList(contentList, isVisible) {
        let count = 0;
        if (isVisible) {
            contentList.style.height = "auto";
        } else {
            contentList.style.height = contentList.querySelector(".col") === null ? "0px" : contentList.querySelector(".col").offsetHeight + "px";
        }
        if (contentList.querySelector(".col") !== null) {
            contentList.querySelectorAll(".col").forEach((col) => {
                if (count >= 3) {
                    const animationClass = isVisible ? "animation-fadeIn-down-bounce" : "animation-fadeOut-up-bounce";
                    col.classList.remove(isVisible ? "animation-fadeOut-up-bounce" : "animation-fadeIn-down-bounce");
                    col.classList.add(animationClass);
                }
                count++;
            });
        }
    }

    function updateNavigationActiveState(contentListId, isActive) {
        contentListNavigator.querySelectorAll(".list-group-item").forEach((item) => {
            if (item.getAttribute("data-contentListId") === contentListId) {
                isActive ? item.classList.add("active") : item.classList.remove("active");
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", async function (event) {
    setDefaultSectionInfo(sectionInfoManager);
    createContentSectionInfo(sectionInfoManager).then(() => {
        setVideoSrc();
        setVideoClick();
        setScrollDownIcon();
        setModalBehavior();
        setInfiniteScrollManager(infiniteScrollManager);
        setContentSectionBehavior(infiniteScrollManager);
        resizeSection();
        resizeVideo();
        resizeNavigator();
    });
});



// resize 이벤트 발생 시 iframe의 크기를 조절
function resizeIframe() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const iframe = document.getElementById("myModal").querySelector("iframe");

    // 데스크탑에서 길이, 높이 변경 시 iframe의 크기를 조절
    if (isMobile != true && (width > height)) {
        const iframeHeight = height * 0.8;
        const iframeWidth = (iframeHeight * youtubeIframeInfo.widthRatio) / youtubeIframeInfo.heightRatio;
        applyStyle(iframe, { width: `${iframeWidth}px`, height: `${iframeHeight}px` });
    } else if (isMobile != true && (width < height)) {
        const iframeWidth = width * 0.8;
        const iframeHeight = (iframeWidth * youtubeIframeInfo.heightRatio) / youtubeIframeInfo.widthRatio;
        applyStyle(iframe, { width: `${iframeWidth}px`, height: `${iframeHeight}px` });
    }

    // mobile에서 가로, 세로 모드 전환 시 iframe의 크기를 조절
    // 세로 모드일 때
    if (isMobile && window.matchMedia("(orientation: portrait)").matches) {
        const iframeWidth = width * 0.9;
        const iframeHeight = (iframeWidth * youtubeIframeInfo.heightRatio) / youtubeIframeInfo.widthRatio;
        applyStyle(iframe, { width: `${iframeWidth}px`, height: `${iframeHeight}px` });
    }
    // 가로 모드일 때
    else if (isMobile && window.matchMedia("(orientation: landscape)").matches) {
        const iframeHeight = height * 0.8;
        const iframeWidth = (iframeHeight * youtubeIframeInfo.widthRatio) / youtubeIframeInfo.heightRatio;
        applyStyle(iframe, { width: `${iframeWidth}px`, height: `${iframeHeight}px` });
    }
}

// 모바일에서 resize 이벤트 발생 시 video의 object-fit을 조절
function resizeVideo() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const video = document.querySelector("#scroll-section-2").querySelector("video");

    // 세로 모드일 때
    if (isMobile != true && (width > height)) {
        handleClassList(video, "object-fit-cover", "object-fit-contain");
    }
    else if (isMobile != true && (width < height)) {
        handleClassList(video, "object-fit-contain", "object-fit-cover");
    }

    // 세로 모드일 때
    if (isMobile && window.matchMedia("(orientation: portrait)").matches) {
        handleClassList(video, "object-fit-contain", "object-fit-cover");
    }
    // 가로 모드일 때
    else if (isMobile && window.matchMedia("(orientation: landscape)").matches) {
        handleClassList(video, "object-fit-cover", "object-fit-contain");
    }
}

function resizeNavigator() {
    const navigatorArea = document.querySelector(".contentListNavigator");
    const naviListGroup = navigatorArea.querySelector(".contentListNavigator > .list-group");
    const navigator = naviListGroup.querySelectorAll(".list-group-item");

    // 데스크탑에서 브라우저의 가로 길이가 992px 이하일 때
    if (isMobile != true && window.matchMedia("(max-width: 992px)").matches) {
        applyStyle(navigatorArea, { bottom: "10%", right: "3%" });
    } else if (isMobile != true && window.matchMedia("(min-width: 992px)").matches) {
        applyStyle(navigatorArea, { bottom: "50%", right: "5%" });
    }

    // 모바일 세로 모드일 때
    if (isMobile && window.matchMedia("(orientation: portrait)").matches) {
        applyStyle(navigatorArea, { bottom: "10%", right: "3%" });
        applyStyleToElements(navigator, {
            width: "100%",
            padding: "0.2rem",
            fontSize: "0.8rem"
        });
        // 모바일 가로 모드일 때
    } else if (isMobile && window.matchMedia("(orientation: landscape)").matches) {
        applyStyle(navigatorArea, { bottom: "17%", right: "2%" });
        applyStyleToElements(navigator, {
            width: "100%",
            padding: "0.2rem",
            fontSize: "0.8rem"
        });
    }
}

// resize 이벤트 발생 시 section의 높이를 조절
function resizeSection() {
    sectionInfoManager.getSectionInfo().forEach((section) => {
        const multipleValue = section.getMultipleValue();
        const sectionObjs = section.getObj();
        if (multipleValue > 0) {
            applyStyle(sectionObjs.section, { height: `${multipleValue * window.innerHeight}px` });
        }
    });
    // for (let i = 0; i < sectionInfo.length; i++) {
    //     if (sectionInfo[i].multipleValue > 0) {
    //         applyStyle(sectionInfo[i].obj, { height: `${sectionInfo[i].multipleValue * window.innerHeight}px` })
    //     }
    // }
}

// 모바일에서 가로모드일 때 scroll-section-1의 메시지의 위치를 조절
function resizeMessage() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const section1 = document.querySelector("#scroll-section-1");
    const message1 = section1.querySelectorAll(".content")[0];
    const message2 = section1.querySelectorAll(".content")[1];

    // 세로 모드일 때
    if (isMobile && window.matchMedia("(orientation: portrait)").matches) {
        applyStyleToElements([message1, message2], { transform: "translate(0, 0)" });
    }
    // 가로 모드일 때
    else if (isMobile && window.matchMedia("(orientation: landscape)").matches) {
        applyStyleToElements([message1, message2], { transform: "translate(0, 10rem)" });
    }
}

window.addEventListener("resize", () => {
    resizeSection();
    resizeIframe();
    resizeVideo();
    resizeMessage();
    resizeNavigator();
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



function createCard(info, rowTag, id) {
    // 카드 생성 로직
    const memberYoutubeTitle = info.MemberYoutubeTitle;
    const memberYoutubeThumnailPath = info.MemberYoutubeThumbnailLink;
    const youtubeLink = info.MemberYoutubeLink;
    const _id = info.ID;

    const colTag = createElement('div', {
        classList: ['col', 'card-default-setting', 'animation-fadeIn-down-bounce'],
        style: { animationDelay: `${(id % 3 > 0 ? id % 3 : 3) * 0.1}s` },
        id: `${_id}`
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
        const modal = document.getElementById("myModal");
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

async function fetchDataForSection(infiniteScrollManager, sectionId, count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        if (infiniteScrollManager.getIsFetching(sectionId) == false) {
            break;
        }
        try {
            const queryCount = 1;
            const json = await fetchData(`/api/content/get/section/${sectionId}/${infiniteScrollManager.getIdBySection(sectionId)}/${queryCount}`);
            if (json.length === 0) {
                infiniteScrollManager.stopFetching(sectionId);
                break;
            } else {
                infiniteScrollManager.changeId(sectionId, json[json.length - 1].ID);
                data.push(json);
            }
        } catch (error) {
            break;
        }
    }
    return data;
}

// 이미지 로딩 함수
async function preloadImages(sections) {
    const allData = [];
    const dataPerSection = 5;

    for (const sectionId of sections) {
        const data = await fetchDataForSection(infiniteScrollManager, sectionId, dataPerSection);
        allData.push(...data);
    }

    return allData;
}

// DOM 조작 함수
function updateDOMWithData(allData, infiniteScrollManager) {
    allData.forEach((data) => {
        let row = infiniteScrollManager.getSectionObj(data[0].ContentSectionNum).querySelector(".row");
        data.forEach((info) => {
            createCard(info, row, info.ID);
        });
    });
}

// 페이지 로딩 시 실행되는 함수
async function initializePage(infiniteScrollManager) {
    const contentSectionArea = document.querySelector(".content-sections");
    const jsonPromise = await fetchData("/api/section/get");
    const sections = jsonPromise.map(section => section.id);

    if (sections.length === 0) {
        return;
    }
    const allData = await preloadImages(sections);

    updateDOMWithData(allData, infiniteScrollManager);

    for (const sectionId of sections) {
        // 컨텐츠가 있으면 더보기 버튼 추가
        if (infiniteScrollManager.getIsFetching(sectionId) == true) {
            addMoreButton(sectionId, infiniteScrollManager, intersectionObserverUnlimitedScroll);
        } 
        // 컨텐츠가 하나도 없으면 닫기 버튼과 메시지 추가
        else if ((infiniteScrollManager.getIsFetching(sectionId) == false) && (infiniteScrollManager.getSectionObj(sectionId).querySelector(".content-list").querySelector(".col") == null)) {
            const sectionContentList = infiniteScrollManager.getSectionObj(sectionId).querySelector(".content-list");
            const h3 = createElement("h3", {}, ["컨텐츠가 없습니다"]);
            sectionContentList.removeChild(sectionContentList.querySelector("row"));
            sectionContentList.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center");
            sectionContentList.appendChild(h3);
            addCloseButton(sectionId, infiniteScrollManager);
        } 
        // 더이상 추가적인 컨텐츠가 없으면 닫기 버튼 추가
        else {
            addCloseButton(sectionId, infiniteScrollManager);
        }
    }
}

function addMoreButton(sectionId, infiniteScrollManager, intersectionObserverUnlimitedScroll) {
    const sectionObj = infiniteScrollManager.getSectionObj(sectionId);
    const contentListArea = sectionObj.querySelector(".content-list");
    const btn_more = createElement("button", { classList: ["btn", "btn-outline-dark", "btn-more"], id: `btn-more-${sectionId}` }, ["더보기"]);

    btn_more.addEventListener("click", async function (event) {
        const data = await fetchDataForSection(infiniteScrollManager, sectionId, 3)
        if (data.length === 0) {
            this.remove();
            addCloseButton(sectionId, infiniteScrollManager);
            return;
        }
        data.forEach((json) => {
            json.forEach((info) => {
                let row = infiniteScrollManager.getSectionObj(info.ContentSectionNum).querySelector(".row");
                createCard(info, row, info.ID);
            });
        });
        this.style.display = "none";
        const infiniteScrollTrigger = createElement("div", { classList: ["w-100"], id: `infinite-scroll-trigger-${sectionId}` });
        contentListArea.appendChild(infiniteScrollTrigger);
        if (intersectionObserverUnlimitedScroll != null) {
            intersectionObserverUnlimitedScroll.observe(infiniteScrollTrigger);
        }
    });

    contentListArea.appendChild(btn_more);
}

function addCloseButton(sectionId, infiniteScrollManager) {
    const sectionObj = infiniteScrollManager.getSectionObj(sectionId);
    const contentListArea = sectionObj.querySelector(".content-list");
    const btnClose = createElement("button", { classList: ["btn", "btn-outline-dark"], id: `btn-close-${sectionId}` }, ["닫기"]);

    btnClose.addEventListener("click", function (event) {
        const h2Headline = sectionObj.querySelector("h2.content");
        const navigator = document.querySelector(".contentListNavigator").querySelectorAll(".list-group-item");
        navigator.forEach((item) => {
            if (item.getAttribute("data-contentListId") == sectionId) {
                item.classList.remove("active");
            }
        });
        h2Headline.click();
    });

    contentListArea.appendChild(btnClose);
}

function settingContentSectionHeight() {
    const contentSections = document.querySelectorAll("section[id*=scroll-section][data-contentSectionId]");
    contentSections.forEach((section) => {
        const contentListArea = section.querySelector(".content-list");
        const contentList = contentListArea.querySelector(".col");
        if (contentList == null) {
            contentListArea.style.height = "0px";
            return;
        }
        const contentListHeight = contentList.clientHeight;
        contentListArea.style.height = `${contentListHeight}px`;
    });
}

history.scrollRestoration = "manual"; // 뒤로가기 시 스크롤 위치를 유지하지 않음
window.addEventListener("load", (e) => {
    initializePage(infiniteScrollManager).then(() => {
        settingContentSectionHeight();
    });
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
    const sectionObj = document.querySelector(`#scroll-section-${activeSectionIndex + 1}`);
    const sectionValues = sectionInfoManager.getSectionInfoById(activeSectionIndex + 1).getValues();
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
                    applyStyle(contentList[0], { opacity: message1_fadeIn_opacity_value, transform: `translate(0,${message1_fadeIn_transition_value}%)` });
                } else {
                    applyStyle(contentList[0], { opacity: message1_fadeOut_opacity_value, transform: `translate(0,${message1_fadeOut_transition_value}%)` });
                }
                if (scrollRateInSection <= 0.50) {
                    applyStyle(contentList[1], { opacity: message2_fadeIn_opacity_value, transform: `translate(0,${message2_fadeIn_transition_value}%)` });
                } else {
                    applyStyle(contentList[1], { opacity: message2_fadeOut_opacity_value, transform: `translate(0,${message2_fadeOut_transition_value}%)` });
                }
                break;
            }
    }
}

function handleClassList(message, addClass, removeClass) {
    message.classList.remove(removeClass);
    message.classList.add(addClass);

}
function handleAnimation(message, addAnimation, removeAnimation) {
    message.classList.remove(removeAnimation);
    message.classList.add(addAnimation);
}

function playMobileAnimation(activeSectionIndex, previousHeight, direction) {
    const yoffset = window.scrollY;
    const sectionObj = document.querySelector(`#scroll-section-${activeSectionIndex + 1}`);
    const activeSectionHeight = sectionObj.clientHeight;
    const scrollInSection = yoffset - previousHeight;
    const scrollRateInSection = scrollInSection / activeSectionHeight;
    switch (activeSectionIndex) {
        case 0:
            {
                const messageInSection = sectionInfoManager.getSectionInfoById(1).getObj();
                messageInfo[0];
                const message1 = messageInSection.obj[0];
                const message2 = messageInSection.obj[1];
                const animationValues = messageInSection.values;
                if (0.05 < scrollRateInSection && scrollRateInSection <= animationValues.message1_fadeIn.end) {
                    if (direction == 1) {
                        handleAnimation(message1, "animation-fadeIn-down", "animation-fadeOut-down");
                    } else if (direction == 0) {
                        handleAnimation(message1, "animation-fadeOut-down", "animation-fadeIn-down");
                    }
                } else if (animationValues.message1_fadeOut.start <= scrollRateInSection && scrollRateInSection <= animationValues.message1_fadeOut.end) {
                    if (direction == 1) {
                        handleAnimation(message1, "animation-fadeOut-down", "animation-fadeIn-down");
                    } else if (direction == 0) {
                        handleAnimation(message1, "animation-fadeIn-down", "animation-fadeOut-down");
                    }
                }
                if (animationValues.message1_fadeOut.end < scrollRateInSection && scrollRateInSection < animationValues.message2_fadeIn.start) {
                    if (direction == 1) {
                        handleAnimation(message2, "animation-fadeIn-down", "animation-fadeOut-down");
                    } else if (direction == 0) {
                        handleAnimation(message2, "animation-fadeOut-down", "animation-fadeIn-down");
                    }
                }
                else if (animationValues.message2_fadeIn.start <= scrollRateInSection && scrollRateInSection <= animationValues.message2_fadeIn.end) {
                    if (direction == 1) {
                        handleAnimation(message2, "animation-fadeIn-down", "animation-fadeOut-down");
                    } else if (direction == 0) {
                        handleAnimation(message2, "animation-fadeOut-down", "animation-fadeIn-down");
                    }
                } else if (animationValues.message2_fadeOut.start <= scrollRateInSection && scrollRateInSection <= animationValues.message2_fadeOut.end) {
                    if (direction == 1) {
                        handleAnimation(message2, "animation-fadeOut-down", "animation-fadeIn-down");
                    } else if (direction == 0) {
                        handleAnimation(message2, "animation-fadeIn-down", "animation-fadeOut-down");
                    }
                }
                if (scrollRateInSection > animationValues.message2_fadeOut.end) {
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
                if (0.05 < scrollRateInSection && scrollRateInSection <= animationValues.message1_fadeIn.end) {
                    if (direction == 1) {
                        handleAnimation(message1, "animation-fadeIn-down", "animation-fadeOut-down");
                    } else if (direction == 0) {
                        handleAnimation(message1, "animation-fadeOut-down", "animation-fadeIn-down");
                    }
                } else if (animationValues.message1_fadeOut.start <= scrollRateInSection && scrollRateInSection <= animationValues.message1_fadeOut.end) {
                    if (direction == 1 && message1.style) {
                        handleAnimation(message1, "animation-fadeOut-down", "animation-fadeIn-down");
                    } else if (direction == 0) {
                        handleAnimation(message1, "animation-fadeIn-down", "animation-fadeOut-down");
                    }
                }
                if (animationValues.message1_fadeOut.end < scrollRateInSection && scrollRateInSection <= animationValues.message2_fadeIn.start) {
                    if (direction == 1) {
                        handleAnimation(message2, "animation-fadeIn-down", "animation-fadeOut-down");
                    } else if (direction == 0) {
                        handleAnimation(message2, "animation-fadeOut-down", "animation-fadeIn-down");
                    }
                }
                else if (animationValues.message2_fadeIn.start <= scrollRateInSection && scrollRateInSection <= animationValues.message2_fadeIn.end) {
                    if (direction == 1) {
                        handleAnimation(message2, "animation-fadeIn-down", "animation-fadeOut-down");
                    } else if (direction == 0) {
                        handleAnimation(message2, "animation-fadeOut-down", "animation-fadeIn-down");
                        if (message2.classList.contains("animation-fadeIn-down")) {
                            message2.classList.remove("animation-fadeIn-down");
                        }
                        if (message2.classList.contains("animation-fadeOut-down") != true) {
                            message2.classList.add("animation-fadeOut-down");
                        }
                    }
                } else if (animationValues.message2_fadeOut.start <= scrollRateInSection && scrollRateInSection <= animationValues.message2_fadeOut.end) {
                    if (direction == 1) {
                        handleAnimation(message2, "animation-fadeOut-down", "animation-fadeIn-down");
                    } else if (direction == 0) {
                        handleAnimation(message2, "animation-fadeIn-down", "animation-fadeOut-down");
                    }
                }
                if (scrollRateInSection > animationValues.message2_fadeOut.end) {
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
    // 현재(2024/01/24) 애니메이션 미사용
    // const activeSectionIndex = findActiveSection();
    // const previousHeight = calculatePriviousHeight(activeSectionIndex); 
    if (isMobile != true) {
        // playAnimation(activeSectionIndex, previousHeight); // 현재(2024/01/24) 애니메이션 미사용
        controlNavbar();
    } else if (isMobile) {
        const direction = controlNavbar();
        // playMobileAnimation(activeSectionIndex, previousHeight, direction); // 현재(2024/01/24) 애니메이션 미사용
    }
});


const intersectionObserverSection3 = new IntersectionObserver((entries, observer) => {
    const [entry] = entries;
    const contentArea = entry.target.querySelector(".content-area");
    const sectionTitle = contentArea.querySelectorAll("div")[0];
    const buttonDiv = contentArea.querySelectorAll("div")[1];
    let animationDelayTime = 0.1;
    // scroll-section-3이 닿으면 title과 버튼을 보여준다.
    if (entry.isIntersecting) {
        handleAnimation(sectionTitle, "animation-fadeIn-down", "animation-fadeOut-down");
        handleAnimation(buttonDiv, "animation-fadeIn-down", "animation-fadeOut-down");
        buttonDiv.style.animationDelay = `${animationDelayTime}s`;
    }
    // scroll-section-3에서 벗어나면 title과 버튼을 숨긴다.
    else if (entry.isIntersecting == false) {
        handleAnimation(sectionTitle, "animation-fadeOut-down", "animation-fadeIn-down");
        handleAnimation(buttonDiv, "animation-fadeOut-down", "animation-fadeIn-down");
    }
}, { threshold: 0.5 })

intersectionObserverSection3.observe(document.querySelector("#scroll-section-3"));

function changeSvgIcon(element, iconPath) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", iconPath);
    element.replaceChildren(path);
}
function changeMultipleSvgIcons(elements, iconPaths) {
    elements.forEach((element, index) => {
        changeSvgIcon(element, iconPaths[index]);
    });
}

const intersectionObserverSection2 = new IntersectionObserver((entries, observer) => {
    const [entry] = entries;
    const video = entry.target.querySelector("video");
    const section = entry.target;
    const mousePointer = section.querySelector(".mouse-cursor");
    const volumeControl = section.querySelector(".volume-control");

    // scroll-section-2가 닿으면 음소거인 상태로 재생하고, 닿지 않으면 video를 멈추고, 음소거한다.
    if (entry.isIntersecting) {
        video.play();
        video.muted = true;
        changeMultipleSvgIcons([mousePointer, volumeControl], [iconPathData.pauseIcon, iconPathData.muteIcon]);
    }
    else if (entry.isIntersecting == false) {
        video.pause();
        video.muted = true;
        changeMultipleSvgIcons([mousePointer, volumeControl], [iconPathData.playIcon, iconPathData.muteIcon]);
    }
}, { threshold: 0 })

intersectionObserverSection2.observe(document.querySelector("#scroll-section-2"));



const intersectionObserverContentSection = new IntersectionObserver((entries, observer) => {
    const [entry] = entries;
    const contentSections = entry.target.querySelectorAll("section[id*=scroll-section]");

    const handleSectionAnimation = (section, animationIn, animationOut) => {
        const sectionTitle = section.querySelector(".content-area h2");
        handleAnimation(sectionTitle, animationIn, animationOut);
    };

    contentSections.forEach((section) => {
        if (entry.isIntersecting) {
            handleSectionAnimation(section, "animation-fadeIn-noMove", "animation-fadeOut-noMove");
        } else {
            handleSectionAnimation(section, "animation-fadeOut-noMove", "animation-fadeIn-noMove");
        }
    });
});
intersectionObserverContentSection.observe(document.querySelector(".content-sections"));



const intersectionObserverUnlimitedScroll = new IntersectionObserver(async (entries, observer) => {
    const [entry] = entries;
    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const contentSections = document.querySelectorAll("section[data-contentSectionId]");
        const sectionInfoItem = Array.from(contentSections).find(contentSection => contentSection.querySelector("div[id*=infinite-scroll-trigger]") == entry.target);
        if (!sectionInfoItem) return;

        const sectionId = sectionInfoItem.getAttribute("data-contentSectionId");
        const section = infiniteScrollManager.getSectionObj(sectionId);
        const isFetching = infiniteScrollManager.getIsFetching(sectionId);

        if (!isFetching) {
            observer.unobserve(entry.target);
            return;
        }

        const data = await fetchDataForSection(infiniteScrollManager, sectionId, 3);
        // 데이터가 없으면 더이상 데이터를 불러오지 못하므로 section을 닫는 닫기 버튼을 생성한다.
        if (!data.length) {
            observer.unobserve(entry.target);
            const btnClose = createElement("button", { classList: ["btn", "btn-outline-dark"], id: `btn-close-${sectionId}` }, ["닫기"]);
            btnClose.addEventListener("click", function (event) {
                const h2Headline = section.querySelector("h2.content");
                const navigator = document.querySelector(".contentListNavigator").querySelectorAll(".list-group-item");
                navigator.forEach((item) => {
                    if (item.getAttribute("data-contentListId") == sectionId) {
                        item.classList.remove("active");
                    }
                });
                h2Headline.click();
            });
            section.querySelector(".content-list").appendChild(btnClose);
            return;
        }

        data.forEach((json) => {
            json.forEach((info) => {
                const row = section.querySelector(".row");
                createCard(info, row, info.ID);
            });
        });
        // 3개의 데이터를 불러오지 못하면 DB에 더이상 데이터가 없다고 판단하고 닫기 버튼을 생성한다.
        if (data.length < 3) {
            observer.unobserve(entry.target);
            const btnClose = createElement("button", { classList: ["btn", "btn-outline-dark"], id: `btn-close-${sectionId}` }, ["닫기"]);
            btnClose.addEventListener("click", function (event) {
                const h2Headline = section.querySelector("h2.content");
                const navigator = document.querySelector(".contentListNavigator").querySelectorAll(".list-group-item");
                navigator.forEach((item) => {
                    if (item.getAttribute("data-contentListId") == sectionId) {
                        item.classList.remove("active");
                    }
                });
                h2Headline.click();
            });
            section.querySelector(".content-list").appendChild(btnClose);
        }
    }
}, { threshold: 1.0 });