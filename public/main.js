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


class CalendarManager {
    constructor() {
        this.calendar = {};
        this.calendarArea = document.querySelector('#scroll-section-4 .content');
        this.calendarArray = ['prev', 'today', 'next'];
        this.calendarIndex = 1;
    }
    addCalendar(type) {
        this.calendar[type] = new Calendar(type);
    }
    getCalendar(type) {
        return this.calendar[type];
    }
    getCalendars() {
        return this.calendar;
    }
    addIndex() {
        this.calendarIndex++;
        if (this.calendarIndex > 2) {
            this.calendarIndex = 2;
        }
    }
    minusIndex() {
        this.calendarIndex--;
        if (this.calendarIndex < 0) {
            this.calendarIndex = 0;
        }
    }
    getCalendarIndex() {
        return this.calendarIndex;
    }
    scrollUpCalendar() {
        this.minusIndex();
        const calendarWidth = document.querySelector('#scroll-section-4 .today-calendar').offsetWidth;
        this.calendarArea.style.transform = `translateX(${calendarWidth * ((this.calendarIndex * -1) + 1)}px)`;
        this.calendarArray.forEach((type) => {
            if (this.calendarArray.indexOf(type) == this.calendarIndex) {
                handleClassList(this.calendar[type].getCalendar(), 'show', 'hide')
                if(isMobile == true){
                    this.calendar[type].getCalendar().querySelector('.calendar-body-area .calendar-reservations').classList.remove('d-none');
                }
            } else {
                handleClassList(this.calendar[type].getCalendar(), 'hide', 'show')
                if(isMobile == true){
                    this.calendar[type].getCalendar().querySelector('.calendar-body-area .calendar-reservations').classList.add('d-none');
                }
            }
        });
    }
    scrollDownCalendar() {
        this.addIndex();
        const calendarWidth = document.querySelector('#scroll-section-4 .today-calendar').offsetWidth;
        this.calendarArea.style.transform = `translateX(${calendarWidth * ((this.calendarIndex * -1) + 1)}px)`;
        this.calendarArray.forEach((type) => {
            if (this.calendarArray.indexOf(type) == this.calendarIndex) {
                handleClassList(this.calendar[type].getCalendar(), 'show', 'hide');
                if(isMobile == true){
                    this.calendar[type].getCalendar().querySelector('.calendar-body-area .calendar-reservations').classList.remove('d-none');
                }
            } else {
                handleClassList(this.calendar[type].getCalendar(), 'hide', 'show');
                if(isMobile == true){
                    this.calendar[type].getCalendar().querySelector('.calendar-body-area .calendar-reservations').classList.add('d-none');
                }
            }
        });
    }
    resizeCalendars() {
        const calendarWidth = document.querySelector(`#scroll-section-4 .${this.calendarArray[this.calendarIndex]}-calendar`).offsetWidth;
        this.calendarArea.style.transform = `translateX(${calendarWidth * ((this.calendarIndex * -1) + 1)}px)`;
    }
    setCalendarResizeOberver() {
        const resizeObserver = new ResizeObserver(() => {
            this.resizeCalendars();
        });
        resizeObserver.observe(document.querySelector('#scroll-section-4 .today-calendar'));
    }
    getCalendarReservationInfo(date) {
        return this.calendar[this.calendarArray[this.calendarIndex]].getCalendarReservationInfo(date);
    }
    getCalendarReservationInfoByDate(date) {
        // date는 'yyyy-mm-dd'형식
        const dateArray = date.split('-');
        const year = parseInt(dateArray[0]);
        const month = parseInt(dateArray[1]);
        const day = parseInt(dateArray[2]);
        const today = new Date();

        // 이전 달이면 prev, 다음 달이면 next, 현재 달이면 today의 calendar에서 찾아서 반환(만약에 다다음 달의 일정인 경우 api로 받아와야함)
        if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1)) {
            return this.calendar['prev'].getCalendarReservationInfo(day);
        } else if (year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth() + 1)) {
            return this.calendar['next'].getCalendarReservationInfo(day);
        } else if (year === today.getFullYear() && month === today.getMonth() + 1) {
            return this.calendar['today'].getCalendarReservationInfo(day);
        }
        else {
            return this.getReservationDate(year, month, day);
        }
    }
    getCalendarDate() {
        return this.calendar[this.calendarArray[this.calendarIndex]].getCalendarDate();
    }
    deleteCalendar() {
        for (let type in this.calendar) {
            this.calendar[type].deleteCalendar();
        }
    }
    setupCalendar() {
        for (let type in this.calendar) {
            this.calendar[type].setupCalendar();
        }
    }
    // 다다음 달의 일정을 받아오는 함수
    getReservationDate(year, month, day) {
        const data = fetchData(`/api/reservation/get/${year}/${month}/${day}`);
        return data;
    }
}

