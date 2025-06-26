// Related Content Component 클래스
export class RelatedContentComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.config = options.config || {};
        this.dataService = options.dataService;
        
        this.state = {
            loading: false,
            error: null,
            data: []
        };
    }

    async init() {
        try {
            await this.loadData();
            this.render();
            this.bindEvents();
        } catch (error) {
            this.handleError(error);
        }
    }

    async loadData() {
        this.setState({ loading: true, error: null });

        try {
            const sections = [];
            
            for (const sectionConfig of this.config.sections) {
                const result = await this.dataService.getContentByCategory(
                    sectionConfig.category,
                    {
                        limit: sectionConfig.limit,
                        showComingSoon: sectionConfig.showComingSoon
                    }
                );

                if (result.success) {
                    sections.push({
                        ...sectionConfig,
                        items: result.data.map(item => ({
                            ...item,
                            statusText: this.getStatusText(item.status)
                        }))
                    });
                }
            }

            this.setState({ 
                loading: false, 
                data: { sections } 
            });

        } catch (error) {
            this.setState({ 
                loading: false, 
                error: error.message 
            });
        }
    }

    render() {
        if (this.state.loading) {
            this.element.innerHTML = '<div class="loading">로딩 중...</div>';
            return;
        }

        if (this.state.error) {
            this.element.innerHTML = `<div class="error">오류: ${this.state.error}</div>`;
            return;
        }

        // 기존 HTML 구조와 동일하게 렌더링
        const sectionsHtml = this.state.data.sections.map(section => {
            const cardsHtml = section.items.map(item => {
                const hasLink = item.url && item.url.trim() !== '';
                const status = hasLink ? item.status : 'coming-soon';
                
                return `
                    <div class="related-card" data-blog-id="${item.id}" data-blog-type="${section.category}">
                        <h4>${item.title || '제목 없음'}</h4>
                        <p>${item.description || '설명이 없습니다.'}</p>
                        <div class="card-footer">
                            <span class="card-status ${status}">
                                ${status === 'published' ? '공개됨' : '출시 예정'}
                            </span>
                            ${hasLink ? `<a href="${item.url}" class="card-link" target="_blank">자세히 보기</a>` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="related-section">
                    <h3>${section.title}</h3>
                    <div class="related-grid" id="${section.id}-grid">
                        ${cardsHtml}
                    </div>
                </div>
            `;
        }).join('');

        this.element.innerHTML = `
            <h2>🔗 연관 콘텐츠</h2>
            <div class="related-sections">
                ${sectionsHtml}
            </div>
        `;
    }

    bindEvents() {
        this.element.addEventListener('click', (e) => {
            if (e.target.matches('.card-link')) {
                return; // 링크 클릭은 기본 동작
            }
            
            const card = e.target.closest('.related-card');
            if (card) {
                this.handleCardClick(card);
            }
        });
    }

    handleCardClick(card) {
        const blogId = card.getAttribute('data-blog-id');
        const blogType = card.getAttribute('data-blog-type');
        
        console.log(`🔗 연관 게시글 클릭됨: ID ${blogId}, Type ${blogType}`);
        
        // 조회수 증가 (기존 로직과 동일)
        if (blogId && this.dataService.incrementViewCount) {
            this.dataService.incrementViewCount(blogId).then(result => {
                if (result.success) {
                    console.log(`📈 조회수 증가: 게시글 ID ${blogId}`);
                }
            }).catch(error => {
                console.warn(`조회수 증가 실패: 게시글 ID ${blogId}`, error);
            });
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    getStatusText(status) {
        const statusMap = {
            'published': '공개됨',
            'coming-soon': '출시 예정',
            'draft': '준비 중'
        };
        return statusMap[status] || status;
    }

    handleError(error) {
        console.error('RelatedContent 컴포넌트 오류:', error);
        this.setState({ error: error.message, loading: false });
    }

    destroy() {
        this.element.innerHTML = '';
    }

    async update(newConfig) {
        this.config = { ...this.config, ...newConfig };
        await this.loadData();
        this.render();
    }
}