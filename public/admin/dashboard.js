/* globals Chart:false */

(async () => {
  class sectionInfiniteScrollInfo {
    constructor(sectionId) {
      this.id = 0;
      this.startingId = 0;
      this.sectionId = sectionId;
      this.isfetching = true;
    }

    incrementId() {
      this.id++;
    }

    changeId(id) {
      this.id = id;
    }
    changeStartingId(id) {
      this.startingId = id;
    }
    resetIdToStartingId() {
      this.id = this.startingId;
    }
    getId() {
      return this.id;
    }

    stopFetching() {
      this.isfetching = false;
    }
    startFetching() {
      this.isfetching = true;
    }

    getIsFetching() {
      return this.isfetching;
    }
    getSectionId() {
      return this.sectionId;
    }
  }

  class InfiniteScrollManager {
    constructor() {
      this.sections = {};
      this.activeSectionId = 0;
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
    getIsFetching(sectionId) {
      return this.sections[sectionId].getIsFetching();
    }
    startFetching(sectionId) {
      this.sections[sectionId].startFetching();
    }
    incrementId(sectionId) {
      this.sections[sectionId].incrementId();
    }
    changeId(sectionId, id) {
      this.sections[sectionId].changeId(id);
    }
    changeStartingId(sectionId, id) {
      this.sections[sectionId].changeStartingId(id);
    }
    resetIdToStartingId(sectionId) {
      this.sections[sectionId].id = this.sections[sectionId].startingId;
    }
    getSectionId(sectionId) {
      return this.sections[sectionId].getSectionId();
    }
    getIdBySection(sectionId) {
      return this.sections[sectionId].getId();
    }

    getActiveSectionId() {
      return this.activeSectionId;
    }
    setActiveSectionId(sectionId) {
      this.activeSectionId = sectionId;
    }
  }

  const infiniteScrollManager = new InfiniteScrollManager(); // 데이터를 가져오기 위한 InfiniteScrollManager 객체 생성
  const json = await fetchData('/api/section/get');
  const contentSectionInfo = json.map(data => {
    return { id: data.id, name: data.contentSectionName };
  });

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
  // 페이지가 로드되면 sectionFilter의 옵션에 있는 모든 sectionId에 대해서 api 요청을 보내서 데이터를 가져와 초기 InfiniteScrollManager 객체를 초기화함

  const filter = document.querySelector('#sectionFilter');
  const sectionIds = Array.from(filter.options).map(option => parseInt(option.value));
  sectionIds.forEach(async (sectionId) => {
    if (sectionId === 0) {
      infiniteScrollManager.addSection(sectionId);
      infiniteScrollManager.changeId(sectionId, document.querySelector(".col:last-child").querySelector(".card").getAttribute('for'));
      infiniteScrollManager.changeStartingId(sectionId, 0);
    } else {
      const response = await fetch(`/api/content/get/SectionNum/${sectionId}`);
      const json = await response.json();
      infiniteScrollManager.addSection(sectionId);
      if (json.length === 0) {
        console.log('조회할 데이터가 더이상 없습니다.');
        infiniteScrollManager.stopFetching(sectionId);
        infiniteScrollManager.changeId(sectionId, 0);
        infiniteScrollManager.changeStartingId(sectionId, 0);
        return;
      } else {
        infiniteScrollManager.changeId(sectionId, json[0].ID);
        infiniteScrollManager.changeStartingId(sectionId, json[0].ID - 1);
      }
    }
  });
  // element를 생성해서 반환하는 함수
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

  const updateContentModal = document.getElementById('updateContentModal')
  if (updateContentModal) {
    updateContentModal.addEventListener('show.bs.modal', async event => {
      // 체크박스가 체크되어 있는 카드의 정보를 가지고 와서 모달에 띄움
      const checkboxes = document.querySelector('#contentListForm').querySelectorAll('input[type="checkbox"]');
      const checkedValues = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
      if (checkedValues.length >= 1) {
        for (let i = 0; i < checkedValues.length; i++) {
          const card = document.querySelector(`label[for="${checkedValues[i]}"]`);
          const youtubeLink = card.getAttribute('data-src');
          const youtubeTitle = card.querySelector('.card-title').textContent;
          const youtubeSection = card.querySelector('.card-text').textContent;
          const youtubeThumbnail = card.querySelector('.card-img-top').getAttribute('src');
          const youtubeId = card.getAttribute('for');
          const form = updateContentModal.querySelector('.modal-body').querySelector('form .row-cols-1');
          const colTag = createElement('div', { classList: ['col'] });
          const cardTag = createElement('label', { classList: ['card', 'shadow-sm', 'mb-3', 'p-0'], 'data-src': youtubeLink, for: youtubeId, 'data-isSelected': 'false'});
          const rowTag = createElement('div', { classList: ['row', 'g-0'] });
          const imageColTag = createElement('div', { classList: ['col-md-4'] });
          const imageTag = createElement('img', { src: youtubeThumbnail, classList: ['img-fluid'], alt: "YoutubeThumnail" });
          const contentColTag = createElement('div', { classList: ['col-md-8'] });
          const cardBodyTag = createElement('div', { classList: ['card-body'], for: youtubeId });
          const cardTitleTag = createElement('h5', { classList: ['card-title'] }, [youtubeTitle]);
          const cardSelectTag = createElement('select', { classList: ['form-select', 'mb-3', 'card-text'], name: 'contentSectionNum', 'data-defaultSection' : youtubeSection, id: youtubeId});
          const cardOptionTags = [];
          contentSectionInfo.forEach((section, index) => {
            cardOptionTags.push(createElement('option', { value: `${section.id}` }, [`${section.name}`]));
          });
          const cardInputTag = createElement('input', { type: 'hidden', name: 'idToUpdate', value: youtubeId }); 
          // youtubeSection에 해당하는 option 태그를 선택하게 함
          cardOptionTags.forEach(option => {
            if (option.textContent == youtubeSection) {
              option.selected = true;
            }
          });
          cardSelectTag.replaceChildren(...cardOptionTags);
          cardSelectTag.addEventListener('change', (e) => {
            const select = e.target;
            const selecttedValue = select.options[e.target.selectedIndex].textContent;
            const defaultValue = select.getAttribute('data-defaultSection')
            if(defaultValue === selecttedValue) {
              select.closest('.card').setAttribute('data-isSelected', 'false');
              console.log("같은 값으로 선택 : " + select.closest('.card').getAttribute('data-isSelected'));
              console.log("선택된 값이 기본값과 같습니다. 다시 선택해주세요.");
            }else{
              select.closest('.card').setAttribute('data-isSelected', 'true');
              console.log("다른 값으로 선택 : " + select.closest('.card').getAttribute('data-isSelected'));
              console.log("선택한 카드 : " + select.nextElementSibling.value);
              console.log("선택한 값 : " + selecttedValue);
            }
          });
          cardBodyTag.appendChild(cardTitleTag);
          cardBodyTag.appendChild(cardSelectTag);
          cardBodyTag.appendChild(cardInputTag);
          contentColTag.appendChild(cardBodyTag);
          imageColTag.appendChild(imageTag);
          rowTag.appendChild(imageColTag);
          rowTag.appendChild(contentColTag);
          cardTag.appendChild(rowTag);
          colTag.appendChild(cardTag);
          i > 0 ? form.appendChild(colTag) : form.replaceChildren(colTag);
        };
      }
    });
    updateContentModal.addEventListener('hidden.bs.modal', event => {
      const form = updateContentModal.querySelector('.modal-body').querySelector('form .row-cols-1');
      form.replaceChildren();
    });
  }
  
  const contentUpdateForm = document.querySelector('#contentUpdateForm');
  contentUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cards = e.target.querySelectorAll('.card');

    // 카드 중에서 수정하지 않은 카드가 있으면 경고창을 띄우고 api 요청을 보내지 않음
    const unselectedCards = Array.from(cards).filter(card => card.getAttribute('data-isSelected') === 'false');
    if (unselectedCards.length > 0) {
      alert('섹션을 변경하지 않은 카드가 있습니다. 카드의 섹션을 변경해주세요. 변경하지 않은 카드 갯수 : ' + unselectedCards.length);
      return false;
    }

    const selectedCards = Array.from(cards).filter(card => card.getAttribute('data-isSelected') === 'true');
    if (selectedCards.length > 0){
      console.log("섹션을 변경할 카드의 개수 : " + selectedCards.length);
      contentUpdateForm.submit();
    }
  });

  // contentForm 태그 내부의 체크박스의 value 값을 가져와서 있으면 api 요청을 보내고 없으면 경고창을 띄움
  const contentForm = document.querySelector('#contentListForm');
  contentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 이벤트가 발생한 폼 내부의 모든 체크박스를 가져옴
    const checkboxes = e.target.querySelectorAll('input[type="checkbox"]');

    // 체크박스 중에서 체크되어 있는 체크박스의 value 값을 가져옴
    const checkedValues = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    // chekedValues에 값이 없으면 경고창을 띄우고 api 요청을 보내지 않음
    if (checkedValues.length === 0) {
      alert('삭제할 컨텐츠를 선택해주세요.');
      return false;
    } else {
      console.log("보내는 데이터 : " + checkedValues);
      console.log("보내는 데이터 개수 : " + checkedValues.length);
      contentForm.submit();
    }
  });

  // uploadForm 태그 내부의 값의 형식이 맞지 않으면 경고창을 띄우고 api 요청을 보내지 않음
  const uploadForm = document.querySelector('#contentUploadForm');
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const source = e.target.querySelector('textarea[name="youtubeSource"]').value;
    const contentSectionId = e.target.querySelector('select[name="contentSectionName"]').value;

    // 소스코드에 <iframe> 태그가 없으면 경고창을 띄우고 api 요청을 보내지 않음
    if (source.indexOf('<iframe') === -1) {
      alert('올바른 형식의 소스를 입력해주세요. <iframe> 태그가 들어가있는 소스를 입력해야합니다. 유튜브영상 오른쪽 마우스 클릭 -> "소스 코드 복사" 선택하면 됩니다.');
      return false;
    }
    // contentSectionId가 0이면 경고창을 띄우고 api 요청을 보내지 않음
    if (contentSectionId === '0') {
      alert('섹션을 선택해주세요.');
      return false;
    }

    // souurce에서 src 속성의 값이 https://www.youtube.com/embed/HbuAOcKc3YY?si=8Mla4glGLOi8P7Z0 형식이 아니면 경고창을 띄우고 api 요청을 보내지 않음
    const srcRegex = /src=(['"])(.*?)\1/; // src 속성의 값만 가져오는 정규식
    const match = source.match(srcRegex);
    const embedUrl = match[2];
    if (embedUrl.indexOf('https://www.youtube.com/embed/') === -1) {
      alert('올바른 형식의 소스를 입력해주세요. 유튜브 컨텐츠만 추가할 수 있습니다. 유튜브영상 오른쪽 마우스 클릭 -> "소스 코드 복사" 선택하면 됩니다.');
      return false;
    }
    uploadForm.submit();
  });

  // intersectionObserver API를 이용해서 mainPage가 브라우저 끝에 닿으면 api 요청을 보내서 데이터를 가져옴
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {

        const sectionIds = document.querySelector('#sectionFilter');
        const sectionId = sectionIds.options[sectionIds.selectedIndex].value;
        console.log(infiniteScrollManager)
        console.log(infiniteScrollManager.getSection(sectionId));
        if (!infiniteScrollManager.getIsFetching(sectionId)) {
          console.log('더이상 데이터를 가져오지 않습니다.');
          return;
        }
        try {
          const rowTag = document.querySelector('form.row');
          const queryCount = 8;
          const apiUrl = infiniteScrollManager.getActiveSectionId() === 0 ? `/api/content/get/${infiniteScrollManager.getIdBySection(sectionId)}/${queryCount}` :
            `/api/content/get/section/${sectionId}/${infiniteScrollManager.getIdBySection(sectionId)}/${queryCount}`;
          const response = await fetch(apiUrl);
          const json = await response.json();
          if (json.length === 0) {
            console.log('조회할 데이터가 더이상 없습니다.');
            infiniteScrollManager.stopFetching(sectionId);
            return;
          }
          console.log("데이터를 가져왔습니다. 개수: " + json.length);
          json.forEach(data => {
            const id = data.ID;
            const youtubeTitle = data.MemberYoutubeTitle;
            const youtubeLink = data.MemberYoutubeLink;
            const youtubeThumnailPath = data.MemberYoutubeThumbnailLink;
            const contentSectionName = data.ContentSectionName;

            const colTag = createElement('div', { classList: ['col'] });
            const cardTag = createElement('label', { classList: ['card', 'shadow-sm', 'mb-3', 'p-0'], 'data-src': youtubeLink, for: id });
            const inputTag = createElement('input', { classList: ['form-check-input', 'position-absolute'], style: { top: '5%', left: '5%' }, type: 'checkbox', name: 'idToDelete', value: id, id: id });
            const cardImageTag = createElement('img', { src: youtubeThumnailPath, classList: ['card-img-top'], alt: "YoutubeThumnail" });
            const cardBodyTag = createElement('div', { classList: ['card-body'], for: id });
            const cardTitleTag = createElement('h5', { classList: ['card-title'] }, [youtubeTitle]);
            const cardTextTag = createElement('p', { classList: ['card-text'] }, [contentSectionName]);

            cardBodyTag.appendChild(cardTitleTag);
            cardBodyTag.appendChild(cardTextTag);
            cardTag.appendChild(inputTag);
            cardTag.appendChild(cardImageTag);
            cardTag.appendChild(cardBodyTag);
            colTag.appendChild(cardTag);
            rowTag.appendChild(colTag);
          });
          infiniteScrollManager.changeId(sectionId, parseInt(document.querySelector(".col:last-child").querySelector(".card").getAttribute('for')));
          console.log('다음 데이터를 가져오기 위해 id를 변경했습니다. id: ' + infiniteScrollManager.getIdBySection(sectionId));
          observer.unobserve(entry.target);
          observer.observe(document.querySelector(".col:last-child"));
        } catch (error) {
          console.error('Failed to fetch data', error);
          return [];
        }
      }
    }
    );
  }, { threshold: 0.5 });
  observer.observe(document.querySelector(".col:last-child"));

  const sectionFilter = document.querySelector('#sectionFilter');
  sectionFilter.addEventListener('change', async (e) => {
    const sectionId = parseInt(e.target.value);
    const queryCount = 16;
    if (infiniteScrollManager.getActiveSectionId() === sectionId) return;

    // sectionId에 해당하는 데이터를 가져오기 위해 InfiniteScrollManager 객체를 초기화함
    infiniteScrollManager.setActiveSectionId(sectionId);
    infiniteScrollManager.resetIdToStartingId(sectionId);
    infiniteScrollManager.startFetching(sectionId);
    console.log('섹션 필터가 변경되었습니다. sectionId: ' + infiniteScrollManager.getActiveSectionId());

    const rowTag = document.querySelector('form.row');
    const colTags = [];
    const apiUrl = infiniteScrollManager.getActiveSectionId() === 0 ? `/api/content/get/${infiniteScrollManager.getIdBySection(sectionId)}/${queryCount}` :
      `/api/content/get/section/${sectionId}/${infiniteScrollManager.getIdBySection(sectionId)}/${queryCount}`;
    const response = await fetch(apiUrl);
    const json = await response.json();
    if (json.length === 0) {
      infiniteScrollManager.stopFetching(sectionId);
      rowTag.replaceChildren();
      console.log('조회할 데이터가 더이상 없습니다.');
      return;
    }
    console.log("데이터를 가져왔습니다. 개수: " + json.length);
    json.forEach(data => {
      const id = data.ID;
      const youtubeTitle = data.MemberYoutubeTitle;
      const youtubeLink = data.MemberYoutubeLink;
      const youtubeThumnailPath = data.MemberYoutubeThumbnailLink;
      const contentSectionName = data.ContentSectionName;

      const colTag = createElement('div', { classList: ['col'] });
      const cardTag = createElement('label', { classList: ['card', 'shadow-sm', 'mb-3', 'p-0'], 'data-src': youtubeLink, for: id });
      const inputTag = createElement('input', { classList: ['form-check-input', 'position-absolute'], style: { top: '5%', left: '5%' }, type: 'checkbox', name: 'idToDelete', value: id, id: id });
      const cardImageTag = createElement('img', { src: youtubeThumnailPath, classList: ['card-img-top'], alt: "YoutubeThumnail" });
      const cardBodyTag = createElement('div', { classList: ['card-body'], for: id });
      const cardTitleTag = createElement('h5', { classList: ['card-title'] }, [youtubeTitle]);
      const cardTextTag = createElement('p', { classList: ['card-text'] }, [contentSectionName]);

      cardBodyTag.appendChild(cardTitleTag);
      cardBodyTag.appendChild(cardTextTag);
      cardTag.appendChild(inputTag);
      cardTag.appendChild(cardImageTag);
      cardTag.appendChild(cardBodyTag);
      colTag.appendChild(cardTag);
      colTags.push(colTag);
    });
    rowTag.replaceChildren(...colTags);
    infiniteScrollManager.changeId(sectionId, parseInt(document.querySelector(".col:last-child").querySelector(".card").getAttribute('for')));
    observer.observe(document.querySelector(".col:last-child"));
  });
})();