class Calendar {
    constructor(type) {
        this.calendar = document.querySelector(`.calendar.${type}-calendar`);
        this.days = this.calendar.querySelector('.calendar-days');
        this.weeks = this.calendar.querySelectorAll('.week');
        this.date = new Date(); // 현재 날짜
        if (type === 'prev') {
            this.date.setDate(1); // 이전 달이 31일이 없는 경우 1일로 설정(오류 방지)
            this.date.setMonth(this.date.getMonth() - 1); // 이전 달로 설정
        } else if (type === 'next') {
            this.date.setDate(1); // 다음 달이 31일이 없는 경우 1일로 설정(오류 방지)
            this.date.setMonth(this.date.getMonth() + 1); // 다음 달로 설정
        }
        this.lastDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0); // 현재 달의 마지막 날
        this.firstDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1); // 현재 달의 첫 날
        this.lastDay = this.lastDate.getDate(); // 마지막 날의 일자
        this.firstDay = this.firstDate.getDay(); // 첫 날의 요일
        this.day = 1; // 날짜
        this.dayReservation = {};
        this.setupCalendar();
    }
    setupCalendar() {
        this.setDefaultDayReservation();
        this.setCalendarReservation().then(() => {
            this.createYearMonth(this.date.getFullYear(), this.date.getMonth() + 1, this.calendar);
            this.createCalendar();
            this.deleteBlackWeek();
            this.markDate();
            this.createMobileReservation();
            this.setMobileCalendar();
        });
    }

    createYearMonth(year, month, calendar) {
        const yearArea = calendar.querySelector('.calendar-header-title-year');
        const monthArea = calendar.querySelector('.calendar-header-title-month');
        yearArea.textContent = `${year}. `;
        monthArea.textContent = month;
    }
    resetDay() {
        this.day = 1;
    }
    createCalendar() {
        const weeks = this.calendar.querySelectorAll('.week');
        if (this.day != 1) { this.resetDay(); }
        for (let i = 0; i < weeks.length; i++) {
            const week = weeks[i];
            for (let j = 0; j < 7; j++) {
                const date = createElement('div', { classList: ['date'], "data-date": `${this.day}`, 'data-bs-toggle': 'modal', 'data-bs-target': '#reservationModal', 'data-bs-date': `${this.day}` });
                const span = createElement('span', { classList: ['date-text'] });
                const dayReservation = createElement('div', { classList: ['date-reservation'] });
                const dayReservationList = createElement('ul', { classList: ['date-reservation-list'] });
                if ((i === 0 && j < this.firstDay) || this.day > this.lastDay) {
                    date.textContent = '';
                    date.classList.add('empty');
                    date.removeAttribute('data-date');
                    date.removeAttribute('data-bs-toggle');
                    date.removeAttribute('data-bs-target');
                    date.removeAttribute('data-bs-date');
                } else {
                    span.textContent = `${this.day}`;
                    date.appendChild(span);
                    if (this.dayReservation[this.day].length > 0) {
                        this.dayReservation[this.day].forEach((reservation) => {
                            let reservationInfo=null;
                            if(isMobile){
                                reservationInfo = createElement('i', { classList: ['bi','bi-dot']})
                                dayReservation.style.display = 'flex';
                                dayReservation.style.flexWrap = 'wrap';
                                dayReservation.appendChild(reservationInfo);
                            }
                            else if(isMobile == false){
                                reservationInfo = createElement('li', { classList: ['date-reservation-info'] },
                                [`${reservation.startDateTime.split(' ')[1].split(':')[0]}:${reservation.startDateTime.split(' ')[1].split(':')[1]}~${reservation.endDateTime.split(' ')[1].split(':')[0]}:${reservation.endDateTime.split(' ')[1].split(':')[1]} ${reservation.activity}`]);
                                dayReservationList.appendChild(reservationInfo);
                            }
                        });
                        dayReservation.appendChild(dayReservationList);
                        date.appendChild(dayReservation);
                    }
                    this.day++;
                }
                week.appendChild(date);
            }
        }
    }
    createMobileReservation() {
        if (isMobile !== true) { return; }
        const calendarBody = this.calendar.querySelector('.calendar-body-area');
        const calendarReservationDiv = createElement('div', { classList: ['calendar-reservations','d-none'], style: { padding: '0.25rem' } });
        const reservationInfoDiv = createElement('div', { classList: ['reservation-info'], style: { padding: '0.25rem' } });
        const reservationInfoTitleDiv = createElement('div', { classList: ['reservation-info-title-area'] });
        const reservationInfoTitle = createElement('h6', { classList: ['reservation-info-title'], style: { display: 'inline' } }, ['예약 정보']);
        const reservationInfoTitleAddButton = createElement("i", { classList: ['bi', 'bi-plus-lg', 'reservation-info-add-button'], style: { float: 'right', cursor: 'pointer' }, 'data-bs-toggle': 'modal', 'data-bs-target': '#reservationModal' });

        const reservationInfoDayDiv = createElement('div', { classList: ['reservation-info-day'] });
        const reservationInfoDayTitle = createElement('p', { classList: ['reservation-info-day-title'] });
        const reservationInfoListDiv = createElement('ul', { classList: ['reservation-info-list', 'list-group'] });

        reservationInfoTitleDiv.appendChild(reservationInfoTitle);
        reservationInfoTitleDiv.appendChild(reservationInfoTitleAddButton);
        reservationInfoDayDiv.appendChild(reservationInfoDayTitle);
        reservationInfoDiv.appendChild(reservationInfoDayDiv);

        reservationInfoDiv.appendChild(reservationInfoTitleDiv);
        reservationInfoDiv.appendChild(reservationInfoDayDiv);
        reservationInfoDiv.appendChild(reservationInfoListDiv);
        calendarReservationDiv.appendChild(reservationInfoDiv);
        calendarBody.appendChild(calendarReservationDiv);
    }
    setMobileCalendar() {
        if (isMobile !== true) { return; } // 모바일이 아니면 실행하지 않음

        const calendarBodyArea = this.calendar.querySelector('.calendar-body-area');
        const calendarDay = calendarBodyArea.querySelector('.calendar-days');
        const weeks = calendarDay.querySelectorAll('.week');
        const _this = this;

        // 날짜 높이 조절
        weeks.forEach((week) => {
            week.querySelectorAll('.date').forEach((date) => {
                date.style.height = '6vh';
                date.style.padding = '0.25rem'
            });
        });  

        // 날짜의 dataset 일부 삭제(모달 이동 방지)
        weeks.forEach((week) => {
            week.querySelectorAll('.date').forEach((date) => {
                date.removeAttribute('data-bs-toggle');
                date.removeAttribute('data-bs-target');
                date.removeAttribute('data-bs-date');
            });
        });

        // 날짜 클릭 시 예약 정보 표시
        weeks.forEach((week) => {
            week.querySelectorAll('.date').forEach((date) => {
                date.addEventListener('click', (e) => {
                    const dateData = date.getAttribute('data-date');
                    const reservationInfo = _this.getCalendarReservationInfo(dateData); // 클래스에서 예약 정보 가져오기
                    const yearMonth = _this.getCalendarDate(); // 클래스에서 년,월 가져오기

                    const calendarBodyArea = _this.calendar.querySelector('.calendar-body-area');
                    const calendarReservationDiv = calendarBodyArea.querySelector('.calendar-reservations');
                    const reservationInfoDiv = calendarReservationDiv.querySelector('.reservation-info');
                    const reservationInfoListDiv = reservationInfoDiv.querySelector('.reservation-info-list');
                    const reservationInfoDayDiv = reservationInfoDiv.querySelector('.reservation-info-day');

                    calendarReservationDiv.classList.remove('d-none');

                    // 날짜 변경
                    const reservationInfoDay = createElement('p', { classList: ['reservation-info-day-title'] }, [`${yearMonth.year}년 ${yearMonth.month}월 ${dateData}일`]);
                    reservationInfoDayDiv.replaceChildren(reservationInfoDay);

                    // 추가 버튼에 선택한 날짜 추가
                    calendarReservationDiv.querySelector('.reservation-info-add-button').setAttribute('data-bs-date', `${dateData}`);

                    reservationInfoListDiv.replaceChildren(); // 예약 정보 영역 초기화
                    if (reservationInfo.length === 0) {
                        const noReservationInfo = createElement('p', { classList: ['no-reservation-info', 'text-center'] }, ['예약 정보가 없습니다.']);
                        reservationInfoListDiv.appendChild(noReservationInfo);
                    } // 문구 추가
                    // 예약 정보가 있으면 예약 정보 추가
                    reservationInfo.forEach((reservation) => {
                        const reservationInfo = createElement('li', { classList: ['reservation-info-item', 'list-group-item'] }, [`${reservation.startDateTime.split(' ')[1].split(':')[0]}:${reservation.startDateTime.split(' ')[1].split(':')[1]}~${reservation.endDateTime.split(' ')[1].split(':')[0]}:${reservation.endDateTime.split(' ')[1].split(':')[1]} ${reservation.activity}`]);
                        reservationInfo.setAttribute('data-bs-toggle', 'modal');
                        reservationInfo.setAttribute('data-bs-target', '#reservationModal');
                        reservationInfo.setAttribute('data-bs-date', dateData);
                        reservationInfo.setAttribute('data-bs-reservationId', reservation.id);
                        reservationInfoListDiv.appendChild(reservationInfo);
                    });
                });
                if(date.classList.contains('today')){
                    date.click();
                }
            });
        });
    }

    setDefaultDayReservation() {
        for (let i = 1; i <= this.lastDay; i++) {
            this.dayReservation[i] = [];
        }
    }
    markDate() {
        const today = new Date();
        if (this.date.getFullYear() === today.getFullYear() && this.date.getMonth() === today.getMonth() && this.date.getDate() === today.getDate()) {
            this.weeks.forEach((week) => {
                week.querySelectorAll('.date').forEach((date) => {
                    if (date.getAttribute('data-date') === today.getDate().toString()) {
                        date.classList.add('today');
                    } else if (this.date.getMonth() <= today.getMonth() && parseInt(date.getAttribute('data-date')) < today.getDate() && date.getAttribute !== null && date.getAttribute('data-date') !== '') {
                        date.classList.add('past');
                    }
                });
            });
        } else if (this.date.getFullYear() <= today.getFullYear() && this.date.getMonth() < today.getMonth()) {
            this.weeks.forEach((week) => {
                week.querySelectorAll('.date').forEach((date) => {
                    if (date.getAttribute('data-date') !== null && date.getAttribute('data-date') !== '') {
                        date.classList.add('past');
                    }
                });
            });
        }
    }
    // 달 마지막 주가 비어있으면 삭제
    deleteBlackWeek() {
        const lastWeek = this.days.querySelector('.week:last-child')
        if (lastWeek.querySelector('.date:first-child').textContent === '') {
            lastWeek.remove();
        }
    }

    getCalendar() {
        return this.calendar;
    }

    async setCalendarReservation() {
        const thisYear = this.date.getFullYear();
        const thisMonth = this.date.getMonth() + 1 < 10 ? `0${this.date.getMonth() + 1}` : this.date.getMonth() + 1;
        const json = await fetchData(`/api/reservation/get/${thisYear}/${thisMonth}`);
        json.forEach((data) => {
            const startDateTime = data.startDateTime;
            const day = parseInt(startDateTime.split(' ')[0].split('-')[2]);
            const reservationInfo = { id: data.id, startDateTime: startDateTime, endDateTime: data.endDateTime, activity: data.activity, reservationPerson: data.reservationPerson };
            this.dayReservation[day].push(reservationInfo);
        });
    }

    getCalendarReservationInfo(date) {
        return this.dayReservation[date];
    }
    getCalendarDate() {
        return { year: this.date.getFullYear(), month: this.date.getMonth() + 1 };
    }

    deleteCalendar() {
        this.calendar.querySelectorAll('.week').forEach((week) => {
            week.replaceChildren();
        });
    }
}
class CalendarModalManager {
    constructor() {
        this.date = null;
        this.isPast = false;
        this.reservationInfo = [];
        this.selectedReservationTime = new Set();
        this.reservationArea = document.getElementById('reservationModal').querySelector('.reservation-area');
        this.getSelectedReservationTime = this.getSelectedReservationTime.bind(this);
        this.getReservationDate = this.getReservationDate.bind(this);
    }
    setReservationInfo(reservationInfo) {
        this.reservationInfo = reservationInfo;
    }
    getReservationInfo() {
        return this.reservationInfo;
    }
    setReservationDate(date) {
        this.date = date;
    }
    getReservationDate() {
        return this.date;
    }
    setIsPast(isPast) {
        this.isPast = isPast;
    }
    getIsPast() {
        return this.isPast;
    }
    findIsPast(date) {
        const today = new Date();
        const _date = { ...date };
        if (_date.year === today.getFullYear() && _date.month === today.getMonth() + 1 && _date.date === today.getDate()) {
            return false;
        } else if (_date.year <= today.getFullYear() && _date.month < today.getMonth() + 1) {
            return true;
        } else if (_date.year <= today.getFullYear() && _date.month === today.getMonth() + 1 && _date.date < today.getDate()) {
            return true;
        } else {
            return false;
        }
    }
    resetReservationData() {
        this.date = null;
        this.reservationInfo = [];
        this.selectedReservationTime = new Set();
    }
    setReservationAreaEvent(reservationArea) {
        const reservations = reservationArea.querySelectorAll('div[class*="reservation"]');
        reservations.forEach((reservation) => {
            reservation.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('reserved')) {
                    return;
                }
                if (this.getIsPast()) {
                    alert('금일 지난 날짜는 예약할 수 없습니다.');
                    return;
                }

                target.classList.toggle('selected');

                if (target.classList.contains('selected')) {
                    this.selectedReservationTime.add(target.dataset.number);
                } else {
                    this.selectedReservationTime.delete(target.dataset.number);
                }
            });
        });
    }

    findSelectedRange(reservations, reservationIndex) {
        const startNumber = Array.from(reservations).filter((reservation) => reservation.classList.contains('selected'))[0].dataset.number;
        const endNumber = reservationIndex;
        return { start: startNumber, end: endNumber };
    }

    calculateTime(selectedRange) {
        // 정수는 시간, 소수는 분으로 계산(0.5 = 30분)
        const startTime = 9; // Start time in hours
        const timeInterval = 0.5; // Time interval in hours
        const timeSlots = 24; // Total number of time slots

        const selectedStartTime = startTime + (selectedRange.start - 1) * timeInterval;
        const selectedEndTime = startTime + selectedRange.end * timeInterval;
        return {
            startTime: selectedStartTime,
            endTime: selectedEndTime
        };
    }
    getSelectedReservationTime() {
        return Array.from(this.selectedReservationTime).sort((a, b) => a - b);
    }

    createTimeTable() {
        const modalHeader = createElement('div', { classList: ['modal-header'], style: 'width: 100%' });
        const modalTitle = createElement('h1', { classList: ['modal-title', 'fs-5'], id: 'reservationModalLabel' });
        const closeButton = createElement('button', { classList: ['btn-close'], 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        const modalBody = createElement('div', { classList: ['modal-body'], style: 'width: 100%' });
        const timeTableDiv = createElement('div', { classList: ['time-table', 'row', 'container'] });
        const timesAreaDiv = createElement('div', { classList: ['times-area', 'col-3'] });
        const reservationAreaDiv = createElement('div', { classList: ['reservation-area', 'col-9', 'position-relative'] });
        for (let i = 9; i <= 21; i++) {
            const timeDiv = createElement('div', { classList: ['time'] }, [i < 10 ? `0${i}:00` : `${i}:00`]);
            timesAreaDiv.appendChild(timeDiv);
        }
        for (let i = 1; i <= 12; i++) {
            if (i % 2 === 0) {
                const reservationDivisionDiv = createElement('div', { classList: ['reservation-division'], 'data-number': `${i}` });
                reservationAreaDiv.appendChild(reservationDivisionDiv);
            } else {
                const reservationDiv = createElement('div', { classList: ['reservation'], 'data-number': `${i}` });
                reservationAreaDiv.appendChild(reservationDiv);
            }
        }
        this.setReservationAreaEvent(reservationAreaDiv); // 이벤트 추가
        timeTableDiv.appendChild(timesAreaDiv);
        timeTableDiv.appendChild(reservationAreaDiv);
        modalBody.appendChild(timeTableDiv);

        const modalFooter = createElement('div', { classList: ['modal-footer'] });
        const cancelButton = createElement('button', { classList: ['btn', 'btn-secondary'], 'data-bs-dismiss': 'modal', type: 'button' }, ['취소']);
        const reservationButton = createElement('button', { classList: ['btn', 'btn-primary', 'reservationButton'], type: 'button' }, ['예약하기']);

        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(reservationButton);

        return [modalHeader, modalBody, modalFooter];
    }
    createReservationForm() {
        const _this = this; // this를 _this로 저장
        // modal-header 생성
        const modalHeader = createElement('div', { classList: ['modal-header'], style: 'width: 100%' });
        const modalTitle = createElement('h1', { classList: ['modal-title', 'fs-5'], id: 'reservationModalLabel' }, ['공간 예약 신청']);
        const closeButton = createElement('button', { classList: ['btn-close'], 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // modal-body 생성
        const modalBody = createElement('div', { classList: ['modal-body'], style: 'width: 100%' });

        const switchDiv = createElement('div', { classList: ['form-check', 'form-switch', 'form-check', 'mb-3'] });
        const switchInput = createElement('input', { classList: ['form-check-input'], type: 'checkbox', id: 'reservationSwitch', role: 'switch' });
        const switchLabel = createElement('label', { classList: ['form-check-label'], for: 'reservationSwitch' }, ['반복 예약 하기']);
        switchInput.addEventListener('change', (e) => {
            const checkbox = e.target;
            const repeatDateDiv = reservationForm.querySelector('.repeat-date');
            checkbox.checked ? repeatDateDiv.classList.remove('d-none') : repeatDateDiv.classList.add('d-none');
        });
        switchDiv.appendChild(switchInput);
        switchDiv.appendChild(switchLabel);

        const reservationForm = createElement('form', { action: '/api/reservation/create', method: 'post', id: 'reservationForm' });

        // const dateInput = createElement('input', { id: 'dateInput', type: 'hidden', name: 'reservationDate', value: '' });
        const dateDiv = createElement('div', { classList: ['mb-3'] });
        const dateLabel = createElement('label', { for: 'dateInput', classList: ['form-label'] }, ['날짜']);
        const dateInput = createElement('input', { classList: ['form-control'], id: 'dateInput', type: 'date', name: 'reservationDate' });
        dateInput.readOnly = true;
        dateDiv.appendChild(dateLabel);
        dateDiv.appendChild(dateInput);

        const repeatDateDiv = createElement('div', { classList: ['mb-3', 'repeat-date', 'd-none'] });
        const repeatDateLabel = createElement('p', { classList: ['repeat-date-title', 'mb-3'] }, ['반복 날짜']);
        const repeatDateRowDiv = createElement('div', { classList: ['mb-3', 'repeat-date-row', 'row', 'row-cols-2'] });
        repeatDateDiv.appendChild(repeatDateLabel);
        repeatDateDiv.appendChild(repeatDateRowDiv);

        const activityDiv = createElement('div', { classList: ['mb-3'] });
        const activityLabel = createElement('label', { for: 'activityInput', classList: ['form-label'] }, ['활동명']);
        const activityInput = createElement('input', { type: 'text', classList: ['form-control'], id: 'activityInput', name: 'activity', placeholder: '공간에서 하실 활동을 입력해주세요' });
        activityDiv.appendChild(activityLabel);
        activityDiv.appendChild(activityInput);

        const timeSelectDiv = createElement('div', { classList: ['row', 'mb-3'] });

        const startTimeDiv = createElement('div', { classList: ['col'] });
        const startTimeLabel = createElement('label', { for: 'startTimeSelect', classList: ['form-label'] }, ['시작 시간']);
        const startTimeSelect = createElement('select', { id: 'startTimeSelect', name: 'startTime', classList: ['form-select'], 'aria-label': 'Start time' });
        for (let i = 9; i <= 20; i++) {
            const option = createElement('option', { value: i < 10 ? `0${i}:00` : `${i}:00` }, [i < 10 ? `0${i}:00` : `${i}:00`]);
            startTimeSelect.appendChild(option);
        }
        startTimeDiv.appendChild(startTimeLabel);
        startTimeDiv.appendChild(startTimeSelect);

        const endTimeDiv = createElement('div', { classList: ['col'] });
        const endTimeLabel = createElement('label', { for: 'endTimeSelect', classList: ['form-label'] }, ['종료 시간']);
        const endTimeSelect = createElement('select', { id: 'endTimeSelect', name: 'endTime', classList: ['form-select'], 'aria-label': 'End time' });
        for (let i = 10; i <= 21; i++) {
            const option = createElement('option', { value: i < 10 ? `0${i}:00` : `${i}:00` }, [i < 10 ? `0${i}:00` : `${i}:00`]);
            endTimeSelect.appendChild(option);
        }
        endTimeDiv.appendChild(endTimeLabel);
        endTimeDiv.appendChild(endTimeSelect);

        timeSelectDiv.appendChild(startTimeDiv);
        timeSelectDiv.appendChild(endTimeDiv);

        const nameDiv = createElement('div', { classList: ['mb-3'] });
        const nameLabel = createElement('label', { for: 'nameInput', classList: ['form-label'] }, ['예약자']);
        const nameInput = createElement('input', { id: 'nameInput', type: 'text', name: 'name', classList: ['form-control'], placeholder: '성함을 입력해주세요' });
        nameDiv.appendChild(nameLabel);
        nameDiv.appendChild(nameInput);

        const passwordDiv = createElement('div', { classList: ['mb-3'] });
        const passwordLabel = createElement('label', { for: 'passwordInput', classList: ['form-label'] }, ['비밀번호']);
        const passwordInput = createElement('input', { id: 'passwordInput', type: 'password', name: 'password', classList: ['form-control'], placeholder: '비밀번호 4자리 입력해주세요' });
        passwordDiv.appendChild(passwordLabel);
        passwordDiv.appendChild(passwordInput);

        reservationForm.appendChild(dateDiv);
        reservationForm.appendChild(repeatDateDiv);
        reservationForm.appendChild(activityDiv);
        reservationForm.appendChild(timeSelectDiv);
        reservationForm.appendChild(nameDiv);
        reservationForm.appendChild(passwordDiv);
        setReservatationFormFill(reservationForm);
        setReservationFormSubmit(reservationForm);

        modalBody.appendChild(switchDiv);
        modalBody.appendChild(reservationForm);

        // modal-footer 생성
        const modalFooter = createElement('div', { classList: ['modal-footer'] });
        const cancelButton = createElement('button', { classList: ['btn', 'btn-secondary'], 'data-bs-dismiss': 'modal', type: 'button' }, ['취소']);
        const reservationButton = createElement('button', { classList: ['btn', 'btn-primary'], type: 'submit', form: 'reservationForm' }, ['예약하기']);

        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(reservationButton);


        function setReservatationFormFill(form) {
            const startSelect = form.querySelector('#startTimeSelect');
            const endSelect = form.querySelector('#endTimeSelect');
            const reservationDate = form.querySelector('#dateInput');
            const repeatDateInputRowDiv = form.querySelector('.repeat-date-row');

            const selectedReservationTime = _this.getSelectedReservationTime();
            const dateData = _this.getReservationDate();

            dateData.month = dateData.month < 10 ? `0${dateData.month}` : dateData.month;
            const formattedReservationDate = `${dateData.year}-${dateData.month}-${parseInt(dateData.date) < 10 ? `0${dateData.date}` : dateData.date}`;

            const startTimeNumber = parseInt(selectedReservationTime[0]);
            const endTimeNumber = parseInt(selectedReservationTime[selectedReservationTime.length - 1]) + 1;

            const formattedStartTime = startTimeNumber + 8 < 10 ? `0${startTimeNumber + 8}:00` : `${startTimeNumber + 8}:00`;
            const formattedEndTime = endTimeNumber + 8 < 10 ? `0${endTimeNumber + 8}:00` : `${endTimeNumber + 8}:00`;

            const repeatDateInputList = createRepeatDateInput(dateData);
            repeatDateInputList.forEach((repeatDateInput) => {
                repeatDateInputRowDiv.appendChild(repeatDateInput);
            });

            reservationDate.value = formattedReservationDate;
            reservationDate.min = formattedReservationDate;
            reservationDate.max = formattedReservationDate;
            startSelect.querySelector(`option[value="${formattedStartTime}"]`).selected = true;
            endSelect.querySelector(`option[value="${formattedEndTime}"]`).selected = true;



            function createRepeatDateInput(dateData) {
                const reservationDate = dateData;
                const nextMonthDate = new Date(reservationDate.year, parseInt(reservationDate.month) + 1, 0);
                const repeatDateList = [];
                let changeDate = new Date(reservationDate.year, parseInt(reservationDate.month) - 1, reservationDate.date + 7); // 다음 주로 변경
                let index = 1;
                while (changeDate <= nextMonthDate) {
                    const formattedChangeDate = `${changeDate.getFullYear()}-${changeDate.getMonth() + 1 < 10 ? `0${changeDate.getMonth() + 1}` : changeDate.getMonth() + 1}-${changeDate.getDate() < 10 ? `0${changeDate.getDate()}` : changeDate.getDate()}`;
                    const repeatDateDiv = createElement('div', { classList: ['mb-3', 'container', 'repeat-date', 'form-check', 'col',] });
                    const repeatDateInput = createElement('input', { type: 'checkbox', classList: ['form-check-input'], id: `repeatDateInput-${index}`, name: 'repeatReservationDate', value: formattedChangeDate });
                    const repeatDateLabel = createElement('label', { for: `repeatDateInput-${index}`, classList: ['form-check-label'] }, [formattedChangeDate]);
                    repeatDateDiv.appendChild(repeatDateInput);
                    repeatDateDiv.appendChild(repeatDateLabel);
                    repeatDateList.push(repeatDateDiv);
                    changeDate = new Date(changeDate.setDate(changeDate.getDate() + 7));
                    index++;
                }
                return repeatDateList;
            }
        }

        function setReservationFormSubmit(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const reservationDate = formData.get('reservationDate');
                const repeatReservationDate = formData.getAll('repeatReservationDate');
                const startTime = formData.get('startTime');
                const endTime = formData.get('endTime');
                const password = formData.get('password');
                const reservationPerson = formData.get('name');
                const activity = formData.get('activity');

                if (password.length === 0) {
                    alert('비밀번호를 입력해주세요.');
                    return;
                } else if (password.length < 4) {
                    alert('비밀번호가 4자리 미만입니다. 비밀번호를 4자리로 입력해주세요.');
                    return;
                } else if (password.length > 4) {
                    alert('비밀번호가 4자리 초과입니다. 비밀번호를 4자리로 입력해주세요.');
                    return;
                } else if (password.match(/[^0-9]/)) {
                    alert('비밀번호는 숫자로만 입력해주세요.');
                    return;
                }

                if (activity.length === 0) {
                    alert('활동 내용을 입력해주세요.');
                    return;
                } else if (activity.startsWith(' ') || activity.endsWith(' ')) {
                    alert('활동 내용 처음과 마지막에 공백을 입력할 수 없습니다.');
                    return;
                }
                else if (activity.match(/^\d/)) {
                    alert('활동 내용은 숫자로 시작할 수 없습니다.');
                    return;
                }
                else if (activity.match(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]/)) {
                    alert('활동 내용에 특수문자를 입력할 수 없습니다.');
                    return;
                }


                if (reservationPerson.length === 0) {
                    alert('예약자명을 입력해주세요.');
                    return;
                } else if (reservationPerson.startsWith(' ') || reservationPerson.endsWith(' ')) {
                    alert('예약자명 처음과 마지막에 공백을 입력할 수 없습니다.');
                    return;
                }
                else if (reservationPerson.match(/^\d/)) {
                    alert('예약자명은 숫자로 시작할 수 없습니다.');
                    return;
                }
                else if (reservationPerson.match(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]/)) {
                    alert('예약자명에 특수문자를 입력할 수 없습니다.');
                    return;
                }


                if (parseInt(startTime.split(':')[0]) === parseInt(endTime.split(':')[0])) {
                    alert('시작 시간과 종료 시간이 같습니다.');
                    return;
                } else if (parseInt(startTime.split(':')[0]) > parseInt(endTime.split(':')[0])) {
                    alert('종료 시간이 시작 시간보다 빠릅니다.');
                    return;
                }

                if (_this.checkReservationTimeForCreate(reservationDate, startTime, endTime)) {
                    alert('예약이 불가능한 시간입니다. 시간을 다시 한 번 확인해주세요.');
                    return;
                }

                if (repeatReservationDate.length > 0) {
                    for (let i = 0; i < repeatReservationDate.length; i++) {
                        if (_this.checkReservationTimeForCreate(repeatReservationDate[i], startTime, endTime)) {
                            alert('예약이 불가능한 시간입니다. 시간을 다시 한 번 확인해주세요.');
                            return;
                        }
                    }
                }

                const reservationInfo = {
                    reservationDate: reservationDate,
                    repeatReservationDate: repeatReservationDate,
                    startTime: startTime,
                    endTime: endTime,
                    activity: activity,
                    reservationPerson: reservationPerson,
                    password: password
                };
                const response = await fetch('/api/reservation/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reservationInfo),
                });
                // response의 success 여부에 따라 alert창을 띄워준다.
                if (response) {
                    response.json().then((data) => {
                        if (data.success) {
                            alert('예약이 완료되었습니다.');
                            bootstrap.Modal.getInstance(document.getElementById('reservationModal')).hide();
                            calendarManager.deleteCalendar();
                            calendarManager.setupCalendar();
                        } else {
                            alert('예약에 실패했습니다.');
                        }
                    });
                }
            });
        }


        return [modalHeader, modalBody, modalFooter];
    }
    createReservationAuthForm(id) {
        const _this = this;
        const modalHeader = createElement('div', { classList: ['modal-header'], style: 'width: 100%' });
        const modalTitle = createElement('h1', { classList: ['modal-title', 'fs-5'], id: 'reservationModalLabel' }, ['예약 확인']);
        const closeButton = createElement('button', { classList: ['btn-close'], 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        const modalBody = createElement('div', { classList: ['modal-body'], style: 'width: 100%' });
        const reservationAuthForm = createElement('form', { action: '/api/reservation/auth', method: 'post', id: 'reservationAuthForm', 'data-reservationId': `${id}` });

        const passwordDiv = createElement('div', { classList: ['row'] });
        const passwordLabel = createElement('label', { for: 'reservationAuthPassword', classList: ['form-label', 'col-sm-2', 'col-form-label'] }, ['비밀번호']);
        const passwordInputDiv = createElement('div', { classList: ['col-sm-10'] });
        const passwordInput = createElement('input', { id: 'reservationAuthPassword', type: 'password', name: 'password', classList: ['form-control'], placeholder: '비밀번호 4자리 입력해주세요' });
        passwordInputDiv.appendChild(passwordInput);
        passwordDiv.appendChild(passwordLabel);
        passwordDiv.appendChild(passwordInputDiv);

        reservationAuthForm.appendChild(passwordDiv);
        setReservationAuthFormSubmit(reservationAuthForm);
        modalBody.appendChild(reservationAuthForm);

        const modalFooter = createElement('div', { classList: ['modal-footer'] });
        const cancelButton = createElement('button', { classList: ['btn', 'btn-secondary'], 'data-bs-dismiss': 'modal', type: 'button' }, ['취소']);
        const reservationButton = createElement('button', { classList: ['btn', 'btn-primary'], type: 'submit', form: 'reservationAuthForm' }, ['확인']);

        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(reservationButton);

        function setReservationAuthFormSubmit(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const reservationId = form.getAttribute('data-reservationId');
                const password = form.querySelector('#reservationAuthPassword').value;
                if (password.length === 0) {
                    alert('비밀번호가 비어있습니다. 비밀번호를 입력해주세요.');
                    return;
                } else if (password.length < 4) {
                    alert('비밀번호가 4자리 미만입니다. 비밀번호를 4자리로 입력해주세요.');
                    return;
                } else if (password.length > 4) {
                    alert('비밀번호가 4자리 초과입니다. 비밀번호를 4자리로 입력해주세요.');
                    return;
                } else if (password.match(/[^0-9]/)) {
                    alert('숫자 이외의 문자가 들어가 있습니다. 비밀번호는 숫자로만 입력해주세요.');
                    return;
                }
                const response = await fetch('/api/reservation/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ reservationId: reservationId, password: password }),
                });
                if (response) {
                    response.json().then((data) => {
                        if (data.success) {
                            alert('인증되었습니다.');
                            document.getElementById('reservationModal').querySelector('.modal-content').replaceChildren(..._this.createReservationChangeForm(reservationId));
                        } else {
                            alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
                        }
                    });
                }
            });
        }
        return [modalHeader, modalBody, modalFooter];
    }
    createReservationChangeForm(reservationId) {
        const _this = this;
        const reservationInfo = this.getReservationInfo().find((reservation) => reservation.id === parseInt(reservationId));
        const modalHeader = createElement('div', { classList: ['modal-header'], style: 'width: 100%' });
        const modalTitle = createElement('h1', { classList: ['modal-title', 'fs-5'], id: 'reservationChangeModalLabel' }, ['예약 변경']);
        const closeButton = createElement('button', { classList: ['btn-close'], 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        const modalBody = createElement('div', { classList: ['modal-body'], style: 'width: 100%' });
        const reservationChangeForm = createElement('form', { action: '/api/reservation/update', method: 'post', id: 'reservationChangeForm', 'data-reservationId': reservationId });

        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
        const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        const formattedNextMonthDate = `${nextMonthDate.getFullYear()}-${nextMonthDate.getMonth() + 1 < 10 ? `0${nextMonthDate.getMonth() + 1}` : nextMonthDate.getMonth() + 1}-${nextMonthDate.getDate() < 10 ? `0${nextMonthDate.getDate()}` : nextMonthDate.getDate()}`;

        const dateDiv = createElement('div', { classList: ['mb-3'] });
        const dateLabel = createElement('label', { for: 'modifiedDateInput', classList: ['form-label'] }, ['날짜']);
        const dateInput = createElement('input', { classList: ['form-control'], id: 'modifiedDateInput', type: 'date', name: 'reservationDate', value: `${reservationInfo.startDateTime.split(' ')[0]}`, min: `${formattedDate}`, max: `${formattedNextMonthDate}` });
        dateDiv.appendChild(dateLabel);
        dateDiv.appendChild(dateInput);

        const activityDiv = createElement('div', { classList: ['mb-3'] });
        const activityLabel = createElement('label', { for: 'modifiedActivityInput', classList: ['form-label'] }, ['활동명']);
        const activityInput = createElement('input', { type: 'text', classList: ['form-control'], id: 'modifiedActivityInput', name: 'activity', placeholder: '공간에서 하실 활동을 입력해주세요' });
        activityInput.value = reservationInfo.activity;
        activityDiv.appendChild(activityLabel);
        activityDiv.appendChild(activityInput);

        const timeSelectDiv = createElement('div', { classList: ['row', 'mb-3'] });

        const startTimeDiv = createElement('div', { classList: ['col'] });
        const startTimeLabel = createElement('label', { for: 'modifiedStartTimeSelect', classList: ['form-label'] }, ['시작 시간']);
        const startTimeSelect = createElement('select', { id: 'modifiedStartTimeSelect', name: 'startTime', classList: ['form-select'], 'aria-label': 'Start time' });
        for (let i = 9; i <= 20; i++) {
            const option = createElement('option', { value: i < 10 ? `0${i}:00` : `${i}:00` }, [i < 10 ? `0${i}:00` : `${i}:00`]);
            startTimeSelect.appendChild(option);
        }
        startTimeSelect.querySelector(`option[value="${reservationInfo.startDateTime.split(' ')[1].split(':')[0]}:00"]`).selected = true;
        startTimeDiv.appendChild(startTimeLabel);
        startTimeDiv.appendChild(startTimeSelect);

        const endTimeDiv = createElement('div', { classList: ['col'] });
        const endTimeLabel = createElement('label', { for: 'modifiedEndTimeSelect', classList: ['form-label'] }, ['종료 시간']);
        const endTimeSelect = createElement('select', { id: 'modifiedEndTimeSelect', name: 'endTime', classList: ['form-select'], 'aria-label': 'End time' });
        for (let i = 10; i <= 21; i++) {
            const option = createElement('option', { value: i < 10 ? `0${i}:00` : `${i}:00` }, [i < 10 ? `0${i}:00` : `${i}:00`]);
            endTimeSelect.appendChild(option);
        }
        endTimeSelect.querySelector(`option[value="${reservationInfo.endDateTime.split(' ')[1].split(':')[0]}:00"]`).selected = true;
        endTimeDiv.appendChild(endTimeLabel);
        endTimeDiv.appendChild(endTimeSelect);

        timeSelectDiv.appendChild(startTimeDiv);
        timeSelectDiv.appendChild(endTimeDiv);

        const nameDiv = createElement('div', { classList: ['mb-3'] });
        const nameLabel = createElement('label', { for: 'modifiedNameInput', classList: ['form-label'] }, ['예약자']);
        const nameInput = createElement('input', { id: 'modifiedNameInput', type: 'text', name: 'name', classList: ['form-control'], placeholder: '성함을 입력해주세요' });
        nameInput.value = reservationInfo.reservationPerson;

        nameDiv.appendChild(nameLabel);
        nameDiv.appendChild(nameInput);

        const passwordDiv = createElement('div', { classList: ['mb-3'] });
        const passwordLabel = createElement('label', { for: 'modifiedPasswordInput', classList: ['form-label'] }, ['비밀번호']);
        const passwordInput = createElement('input', { id: 'modifiedPasswordInput', type: 'password', name: 'password', classList: ['form-control'], placeholder: '비밀번호 4자리 입력해주세요' });

        passwordDiv.appendChild(passwordLabel);
        passwordDiv.appendChild(passwordInput);

        reservationChangeForm.appendChild(dateDiv);
        reservationChangeForm.appendChild(activityDiv);
        reservationChangeForm.appendChild(timeSelectDiv);
        reservationChangeForm.appendChild(nameDiv);
        reservationChangeForm.appendChild(passwordDiv);
        setReservationChangeFormUpdateSubmit(reservationChangeForm, reservationInfo);
        modalBody.appendChild(reservationChangeForm);

        const modalFooter = createElement('div', { classList: ['modal-footer'] });
        const cancelButton = createElement('button', { classList: ['btn', 'btn-secondary'], 'data-bs-dismiss': 'modal', type: 'button' }, ['취소']);
        const reservationButton = createElement('button', { classList: ['btn', 'btn-primary'], type: 'submit', form: 'reservationChangeForm' }, ['변경하기']);
        const deleteButton = createElement('button', { classList: ['btn', 'btn-danger'], type: 'button', id: 'deleteReservationButton' }, ['삭제하기']);

        setReservationDeleteButtonEvent(deleteButton, reservationId);
        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(reservationButton);
        modalFooter.appendChild(deleteButton);

        function setReservationChangeFormUpdateSubmit(form, reservationInfo) {
            const localReservationInfo = reservationInfo;
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const reservationId = form.getAttribute('data-reservationId');
                const reservationDate = formData.get('reservationDate');
                const startTime = formData.get('startTime');
                const endTime = formData.get('endTime');
                const password = formData.get('password');
                const reservationPerson = formData.get('name');
                const activity = formData.get('activity');

                if (reservationDate === localReservationInfo.startDateTime.split(' ')[0] && startTime === localReservationInfo.startDateTime.split(' ')[1].split(':')[0] && endTime === localReservationInfo.endDateTime.split(' ')[1].split(':')[0] && reservationPerson === localReservationInfo.reservationPerson && activity === localReservationInfo.activity) {
                    alert('변경된 내용이 없습니다.');
                    return;
                }

                if (password.length === 0) {
                    alert('비밀번호를 입력해주세요.');
                    return;
                } else if (password.length < 4) {
                    alert('비밀번호가 4자리 미만입니다. 비밀번호를 4자리로 입력해주세요.');
                    return;
                } else if (password.length > 4) {
                    alert('비밀번호가 4자리 초과입니다. 비밀번호를 4자리로 입력해주세요.');
                    return;
                } else if (password.match(/[^0-9]/)) {
                    alert('숫자 이외의 문자가 들어가 있습니다. 비밀번호는 숫자로만 입력해주세요.');
                    return;
                }

                if (activity.length === 0) {
                    alert('활동 내용을 입력해주세요.');
                    return;
                } else if (activity.startsWith(' ') || activity.endsWith(' ')) {
                    alert('활동 내용 처음과 마지막에 공백을 입력할 수 없습니다.');
                    return;
                }
                else if (activity.match(/^\d/)) {
                    alert('활동 내용은 숫자로 시작할 수 없습니다.');
                    return;
                }
                else if (activity.match(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]/)) {
                    alert('활동 내용에 특수문자를 입력할 수 없습니다.');
                    return;
                }

                if (reservationPerson.length === 0) {
                    alert('예약자명을 입력해주세요.');
                    return;
                }
                else if (reservationPerson.startsWith(' ') || reservationPerson.endsWith(' ')) {
                    alert('예약자명 처음과 마지막에 공백을 입력할 수 없습니다.');
                    return;
                }
                else if (reservationPerson.match(/^\d/)) {
                    alert('예약자명은 숫자로 시작할 수 없습니다.');
                    return;
                }
                else if (reservationPerson.match(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]/)) {
                    alert('예약자명에 특수문자를 입력할 수 없습니다.');
                    return;
                }

                if (parseInt(startTime.split(':')[0]) === parseInt(endTime.split(':')[0])) {
                    alert('시작 시간과 종료 시간이 같습니다.');
                    return;
                }
                else if (parseInt(startTime.split(':')[0]) > parseInt(endTime.split(':')[0])) {
                    alert('종료 시간이 시작 시간보다 빠릅니다.');
                    return;
                }

                if (_this.checkReservationTimeForUpdate(reservationId, reservationDate, startTime, endTime)) {
                    alert('예약이 불가능한 시간입니다. 시간을 다시 한 번 확인해주세요.');
                    return;
                }

                const reservationInfo = {
                    reservationId: reservationId,
                    reservationDate: reservationDate,
                    startTime: startTime,
                    endTime: endTime,
                    activity: activity,
                    reservationPerson: reservationPerson,
                    password: password
                };
                const response = await fetch('/api/reservation/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reservationInfo),
                });
                if (response) {
                    response.json().then((data) => {
                        if (data.success) {
                            alert('변경이 완료되었습니다.');
                            bootstrap.Modal.getInstance(document.getElementById('reservationModal')).hide();
                            calendarManager.deleteCalendar();
                            calendarManager.setupCalendar();
                        } else {
                            alert('변경에 실패했습니다.');
                        }
                    });
                }
            });
        }

        function setReservationDeleteButtonEvent(button, reservationId) {
            button.addEventListener('click', async (e) => {
                const response = await fetch('/api/reservation/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ reservationId: reservationId }),
                });
                if (response) {
                    response.json().then((data) => {
                        if (data.success) {
                            alert('삭제가 완료되었습니다.');
                            bootstrap.Modal.getInstance(document.getElementById('reservationModal')).hide();
                            calendarManager.deleteCalendar();
                            calendarManager.setupCalendar();
                        } else {
                            alert('삭제에 실패했습니다.');
                        }
                    });
                }
            });
        }
        return [modalHeader, modalBody, modalFooter];
    }
    checkReservationTime(newReservationTime, existingReservationInfo) {
        // 예약이 불가능한 시간인지 확인
        const isReservationTime = existingReservationInfo.some((reservation) => {
            const existingReservationStart = parseInt(reservation.startDateTime.split(' ')[1].split(':')[0]);
            const existingReservationEnd = parseInt(reservation.endDateTime.split(' ')[1].split(':')[0]);

            // if((newReservationTime.start>=existingReservationStart && newReservationTime.start<existingReservationEnd)
            // ||(newReservationTime.end>existingReservationStart && newReservationTime.end<=existingReservationEnd)
            // ||(newReservationTime.start<existingReservationStart && newReservationTime.end>=existingReservationEnd)){
            //     return true;
            // }
            if (newReservationTime.start >= existingReservationStart && newReservationTime.start < existingReservationEnd) {
                return true;
            }

            if (newReservationTime.end > existingReservationStart && newReservationTime.end <= existingReservationEnd) {
                return true;
            }
            if (newReservationTime.start < existingReservationStart && newReservationTime.end >= existingReservationEnd) {
                return true;
            }

            return false;
        });
        return isReservationTime;
    }
    checkReservationTimeForCreate(date, startTime, endTime) {
        const newReservationTime = {
            start: parseInt(startTime.split(':')[0]),
            end: parseInt(endTime.split(':')[0])
        };

        const reservationInfo = calendarManager.getCalendarReservationInfoByDate(date);

        // 예약이 불가능한 시간인지 확인
        const isOverlap = reservationInfo.length > 0 ? this.checkReservationTime(newReservationTime, reservationInfo) : false;
        return isOverlap;
    }
    checkReservationTimeForUpdate(reservationId, date, startTime, endTime) {
        const newReservationTime = {
            start: parseInt(startTime.split(':')[0]),
            end: parseInt(endTime.split(':')[0])
        };
        const originalReservationInfo = calendarManager.getCalendarReservationInfoByDate(date);
        const existingReservationInfo = originalReservationInfo.filter((reservation) => reservation.id !== parseInt(reservationId));

        // 예약이 불가능한 시간인지 확인
        const isOverlap = this.checkReservationTime(newReservationTime, existingReservationInfo);
        return isOverlap;
    }

    setTimeTable(reservationModalContent, dateReservationInfo) {
        reservationModalContent.replaceChildren(...this.createTimeTable());
        reservationModalContent.querySelector('.modal-footer').querySelector('.reservationButton').addEventListener('click', (e) => {
            reservationModalContent.replaceChildren(...this.createReservationForm());
        });
        const dateInfo = this.getReservationDate();
        const _this = this;

        const reservationModalTitle = reservationModalContent.querySelector('.modal-title');
        reservationModalTitle.textContent = `${dateInfo.year}년 ${dateInfo.month}월 ${dateInfo.date}일 예약 현황`;
        setReservationInfoElement(reservationModalContent, dateReservationInfo);

        function setReservationInfoElement(reservationModalContent, reservationInfo) {
            let count = 0;
            reservationInfo.forEach((info) => {
                const startTime = `${info.startDateTime.split(' ')[1].split(':')[0]}:${info.startDateTime.split(' ')[1].split(':')[1]}`;
                const endTime = `${info.endDateTime.split(' ')[1].split(':')[0]}:${info.endDateTime.split(' ')[1].split(':')[1]}`;
                const convertedStartNumber = convertTimeToNumber(startTime);
                const convertedEndNumber = convertTimeToNumber(endTime);
                const interval = convertedEndNumber - convertedStartNumber;
                count++;
                for (let i = convertedStartNumber; i < convertedStartNumber + interval; i++) {
                    const reservationElement = findReservationElement(i);
                    reservationElement.classList.add('reserved');
                    reservationElement.setAttribute('data-reservationId', `${info.id}`);

                    if (i === convertedStartNumber) {
                        reservationElement.textContent = `${info.activity}`;
                    }
                    if (count % 2 === 0) { // 짝수번째 예약은 배경색을 다르게 한다.
                        reservationElement.style.backgroundColor = 'rgba(0,162,255,0.3)';
                    }
                    reservationElement.addEventListener('click', (e) => {
                        if (_this.getIsPast()) {
                            alert('지난 예약은 변경 및 삭제가 불가능합니다.');
                            return;
                        }
                        e.preventDefault();
                        const reservationId = e.target.getAttribute('data-reservationId');
                        reservationModalContent.replaceChildren(..._this.createReservationAuthForm(reservationId));
                    });
                }
            });
        }
        function convertTimeToNumber(time) {
            const convertedTime = parseInt(time.split(':')[0]) + (parseInt(time.split(':')[1]) / 60);
            return convertedTime - 8
        }
        function findReservationElement(timeNumber) {
            const reservationArea = document.getElementById('reservationModal').querySelector('.reservation-area');
            return reservationArea.querySelector(`div[data-number='${timeNumber}']`);
        }
    }

    setReservationModal() {
        const _this = this;
        const reservationModal = document.getElementById('reservationModal');
        const reservationModalContent = reservationModal.querySelector('.modal-content');
        const reservationModalBody = reservationModal.querySelector('.modal-body');
        const reservationArea = reservationModalBody.querySelector('.reservation-area');

        reservationModal.addEventListener('show.bs.modal', (event) => {
            _this.resetReservationData();
            const date = event.relatedTarget.getAttribute('data-bs-date')
            const reservationInfoId = event.relatedTarget.getAttribute('data-bs-reservationId');
            const yearMonthInfo = calendarManager.getCalendarDate();
            const dateReservationInfo = calendarManager.getCalendarReservationInfo(date);
            this.setReservationInfo([...dateReservationInfo]);
            this.setReservationDate({ year: yearMonthInfo.year, month: yearMonthInfo.month, date: parseInt(date) });
            this.setIsPast(this.findIsPast(this.getReservationDate()));

            if (reservationInfoId) {
                reservationModalContent.replaceChildren(..._this.createReservationAuthForm(reservationInfoId));
            } else {
                this.setTimeTable(reservationModalContent, dateReservationInfo);
            }
        });
    }
}


