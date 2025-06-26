/**
 * More Content Component
 * 연관 콘텐츠를 표시하는 재사용 가능한 컴포넌트
 */
export class MoreContentComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.config = {
            title: options.title || '🚀 더 많은 콘텐츠 나아가기',
            subtitle: options.subtitle || '더 많은 학습 도구와 바이브코딩 인사이트를 확인해보세요',
            sections: options.sections || [
                {
                    id: 'websites',
                    title: '🔧 더 많은 학습 도구',
                    category: 'website',
                    limit: 6
                },
                {
                    id: 'blogs',
                    title: '📚 바이브코딩 인사이트',
                    category: 'blog',
                    limit: 6
                }
            ],
            ...options
        };
        
        this.dataService = options.dataService;
        this.state = {
            loading: false,
            error: null,
            data: {}
        };
    }

    async init() {
        try {
            this.render();
            await this.loadData();
            this.updateContent();
        } catch (error) {
            this.handleError(error);
        }
    }

    render() {
        this.element.innerHTML = `
            <div class="more-content">
                <div class="more-content__header">
                    <h2 class="more-content__title">${this.config.title}</h2>
                    <p class="more-content__subtitle">${this.config.subtitle}</p>
                </div>
                <div class="more-content__sections">
                    ${this.config.sections.map(section => `
                        <div class="more-content__section" data-section="${section.id}">
                            <h3 class="more-content__section-title">${section.title}</h3>
                            <div class="more-content__grid" id="${section.id}-grid">
                                <div class="loading">로딩 중...</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async loadData() {
        if (!this.dataService) {
            throw new Error('데이터 서비스가 설정되지 않았습니다.');
        }

        this.setState({ loading: true, error: null });

        try {
            const promises = this.config.sections.map(async (section) => {
                const result = await this.dataService.getContentByCategory(
                    section.category, 
                    { limit: section.limit }
                );
                return { sectionId: section.id, data: result };
            });

            const results = await Promise.all(promises);
            const data = {};
            
            results.forEach(({ sectionId, data: sectionData }) => {
                data[sectionId] = sectionData;
            });

            this.setState({ loading: false, data });

        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    updateContent() {
        if (this.state.loading) return;

        if (this.state.error) {
            this.config.sections.forEach(section => {
                const grid = this.element.querySelector(`#${section.id}-grid`);
                if (grid) {
                    grid.innerHTML = `<div class="error">오류: ${this.state.error}</div>`;
                }
            });
            return;
        }

        this.config.sections.forEach(section => {
            const grid = this.element.querySelector(`#${section.id}-grid`);
            const sectionData = this.state.data[section.id];
            
            if (grid && sectionData) {
                if (sectionData.success && sectionData.blogs && sectionData.blogs.length > 0) {
                    grid.innerHTML = sectionData.blogs.map(item => this.renderCard(item)).join('');
                } else {
                    grid.innerHTML = '<div class="no-content">콘텐츠가 없습니다.</div>';
                }
            }
        });
    }

    renderCard(item) {
        const statusText = this.getStatusText(item.status);
        const statusClass = item.status === 'published' ? 'published' : 'coming-soon';
        
        return `
            <div class="more-content__card" data-id="${item.id}">
                <h4 class="more-content__card-title">${item.title}</h4>
                <p class="more-content__card-description">${item.description || ''}</p>
                <div class="more-content__card-footer">
                    <span class="more-content__card-status ${statusClass}">${statusText}</span>
                    ${item.url ? `<a href="${item.url}" class="more-content__card-link" target="_blank">자세히 보기</a>` : ''}
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'published': '공개됨',
            'coming-soon': '출시 예정',
            'draft': '준비 중'
        };
        return statusMap[status] || status;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    handleError(error) {
        console.error('MoreContent 컴포넌트 오류:', error);
        this.setState({ error: error.message, loading: false });
    }

    destroy() {
        this.element.innerHTML = '';
    }

    async refresh() {
        await this.loadData();
        this.updateContent();
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.render();
        this.loadData().then(() => this.updateContent());
    }
}