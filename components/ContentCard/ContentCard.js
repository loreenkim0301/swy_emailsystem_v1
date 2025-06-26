/**
 * 콘텐츠 카드 컴포넌트
 * 재사용 가능한 카드 UI 컴포넌트
 */
export class ContentCard {
    constructor(data, options = {}) {
        this.data = data;
        this.options = {
            showTags: true,
            showDescription: true,
            showStatus: true,
            onClick: null,
            className: 'content-item',
            ...options
        };
    }

    /**
     * 카드 HTML 생성
     * @returns {string} HTML 문자열
     */
    render() {
        const { id, title, description, status, url, keywords = [] } = this.data;
        const hasLink = url && url.trim() !== '';
        const cardStatus = hasLink ? status : 'coming-soon';
        
        return `
            <div class="${this.options.className}" data-card-id="${id}" data-card-status="${cardStatus}">
                <div class="content-item__header">
                    <h4 class="content-item__title">${this.escapeHtml(title || '제목 없음')}</h4>
                    ${this.options.showStatus ? `
                        <span class="content-item__status content-item__status--${cardStatus}">
                            ${this.getStatusText(cardStatus)}
                        </span>
                    ` : ''}
                </div>
                
                ${this.options.showDescription ? `
                    <p class="content-item__description">${this.escapeHtml(description || '설명이 없습니다.')}</p>
                ` : ''}
                
                ${this.options.showTags && keywords.length > 0 ? `
                    <div class="content-item__tags">
                        ${keywords.slice(0, 3).map(tag => `
                            <span class="content-item__tag">${this.escapeHtml(tag)}</span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="content-item__footer">
                    ${hasLink ? `
                        <a href="${url}" class="content-item__link" target="_blank" rel="noopener noreferrer">
                            자세히 보기
                        </a>
                    ` : `
                        <span class="content-item__link content-item__link--disabled">
                            출시 예정
                        </span>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * DOM 요소로 카드 생성
     * @returns {HTMLElement} 카드 DOM 요소
     */
    createElement() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.render();
        const cardElement = wrapper.firstElementChild;
        
        // 이벤트 리스너 추가
        this.bindEvents(cardElement);
        
        return cardElement;
    }

    /**
     * 이벤트 바인딩
     * @param {HTMLElement} cardElement 카드 DOM 요소
     */
    bindEvents(cardElement) {
        cardElement.addEventListener('click', (e) => {
            // 링크 클릭은 제외
            if (e.target.classList.contains('content-item__link') && !e.target.classList.contains('content-item__link--disabled')) {
                return;
            }
            
            // 커스텀 클릭 핸들러 실행
            if (this.options.onClick) {
                this.options.onClick(this.data, e);
            } else {
                this.handleDefaultClick();
            }
        });

        // 호버 효과를 위한 클래스 추가
        cardElement.addEventListener('mouseenter', () => {
            cardElement.classList.add('content-item--hover');
        });

        cardElement.addEventListener('mouseleave', () => {
            cardElement.classList.remove('content-item--hover');
        });
    }

    /**
     * 기본 클릭 핸들러
     */
    handleDefaultClick() {
        const { id, title, status, url } = this.data;
        
        // 로그 출력
        console.log(`🔗 콘텐츠 카드 클릭됨:`, {
            id,
            title,
            status,
            hasUrl: !!(url && url.trim() !== ''),
            url: url || null
        });

        // 링크가 있으면 새 탭에서 열기
        if (url && url.trim() !== '') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            // 출시 예정 메시지
            this.showTemporaryMessage('🚀 이 콘텐츠는 곧 출시될 예정입니다!');
        }
    }

    /**
     * 상태 텍스트 반환
     * @param {string} status 상태 값
     * @returns {string} 표시할 상태 텍스트
     */
    getStatusText(status) {
        const statusMap = {
            'published': '공개됨',
            'coming-soon': '출시 예정',
            'draft': '준비 중',
            'preparing': '준비 중',
            'archived': '보관됨'
        };
        return statusMap[status] || status;
    }

    /**
     * HTML 이스케이프
     * @param {string} text 이스케이프할 텍스트
     * @returns {string} 이스케이프된 텍스트
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 임시 메시지 표시
     * @param {string} message 표시할 메시지
     */
    showTemporaryMessage(message) {
        const tempStatus = document.createElement('div');
        tempStatus.className = 'status-message status-info';
        tempStatus.innerHTML = `<span>💡</span><span>${message}</span>`;
        tempStatus.style.position = 'fixed';
        tempStatus.style.top = '20px';
        tempStatus.style.left = '50%';
        tempStatus.style.transform = 'translateX(-50%)';
        tempStatus.style.zIndex = '9999';
        tempStatus.style.maxWidth = '90%';
        
        document.body.appendChild(tempStatus);
        
        setTimeout(() => {
            tempStatus.remove();
        }, 3000);
    }

    /**
     * 카드 데이터 업데이트
     * @param {Object} newData 새로운 데이터
     */
    updateData(newData) {
        this.data = { ...this.data, ...newData };
    }

    /**
     * 카드 옵션 업데이트
     * @param {Object} newOptions 새로운 옵션
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }
}

/**
 * 팩토리 함수 - 간편한 카드 생성
 * @param {Object} data 카드 데이터
 * @param {Object} options 옵션
 * @returns {ContentCard} 카드 인스턴스
 */
export function createContentCard(data, options = {}) {
    return new ContentCard(data, options);
}