function createCalendar(calendarManager) {
    calendarManager.addCalendar('today');
    calendarManager.addCalendar('prev');
    calendarManager.addCalendar('next');
}

function setCalendarEvent() {
    const prevButton = document.querySelector('#scroll-section-4 .prev-button');
    const nextButton = document.querySelector('#scroll-section-4 .next-button');
    const calendarContent = document.querySelector('#scroll-section-4 .content');
    if (isMobile != true) {
        prevButton.addEventListener('click', () => {
            calendarManager.scrollUpCalendar();
            const calendarIndex = calendarManager.getCalendarIndex();
            if (calendarIndex === 0) {
                prevButton.classList.add('hide');
            } else {
                nextButton.classList.remove('hide');
            }
        });
        nextButton.addEventListener('click', () => {
            calendarManager.scrollDownCalendar();
            const calendarIndex = calendarManager.getCalendarIndex();
            if (calendarIndex === 2) {
                nextButton.classList.add('hide');
            } else {
                prevButton.classList.remove('hide');
            }
        });
    }
    else {
        calendarContent.style.fontSize = '0.75rem';

        prevButton.remove();
        nextButton.remove();
        let touchStartX = 0;
        let touchEndX = 0;

        calendarContent.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        calendarContent.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                calendarManager.scrollDownCalendar();
            } else if (touchStartX - touchEndX < -50) {
                calendarManager.scrollUpCalendar();
            }
        });
    }
}



