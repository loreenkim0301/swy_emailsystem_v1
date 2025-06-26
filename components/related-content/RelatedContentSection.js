/**
 * 연관 콘텐츠 섹션 컴포넌트
 * 제목과 그리드를 포함한 완전한 섹션
 */
import { RelatedContentGrid } from './RelatedContentGrid.js';

export class RelatedContentSection {
    constructor(container, config = {}) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!this.container) {
            throw new Error('RelatedContentSection: 유효한 컨테이너를 찾을 수 없습니다.');
        }

        this.config = {
            title: '연관 콘텐츠',
            titleIcon: '🔗',
            sectionClass: 'related-section',
            titleClass: 'related-section__title',
            gridClass: 'related-grid',
            dataService: null,
            category: null,
            limit: 6,
            showComingSoon: true,
            cardOptions: {},
            onCardClick: null,
            onViewCountIncrement: null,
            ...config
        };

        this.grid = null;
        this.titleElement = null;
        this.gridContainer = null;

        this.init();
    }

    /**
     * 섹션 초기화
     */
    init() {
        this.render();
        this.createGrid();
    }

    /**
     * 섹션 HTML 구조 렌더링
     */
    render() {
        this.container.className = this.config.sectionClass;
        this.container.innerHTML = `
            <h3 class="${this.config.titleClass}">
                <span class="related-section__icon">${this.config.titleIcon}</span>
                <span class="related-section__text">${this.config.title}</span>
            </h3>
            <div class="${this.config.gridClass}"></div>
        `;

        this.titleElement = this.container.querySelector(`.${this.config.titleClass}`);
        this.gridContainer = this.container.querySelector(`.${this.config.gridClass}`);
    }

    /**
     * 그리드 생성
     */
    createGrid() {
        this.grid = new RelatedContentGrid(this.gridContainer, {
            cardOptions: this.config.cardOptions,
            onCardClick: this.config.onCardClick,
            onViewCountIncrement: this.config.onViewCountIncrement
        });
    }

    /**
     * 데이터 로드
     */
    async loadData() {
        if (!this.config.dataService) {
            console.warn('RelatedContentSection: 데이터 서비스가 설정되지 않았습니다.');
            return;
        }

        try {
            this.grid.setState({ loading: true, error: null });

            const result = await this.config.dataService.getContentByCategory(
                this.config.category,
                {
                    limit: this.config.limit,
                    showComingSoon: this.config.showComingSoon
                }
            );

            if (result.success) {
                await this.grid.loadData(result.data);
            } else {
                throw new Error(result.error || '데이터 로드에 실패했습니다.');
            }

        } catch (error) {
            console.error('RelatedContentSection 데이터 로드 오류:', error);
            this.grid.setState({ 
                loading: false, 
                error: error.message 
            });
        }
    }

    /**
     * 제목 업데이트
     * @param {string} newTitle 새로운 제목
     * @param {string} newIcon 새로운 아이콘 (선택사항)
     */
    updateTitle(newTitle, newIcon = null) {
        this.config.title = newTitle;
        if (newIcon) {
            this.config.titleIcon = newIcon;
        }

        if (this.titleElement) {
            this.titleElement.innerHTML = `
                <span class="related-section__icon">${this.config.titleIcon}</span>
                <span class="related-section__text">${this.config.title}</span>
            `;
        }
    }

    /**
     * 설정 업데이트
     * @param {Object} newConfig 새로운 설정
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // 제목이 변경된 경우 업데이트
        if (newConfig.title || newConfig.titleIcon) {
            this.updateTitle(this.config.title, this.config.titleIcon);
        }
    }

    /**
     * 데이터 새로고침
     */
    async refresh() {
        await this.loadData();
    }

    /**
     * 섹션 파괴
     */
    destroy() {
        if (this.grid) {
            this.grid.destroy();
        }
        this.container.innerHTML = '';
    }

    /**
     * 그리드 인스턴스 반환
     * @returns {RelatedContentGrid} 그리드 인스턴스
     */
    getGrid() {
        return this.grid;
    }

    /**
     * 카드 추가
     * @param {Object} cardData 카드 데이터
     */
    addCard(cardData) {
        if (this.grid) {
            this.grid.addCard(cardData);
        }
    }

    /**
     * 카드 제거
     * @param {string|number} cardId 카드 ID
     */
    removeCard(cardId) {
        if (this.grid) {
            this.grid.removeCard(cardId);
        }
    }

    /**
     * 카드 업데이트
     * @param {string|number} cardId 카드 ID
     * @param {Object} newData 새로운 데이터
     */
    updateCard(cardId, newData) {
        if (this.grid) {
            this.grid.updateCard(cardId, newData);
        }
    }

    /**
     * 필터링
     * @param {Function} filterFn 필터 함수
     */
    filter(filterFn) {
        if (this.grid) {
            this.grid.filter(filterFn);
        }
    }

    /**
     * 정렬
     * @param {Function} sortFn 정렬 함수
     */
    sort(sortFn) {
        if (this.grid) {
            this.grid.sort(sortFn);
        }
    }
}