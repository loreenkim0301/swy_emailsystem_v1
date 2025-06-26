/**
 * 연관 콘텐츠 카드 컴포넌트
 * 재사용 가능한 카드 UI 컴포넌트
 */
export class RelatedContentCard {
    constructor(data, options = {}) {
        this.data = data;
        this.options = {
            showStatus: true,
            showDescription: true,
            showLink: true,
            onClick: null,
            ...options
        };
    }

    /**
     * 카드 HTML 생성
     * @returns {string} HTML 문자열
     */
    render() {
        const { id, title, description, status, url } = this.data;
        const hasLink = url && url.trim() !== '';
        const cardStatus = hasLink ? status : 'coming-soon';
        
        return `
            <div class="related-card" data-card-id="${id}" data-card-status="${cardStatus}">
                <div class="related-card__content">
                    <h4 class="related-card__title">${this.escapeHtml(title || '제목 없음')}</h4>
                    ${this.options.showDescription ? `
                        <p class="related-card__description">${this.escapeHtml(description || '설명이 없습니다.')}</p>
                    ` : ''}
                </div>
                <div class="related-card__footer">
                    ${this.options.showStatus ? `
                        <span class="related-card__status related-card__status--${cardStatus}">
                            ${this.getStatusText(cardStatus)}
                        </span>
                    ` : ''}
                    ${this.options.showLink && hasLink ? `
                        <a href="${url}" class="related-card__link" target="_blank" rel="noopener noreferrer">
                            자세히 보기
                        </a>
                    ` : ''}
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
            if (e.target.classList.contains('related-card__link')) {
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
            cardElement.classList.add('related-card--hover');
        });

        cardElement.addEventListener('mouseleave', () => {
            cardElement.classList.remove('related-card--hover');
        });
    }

    /**
     * 기본 클릭 핸들러
     */
    handleDefaultClick() {
        const { id, title, status, url } = this.data;
        
        // 로그 출력
        console.log(`🔗 연관 게시글 클릭됨:`, {
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