function setReservationModalEvent(calendarMordalManager, calendarManager) {
    calendarMordalManager.setReservationModal(calendarManager);
}

function createYearMonth(year, month, calendar) {
    const yearArea = calendar.querySelector('.calendar-header-title-year');
    const monthArea = calendar.querySelector('.calendar-header-title-month');
    yearArea.textContent = `${year}. `;
    monthArea.textContent = month;
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

const calendarManager = new CalendarManager();
const calendarModalManager = new CalendarModalManager();

function createSection(id, contentSectionName, contentSectionColor) {
    const startSectionId = 4;
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

// API 호출해서 section 정보를 가져온 뒤 section을 생성
async function createContentSectionInfo(sectionInfoManager) {
    const contentSections = this.document.querySelector(".content-sections");
    const json = await fetchData("/api/section/get");
    json.forEach((data) => {
        const newSection = createSection(data.id, data.contentSectionName, data.contentSectionColor);
        contentSections.appendChild(newSection);
    });
    contentSections.querySelectorAll("section").forEach((section) => {
        const sectionId = section.getAttribute("id").split("-")[2];
        sectionInfoManager.addSectionInfo(new SectionInfo(sectionId, 0, { section: section }));
    });
}

async function createNavigatorListItem() {
    const contentListNavigator = document.querySelector(".contentListNavigator").querySelector(".list-group");
    // 공간 예약 페이지 리스트 생성
    const listItemToCalendar = createElement("li", { classList: ["list-group-item", "list-group-item-action", "list-group-item-light"] }, ["공간 예약"]);
    const listItemToTop = createElement("li", { classList: ["list-group-item", "list-group-item-action", "list-group-item-light"] }, ["위로 가기"]);

    contentListNavigator.appendChild(listItemToCalendar);
    // 컨텐츠 페이지 리스트 생성
    const json = await fetchData("/api/section/get");
    json.forEach((data) => {
        const listItem = createElement("li", { classList: ["list-group-item", "list-group-item-action", "list-group-item-light"], "data-contentListId": `${data.id}` }, [`${data.contentSectionName}`]);
        contentListNavigator.appendChild(listItem);
    });
    contentListNavigator.appendChild(listItemToTop);
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
    const section4 = new SectionInfo(4, 2, { section: document.querySelector("#scroll-section-4") });
    sectionInfoManager.addSectionInfo(section1);
    sectionInfoManager.addSectionInfo(section2);
    sectionInfoManager.addSectionInfo(section3);
    sectionInfoManager.addSectionInfo(section4);
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

    modal.querySelector(".modal-content-area").addEventListener("click", function (event) {
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
function setNavigatorBehavior() {
    const navigator = document.querySelector(".contentListNavigator");
    const reservationNavigatorItem = navigator.querySelectorAll(".list-group-item:not([data-contentListId])")[0];
    const topPageNavigatorItem = navigator.querySelectorAll(".list-group-item:not([data-contentListId])")[1];
    const contentSectionNavigatorItems = navigator.querySelectorAll(".list-group-item[data-contentListId]");

    reservationNavigatorItem.addEventListener("click", function (event) {
        window.scrollTo({ top: getTotalOffsetTop(document.querySelector("#scroll-section-4")), behavior: "smooth" });
    });
    topPageNavigatorItem.addEventListener("click", function (event) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    contentSectionNavigatorItems.forEach((item) => {
        item.addEventListener("click", navigateToSection);
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
}
function setContentSectionBehavior(infiniteScrollManager) {
    const contentListNavigator = document.querySelector(".contentListNavigator");
    document.querySelectorAll("section[data-contentSectionId]").forEach((section) => {
        const contentListId = section.getAttribute("data-contentSectionId");
        if (contentListId) {
            const h2 = section.querySelector("h2");
            h2.addEventListener("click", toggleContent);
        }
    });

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
        contentListNavigator.querySelectorAll(".list-group-item[data-contentlistid]").forEach((item) => {
            if (item.getAttribute("data-contentListId") === contentListId) {
                isActive ? item.classList.add("active") : item.classList.remove("active");
            }
        });
    }
}

function setPreventViewingSource() {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 123) { // F12 : 개발자 도구 열기
            e.preventDefault();
        }
    });
    // 소스코드 단축키 막기
    document.onkeydown = function (e) {
        if (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 123)) {
            return false;
        }
    };
    // mac 소스보기 단축키 막기
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 85 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
        }
    });
}
function setResizeCalendarObserver(calendarManager) {
    calendarManager.setCalendarResizeOberver();
}

