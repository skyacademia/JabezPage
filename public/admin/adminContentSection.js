(async () => {
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


    const form = document.querySelector('#contentSectionCreateForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const titleInput = document.getElementById('sectionNameCreateInput');
        const titleValue = titleInput.value.trim();
        if (titleValue === '') {
            alert('Please enter a title.');
            return false;
        }
        event.target.submit();
    });
    // contentForm 태그 내부의 체크박스의 value 값을 가져와서 있으면 api 요청을 보내고 없으면 경고창을 띄움
    const contentForm = document.querySelector('#contentSectionListForm');
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
            alert('삭제할 컨텐츠페이지를 선택해주세요.');
            return false;
        } else {
            e.target.submit();
        }
    });

    const updateContentModal = document.getElementById('updateContentSectionModal')
    if (updateContentModal) {
        updateContentModal.addEventListener('show.bs.modal', async event => {
            // 체크박스가 체크되어 있는 카드의 정보를 가지고 와서 모달에 띄움
            const checkboxes = document.querySelector('#contentSectionListForm').querySelectorAll('input[type="checkbox"]');
            const checkedValues = Array.from(checkboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);
            // 체크된 카드가 없으면 경고창을 띄우고 모달을 닫음
            if (checkedValues.length === 0) {
                alert('수정할 컨텐츠페이지를 선택해주세요.');
                return false;
            }
            for (let i = 0; i < checkedValues.length; i++) {
                const card = document.querySelector(`label[for="${checkedValues[i]}"]`);
                const contentSectionId = card.getAttribute('for');
                const contentSectionName = card.querySelector('.card-title').textContent.trim();
                const contentSectionColor = card.querySelector('.card-img-top').style.backgroundColor; // rgb(255, 255, 255) 형태로 가져옴
                //rgb(255, 255, 255) 형태의 색상값을 #ffffff 형태로 변경
                const rgb = contentSectionColor.match(/\d+/g);
                const hex = ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
                const contentSectionColorHex = `#${hex}`;
                const form = updateContentModal.querySelector('.modal-body').querySelector('form .row-cols-1');
                const colTag = createElement('div', { classList: ['col'] });
                const cardTag = createElement('label', { classList: ['card', 'shadow-sm', 'mb-3', 'p-0'], for: contentSectionId, 'data-isModified': false });
                const rowTag = createElement('div', { classList: ['row', 'g-0'] });
                const colorPickerColTag = createElement('div', { classList: ['col-md-4'] });
                const colorPickerTag = createElement('input', { type: 'color', value: contentSectionColorHex, name: "contentSectionColor", style: { width: '100%', height: '100%' }, classList: ['form-control'], alt: "ContentSectionColorPicker", "data-defaultSectionColor": contentSectionColorHex, "data-isModified": false });
                const contentColTag = createElement('div', { classList: ['col-md-8'] });
                const cardBodyTag = createElement('div', { classList: ['card-body'], for: contentSectionId });
                const cardNameInputTag = createElement('input', { type: 'text', name: 'contentSectionName', value: contentSectionName, "data-defaultSectionName": contentSectionName, "data-isModified": false });
                const cardIdInputTag = createElement('input', { type: 'hidden', name: 'contentSectionId', classList: ['card-text'], value: contentSectionId });

                colorPickerTag.addEventListener('change', (event) => {
                    const colorPicker = event.target;
                    const card = colorPicker.closest('label');
                    const cardNameInput = card.querySelector('input[name="contentSectionName"]');
                    const defaultColor = colorPicker.getAttribute('data-defaultSectionColor');
                    // 선택한 색상값이 기본값과 다르면 isModified를 true로 변경
                    if (colorPicker.value !== defaultColor) {
                        colorPicker.setAttribute('data-isModified', true);
                        console.log(`색상 변경됨 : ${defaultColor} -> ${colorPicker.value}`);
                    } else {
                        colorPicker.setAttribute('data-isModified', false);
                        console.log("색상 변경 안됨 : " + colorPicker.value);
                    }
                    // 이름값이 변경되었거나 색상값이 변경되었으면 카드의 isModified를 true로 변경
                    if (cardNameInput.getAttribute('data-isModified') === "true" || colorPicker.getAttribute('data-isModified') === "true") {
                        card.setAttribute('data-isModified', true);
                        console.log("카드 변경됨 : " + card.getAttribute('data-isModified'));
                    } else {
                        card.setAttribute('data-isModified', false);
                        console.log("카드 변경 안됨 : " + card.getAttribute('data-isModified'));
                    }
                });

                cardNameInputTag.addEventListener('change', (event) => {
                    const cardNameInput = event.target;
                    const defaultSectionName = cardNameInput.getAttribute('data-defaultSectionName');
                    const card = cardNameInput.closest('label');
                    const colorPickerInput = card.querySelector('input[type="color"]');
                    // 선택한 이름값이 기본값과 다르면 isModified를 true로 변경
                    if (cardNameInput.value !== defaultSectionName) {
                        cardNameInput.setAttribute('data-isModified', true);
                        console.log("이름 변경됨 : " + cardNameInput.value);
                    } else {
                        cardNameInput.setAttribute('data-isModified', false);
                        console.log("이름 변경 안됨 : " + cardNameInput.value);
                    }
                    // 이름값이 변경되었거나 색상값이 변경되었으면 카드의 isModified를 true로 변경
                    if ((cardNameInput.getAttribute('data-isModified') === "true") || (colorPickerInput.getAttribute('data-isModified') === "true")) {
                        card.setAttribute('data-isModified', true);
                        console.log("카드 변경됨 : " + card.getAttribute('data-isModified'));
                    } else {
                        card.setAttribute('data-isModified', false);
                        console.log("카드 변경 안됨 : " + card.getAttribute('data-isModified'));
                    }
                });
                cardBodyTag.appendChild(cardNameInputTag);
                cardBodyTag.appendChild(cardIdInputTag);
                contentColTag.appendChild(cardBodyTag);
                colorPickerColTag.appendChild(colorPickerTag);
                rowTag.appendChild(colorPickerColTag);
                rowTag.appendChild(contentColTag);
                cardTag.appendChild(rowTag);
                colTag.appendChild(cardTag);
                i > 0 ? form.appendChild(colTag) : form.replaceChildren(colTag);

            };
        });
        updateContentModal.addEventListener('hidden.bs.modal', event => {
            const form = updateContentModal.querySelector('.modal-body').querySelector('form .row-cols-1');
            form.replaceChildren();
        });
    }
    const contentSectionUpdateForm = document.getElementById('contentSectionUpdateForm');
    if (contentSectionUpdateForm) {
        contentSectionUpdateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const notModifiedCards = form.querySelectorAll('label[data-isModified="false"]');
            if (notModifiedCards.length > 0) {
                alert('변경된 사항이 없습니다.');
                return false;
            }
            // 빈 값이 있는지 확인
            const cardNameInputs = form.querySelectorAll('input[name="contentSectionName"]');
            for (let i = 0; i < cardNameInputs.length; i++) {
                const cardNameInput = cardNameInputs[i];
                if (cardNameInput.value.trim() === '') {
                    alert('컨텐츠 페이지 이름을 입력해주세요.');
                    return false;
                }
            }
            form.submit();
        });
    }
})();