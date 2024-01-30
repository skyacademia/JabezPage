/* globals Chart:false */

(() => {
  class InfiniteScrollInfo {
    constructor() {
      // 마지막 카드의 id
      this.id = parseInt(document.querySelector(".col:last-child").querySelector('.card').getAttribute('for')) // 마지막 카드의 id + 1
      this.isfetching = true;
    }

    incrementId() {
      this.id++;
    }

    changeId(id) {
      this.id = id;
    }

    stopFetching() {
      this.isfetching = false;
    }

    getIsFetching() {
      return this.isfetching;
    }

    getId() {
      return this.id;
    }
  }
  const infiniteScrollInfo = new InfiniteScrollInfo();

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
      contentForm.submit();
    }
  });

  // uploadForm 태그 내부의 값의 형식이 맞지 않으면 경고창을 띄우고 api 요청을 보내지 않음
  const uploadForm = document.querySelector('#contentUploadForm');
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const source = e.target.querySelector('textarea[name="youtubeSource"]').value;
    // 소스코드에 <iframe> 태그가 없으면 경고창을 띄우고 api 요청을 보내지 않음
    if (source.indexOf('<iframe') === -1) {
      alert('올바른 형식의 소스를 입력해주세요. <iframe> 태그가 들어가있는 소스를 입력해야합니다. 유튜브영상 오른쪽 마우스 클릭 -> "소스 코드 복사" 선택하면 됩니다.');
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
      if (entry.isIntersecting && infiniteScrollInfo.getIsFetching()) {
        try {
          const rowTag = document.querySelector('form.row');
          const response = await fetch(`/api/content/get/${infiniteScrollInfo.getId()}`);
          const json = await response.json();
          if (json.length === 0) {
            console.log('조회할 데이터가 더이상 없습니다.');
            infiniteScrollInfo.stopFetching();
            return;
          }
          console.log("데이터를 가져왔습니다. 개수: " + json.length);
          json.forEach(data => {
            const id = data.ID;
            const youtubeTitle = data.MemberYoutubeTitle;
            const youtubeLink = data.MemberYoutubeLink;
            const youtubeThumnailPath = data.MemberYoutubeThumbnailLink;

            const colTag = createElement('div', { classList: ['col'] });
            const cardTag = createElement('label', { classList: ['card', 'shadow-sm', 'mb-3', 'p-0'], 'data-src': youtubeLink, for: id });
            const inputTag = createElement('input', { classList: ['form-check-input', 'position-absolute'], style: { top: '5%', left: '5%' }, type: 'checkbox', name: 'idToDelete', value: id, id: id });
            const cardImageTag = createElement('img', { src: youtubeThumnailPath, classList: ['card-img-top'], alt: "YoutubeThumnail" });
            const cardBodyTag = createElement('div', { classList: ['card-body'], for: id });
            const cardTextTag = createElement('h5', { classList: ['card-text'] }, [youtubeTitle]);

            cardBodyTag.appendChild(cardTextTag);
            cardTag.appendChild(inputTag);
            cardTag.appendChild(cardImageTag);
            cardTag.appendChild(cardBodyTag);
            colTag.appendChild(cardTag);
            rowTag.appendChild(colTag);
          });
          infiniteScrollInfo.changeId(parseInt(document.querySelector(".col:last-child").querySelector(".card").getAttribute('for')));
          console.log('다음 데이터를 가져오기 위해 id를 변경했습니다. id: ' + infiniteScrollInfo.getId());
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
})();
