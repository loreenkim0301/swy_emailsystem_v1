// 연관 콘텐츠 컴포넌트 클래스
// 재사용 가능한 연관 콘텐츠 컴포넌트

export class RelatedContentComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.config = options.config || {};
        this.dataService = options.dataService;
        this.onCardClick = options.onCardClick || this.defaultCardClickHandler;
        
        // 기본 설정
        this.defaultConfig = {
            title: "관련 콘텐츠",
            sections: [],
            statusText: {
                'published': '공개됨',
                'coming-soon': '출시 예정',
                'preparing': '준비 중'
            },
            linkText: {
                available: '자세히 보기',
                unavailable: '출시 예정'
            },
            messages: {
                loading: '콘텐츠를 불러오는 중...',
                error: '콘텐츠를 불러오는데 실패했습니다.',
                empty: '표시할 콘텐츠가 없습니다.'
            }
        };
        
        // 설정 병합
        this.config = { ...this.defaultConfig, ...this.config };
        
        // 상태 관리
        this.state = {
            loading: false,
            error: null,
            data: {}
        };
    }

    // 컴포넌트 초기화
    async init() {
        if (!this.element) {
            console.error('Related content element not found');
            return;
        }

        if (!this.dataService) {
            console.error('Data service not provided');
            this.showError('데이터 서비스가 설정되지 않았습니다.');
            return;
        }

        try {
            this.showLoading();
            await this.loadData();
            this.render();
            this.bindEvents();
        } catch (error) {
            console.error('Related content initialization failed:', error);
            this.showError(error.message);
        }
    }

    // 데이터 로드
    async loadData() {
        this.setState({ loading: true, error: null });

        try {
            const sectionsData = {};

            for (const sectionConfig of this.config.sections) {
                const result = await this.dataService.getContentByCategory(
                    sectionConfig.category,
                    {
                        limit: sectionConfig.limit,
                        showComingSoon: sectionConfig.showComingSoon,
                        sortBy: sectionConfig.sortBy,
                        sortOrder: sectionConfig.sortOrder
                    }
                );

                if (result.success) {
                    sectionsData[sectionConfig.id] = {
                        ...sectionConfig,
                        items: result.data.map(item => ({
                            ...item,
                            statusText: this.getStatusText(item.status)
                        }))
                    };
                } else {
                    console.warn(`Failed to load ${sectionConfig.category}:`, result.error);
                    sectionsData[sectionConfig.id] = {
                        ...sectionConfig,
                        items: []
                    };
                }
            }

            this.setState({ 
                loading: false, 
                data: sectionsData 
            });

        } catch (error) {
            this.setState({ 
                loading: false, 
                error: error.message 
            });
            throw error;
        }
    }

    // 메인 렌더링
    render() {
        if (!this.element) return;

        const sectionsHTML = Object.values(this.state.data)
            .map(section => this.renderSection(section))
            .join('');

        const html = `
            <h2 class="related-content__title">${this.config.title}</h2>
            <div class="related-content__sections">
                ${sectionsHTML}
            </div>
        `;

        this.element.innerHTML = html;
    }

    // 섹션 렌더링
    renderSection(section) {
        const cardsHTML = section.items
            .map(item => this.renderCard(item))
            .join('');

        return `
            <div class="related-content__section" data-section="${section.id}">
                <h3 class="related-content__section-title">${section.title}</h3>
                <div class="related-content__grid">
                    ${cardsHTML || this.renderEmptyState()}
                </div>
            </div>
        `;
    }

    // 카드 렌더링
    renderCard(item) {
        const statusBadge = this.renderStatusBadge(item.status);
        const hasUrl = item.url && item.url.trim() !== '';
        const linkText = hasUrl ? 
            this.config.linkText.available : 
            this.config.linkText.unavailable;
        const linkClass = hasUrl ? 
            'related-content__card-link' : 
            'related-content__card-link related-content__card-link--disabled';

        return `
            <article class="related-content__card" 
                     data-id="${item.id}"
                     data-url="${item.url || ''}"
                     data-category="${item.category || ''}"
                     ${hasUrl ? 'tabindex="0"' : ''}>
                ${statusBadge}
                <h4 class="related-content__card-title">${this.escapeHtml(item.title)}</h4>
                <p class="related-content__card-description">
                    ${this.escapeHtml(item.description || '설명이 없습니다.')}
                </p>
                <span class="${linkClass}">${linkText}</span>
            </article>
        `;
    }

    // 상태 배지 렌더링
    renderStatusBadge(status) {
        if (!status) return '';
        
        const statusText = this.getStatusText(status);
        const statusClass = `related-content__card-status--${status.replace('_', '-')}`;
        
        return `<span class="related-content__card-status ${statusClass}">${statusText}</span>`;
    }

    // 로딩 상태 표시
    showLoading() {
        if (!this.element) return;
        
        this.element.innerHTML = `
            <h2 class="related-content__title">${this.config.title}</h2>
            <div class="related-content__loading">
                ${this.config.messages.loading}
            </div>
        `;
    }

    // 에러 상태 표시
    showError(message) {
        if (!this.element) return;
        
        this.element.innerHTML = `
            <h2 class="related-content__title">${this.config.title}</h2>
            <div class="related-content__error">
                ${message || this.config.messages.error}
            </div>
        `;
    }

    // 빈 상태 렌더링
    renderEmptyState() {
        return `
            <div class="related-content__empty">
                ${this.config.messages.empty}
            </div>
        `;
    }

    // 이벤트 바인딩
    bindEvents() {
        if (!this.element) return;

        // 카드 클릭 이벤트
        this.element.addEventListener('click', (e) => {
            const card = e.target.closest('.related-content__card');
            if (card && card.dataset.url) {
                this.handleCardClick(card, e);
            }
        });

        // 키보드 접근성
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.related-content__card');
                if (card && card.dataset.url) {
                    e.preventDefault();
                    this.handleCardClick(card, e);
                }
            }
        });
    }

    // 카드 클릭 처리
    handleCardClick(card, event) {
        const cardData = {
            id: card.dataset.id,
            url: card.dataset.url,
            category: card.dataset.category,
            title: card.querySelector('.related-content__card-title')?.textContent
        };

        // 분석 이벤트 발송
        this.trackCardClick(cardData);

        // 커스텀 클릭 핸들러 호출
        this.onCardClick(cardData, event);
    }

    // 기본 카드 클릭 핸들러
    defaultCardClickHandler(cardData, event) {
        if (cardData.url) {
            window.open(cardData.url, '_blank');
        }
    }

    // 분석 이벤트 추적
    trackCardClick(cardData) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'related_content_click', {
                content_id: cardData.id,
                content_category: cardData.category,
                content_title: cardData.title
            });
        }

        // 커스텀 분석
        if (typeof this.onAnalytics === 'function') {
            this.onAnalytics('card_click', cardData);
        }
    }

    // 유틸리티 함수들
    getStatusText(status) {
        return this.config.statusText[status] || status;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    // 공개 API
    async refresh() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.render();
        this.bindEvents();
    }

    getState() {
        return { ...this.state };
    }

    destroy() {
        if (this.element) {
            this.element.innerHTML = '';
            this.element.removeEventListener('click', this.handleCardClick);
            this.element.removeEventListener('keydown', this.handleCardClick);
        }
    }
}