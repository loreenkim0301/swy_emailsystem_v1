/**
 * 연관 콘텐츠 그리드 컴포넌트
 * 카드들을 그리드 형태로 배치하고 관리
 */
import { RelatedContentCard } from './RelatedContentCard.js';

export class RelatedContentGrid {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!this.container) {
            throw new Error('RelatedContentGrid: 유효한 컨테이너를 찾을 수 없습니다.');
        }

        this.options = {
            gridClass: 'related-grid',
            cardOptions: {},
            emptyMessage: '표시할 콘텐츠가 없습니다.',
            loadingMessage: '로딩 중...',
            errorMessage: '콘텐츠를 불러오는데 실패했습니다.',
            onCardClick: null,
            onViewCountIncrement: null,
            ...options
        };

        this.cards = [];
        this.state = {
            loading: false,
            error: null,
            data: []
        };

        this.init();
    }

    /**
     * 그리드 초기화
     */
    init() {
        this.container.className = this.options.gridClass;
        this.render();
    }

    /**
     * 데이터 로드 및 카드 렌더링
     * @param {Array} data 카드 데이터 배열
     */
    async loadData(data) {
        this.setState({ loading: true, error: null });

        try {
            // 데이터 검증
            if (!Array.isArray(data)) {
                throw new Error('데이터는 배열이어야 합니다.');
            }

            this.setState({ 
                loading: false, 
                data: data,
                error: null 
            });

            this.renderCards();

        } catch (error) {
            console.error('RelatedContentGrid 데이터 로드 오류:', error);
            this.setState({ 
                loading: false, 
                error: error.message 
            });
        }
    }

    /**
     * 카드들 렌더링
     */
    renderCards() {
        // 기존 카드들 정리
        this.clearCards();

        if (this.state.data.length === 0) {
            this.renderEmptyState();
            return;
        }

        // 새 카드들 생성
        this.state.data.forEach(item => {
            const card = new RelatedContentCard(item, {
                ...this.options.cardOptions,
                onClick: (data, event) => this.handleCardClick(data, event)
            });

            const cardElement = card.createElement();
            this.container.appendChild(cardElement);
            this.cards.push({ card, element: cardElement });
        });

        // 그리드 애니메이션 적용
        this.applyGridAnimation();
    }

    /**
     * 카드 클릭 핸들러
     * @param {Object} data 카드 데이터
     * @param {Event} event 클릭 이벤트
     */
    async handleCardClick(data, event) {
        // 조회수 증가 (비동기)
        if (data.id && this.options.onViewCountIncrement) {
            try {
                await this.options.onViewCountIncrement(data.id);
                console.log(`📈 조회수 증가: 게시글 ID ${data.id}`);
            } catch (error) {
                console.warn(`조회수 증가 실패: 게시글 ID ${data.id}`, error);
            }
        }

        // 커스텀 클릭 핸들러 실행
        if (this.options.onCardClick) {
            this.options.onCardClick(data, event);
        }

        // 기본 동작 (링크 열기)
        if (data.url && data.url.trim() !== '') {
            window.open(data.url, '_blank', 'noopener,noreferrer');
        } else {
            this.showMessage('🚀 이 콘텐츠는 곧 출시될 예정입니다!', 'info');
        }
    }

    /**
     * 빈 상태 렌더링
     */
    renderEmptyState() {
        this.container.innerHTML = `
            <div class="related-grid__empty">
                <p class="related-grid__empty-message">${this.options.emptyMessage}</p>
            </div>
        `;
    }

    /**
     * 로딩 상태 렌더링
     */
    renderLoadingState() {
        this.container.innerHTML = `
            <div class="related-grid__loading">
                <p class="related-grid__loading-message loading">${this.options.loadingMessage}</p>
            </div>
        `;
    }

    /**
     * 에러 상태 렌더링
     */
    renderErrorState() {
        this.container.innerHTML = `
            <div class="related-grid__error">
                <p class="related-grid__error-message">${this.state.error || this.options.errorMessage}</p>
            </div>
        `;
    }

    /**
     * 상태에 따른 렌더링
     */
    render() {
        if (this.state.loading) {
            this.renderLoadingState();
        } else if (this.state.error) {
            this.renderErrorState();
        } else {
            this.renderCards();
        }
    }

    /**
     * 기존 카드들 정리
     */
    clearCards() {
        this.cards.forEach(({ element }) => {
            element.remove();
        });
        this.cards = [];
        this.container.innerHTML = '';
    }

    /**
     * 그리드 애니메이션 적용
     */
    applyGridAnimation() {
        // 카드들을 순차적으로 나타나게 하는 애니메이션
        this.cards.forEach(({ element }, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * 상태 업데이트
     * @param {Object} newState 새로운 상태
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    /**
     * 특정 카드 업데이트
     * @param {string|number} cardId 카드 ID
     * @param {Object} newData 새로운 데이터
     */
    updateCard(cardId, newData) {
        const cardIndex = this.cards.findIndex(({ card }) => card.data.id === cardId);
        if (cardIndex !== -1) {
            this.cards[cardIndex].card.updateData(newData);
            // 카드 재렌더링
            const newElement = this.cards[cardIndex].card.createElement();
            this.cards[cardIndex].element.replaceWith(newElement);
            this.cards[cardIndex].element = newElement;
        }
    }

    /**
     * 카드 추가
     * @param {Object} cardData 카드 데이터
     */
    addCard(cardData) {
        this.state.data.push(cardData);
        this.renderCards();
    }

    /**
     * 카드 제거
     * @param {string|number} cardId 카드 ID
     */
    removeCard(cardId) {
        this.state.data = this.state.data.filter(item => item.id !== cardId);
        this.renderCards();
    }

    /**
     * 메시지 표시
     * @param {string} message 메시지
     * @param {string} type 메시지 타입
     */
    showMessage(message, type = 'info') {
        const tempStatus = document.createElement('div');
        tempStatus.className = `status-message status-${type}`;
        tempStatus.innerHTML = `<span>${this.getStatusIcon(type)}</span><span>${message}</span>`;
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
     * 상태 아이콘 반환
     * @param {string} type 상태 타입
     * @returns {string} 아이콘
     */
    getStatusIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: '💡'
        };
        return icons[type] || '📝';
    }

    /**
     * 그리드 파괴
     */
    destroy() {
        this.clearCards();
        this.container.innerHTML = '';
    }

    /**
     * 데이터 새로고침
     */
    refresh() {
        this.renderCards();
    }

    /**
     * 필터링
     * @param {Function} filterFn 필터 함수
     */
    filter(filterFn) {
        const filteredData = this.state.data.filter(filterFn);
        this.setState({ data: filteredData });
    }

    /**
     * 정렬
     * @param {Function} sortFn 정렬 함수
     */
    sort(sortFn) {
        const sortedData = [...this.state.data].sort(sortFn);
        this.setState({ data: sortedData });
    }
}