function setPwaInstall() {
    const pwaInstallIcon = document.querySelector(".addToHome");
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        pwaInstallIcon.addEventListener('click', (e) => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    // console.log('User accepted the A2HS prompt');
                } else {
                    // console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });
    });
}

window.addEventListener("DOMContentLoaded", async function (event) {
    setDefaultSectionInfo(sectionInfoManager);
    createContentSectionInfo(sectionInfoManager)
        .then(createNavigatorListItem)
        .then(() => {
            setNavigatorBehavior();
            setVideoSrc();
            setVideoClick();
            setScrollDownIcon();
            setModalBehavior();
            setInfiniteScrollManager(infiniteScrollManager);
            setContentSectionBehavior(infiniteScrollManager);
            createCalendar(calendarManager);
            setCalendarEvent(calendarManager);
            setResizeCalendarObserver(calendarManager);

            setReservationModalEvent(calendarModalManager);
            setPreventViewingSource();
            setPwaInstall();
            resizeSection();
            resizeVideo();
            resizeNavigator();
            initializePage(infiniteScrollManager).then(() => {
                settingContentSectionHeight();
            });
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
        const navigatorHeight = navigatorArea.scrollHeight;
        const convertedToPercentage = ((navigatorHeight * 0.5) / window.innerHeight) * 100;
        applyStyle(navigatorArea, { bottom: `${convertedToPercentage + 2}%`, right: "3%" });
    } else if (isMobile != true && window.matchMedia("(min-width: 992px)").matches) {
        applyStyle(navigatorArea, { bottom: "50%", right: "5%" });
    }

    // 모바일 세로 모드일 때
    if (isMobile && window.matchMedia("(orientation: portrait)").matches) {
        applyStyleToElements(navigator, {
            width: "100%",
            padding: "0.2rem",
            fontSize: "0.8rem"
        });
        const navigatorHeight = navigatorArea.scrollHeight;
        const convertedToPercentage = ((navigatorHeight * 0.5) / window.innerHeight) * 100;
        applyStyle(navigatorArea, { bottom: `${convertedToPercentage + 2}%`, right: "3%" });
        // 모바일 가로 모드일 때
    } else if (isMobile && window.matchMedia("(orientation: landscape)").matches) {
        applyStyleToElements(navigator, {
            width: "100%",
            padding: "0.2rem",
            fontSize: "0.8rem"
        });
        const navigatorHeight = navigatorArea.scrollHeight;
        const convertedToPercentage = ((navigatorHeight * 0.5) / window.innerHeight) * 100;
        applyStyle(navigatorArea, { bottom: `${convertedToPercentage + 2}%`, right: "2%" });
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

// function resizeCalendarLayout(){
//     calendarManager.resizeCalendars();
// }

window.addEventListener("resize", () => {
    resizeSection();
    resizeIframe();
    resizeVideo();
    resizeMessage();
    resizeNavigator();
    // resizeCalendarLayout();
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
// window.addEventListener("load", (e) => {
//     initializePage(infiniteScrollManager).then(() => {
//         settingContentSectionHeight();
//     });
// })

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