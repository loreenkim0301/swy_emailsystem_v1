/**
 * 연관 콘텐츠 컴포넌트 메인 진입점
 * 모든 컴포넌트를 통합하고 쉬운 사용을 위한 팩토리 함수 제공
 */

// 컴포넌트 임포트
export { RelatedContentCard } from './RelatedContentCard.js';
export { RelatedContentGrid } from './RelatedContentGrid.js';
export { RelatedContentSection } from './RelatedContentSection.js';

// 데이터 서비스 임포트
export { 
    DataServiceInterface, 
    SupabaseDataService, 
    MockDataService 
} from './DataService.js';

/**
 * 연관 콘텐츠 전체 시스템을 관리하는 메인 클래스
 */
export class RelatedContentManager {
    constructor(container, config = {}) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!this.container) {
            throw new Error('RelatedContentManager: 유효한 컨테이너를 찾을 수 없습니다.');
        }

        this.config = {
            title: '🔗 연관 콘텐츠',
            sections: [
                {
                    id: 'websites',
                    title: '🔧 더 많은 학습 도구',
                    category: 'website',
                    limit: 6,
                    showComingSoon: true
                },
                {
                    id: 'blogs',
                    title: '📚 바이브코딩 인사이트',
                    category: 'blog',
                    limit: 6,
                    showComingSoon: true
                }
            ],
            dataService: null,
            onCardClick: null,
            onViewCountIncrement: null,
            ...config
        };

        this.sections = new Map();
        this.init();
    }

    /**
     * 매니저 초기화
     */
    init() {
        this.render();
        this.createSections();
    }

    /**
     * 메인 구조 렌더링
     */
    render() {
        this.container.className = 'related-content';
        this.container.innerHTML = `
            <h2 class="related-content__title">${this.config.title}</h2>
            <div class="related-sections">
                ${this.config.sections.map(section => `
                    <div id="section-${section.id}" class="related-section-container"></div>
                `).join('')}
            </div>
        `;
    }

    /**
     * 섹션들 생성
     */
    createSections() {
        this.config.sections.forEach(sectionConfig => {
            const sectionContainer = this.container.querySelector(`#section-${sectionConfig.id}`);
            
            if (sectionContainer) {
                const section = new RelatedContentSection(sectionContainer, {
                    ...sectionConfig,
                    dataService: this.config.dataService,
                    onCardClick: this.config.onCardClick,
                    onViewCountIncrement: this.config.onViewCountIncrement
                });

                this.sections.set(sectionConfig.id, section);
            }
        });
    }

    /**
     * 모든 섹션 데이터 로드
     */
    async loadAllData() {
        const loadPromises = Array.from(this.sections.values()).map(section => 
            section.loadData().catch(error => {
                console.error(`섹션 데이터 로드 실패:`, error);
            })
        );

        await Promise.all(loadPromises);
    }

    /**
     * 특정 섹션 데이터 로드
     * @param {string} sectionId 섹션 ID
     */
    async loadSectionData(sectionId) {
        const section = this.sections.get(sectionId);
        if (section) {
            await section.loadData();
        } else {
            console.warn(`섹션을 찾을 수 없습니다: ${sectionId}`);
        }
    }

    /**
     * 섹션 추가
     * @param {Object} sectionConfig 섹션 설정
     */
    addSection(sectionConfig) {
        // 설정에 섹션 추가
        this.config.sections.push(sectionConfig);
        
        // DOM에 컨테이너 추가
        const sectionsContainer = this.container.querySelector('.related-sections');
        const sectionContainer = document.createElement('div');
        sectionContainer.id = `section-${sectionConfig.id}`;
        sectionContainer.className = 'related-section-container';
        sectionsContainer.appendChild(sectionContainer);

        // 섹션 인스턴스 생성
        const section = new RelatedContentSection(sectionContainer, {
            ...sectionConfig,
            dataService: this.config.dataService,
            onCardClick: this.config.onCardClick,
            onViewCountIncrement: this.config.onViewCountIncrement
        });

        this.sections.set(sectionConfig.id, section);

        // 데이터 로드
        section.loadData();
    }

    /**
     * 섹션 제거
     * @param {string} sectionId 섹션 ID
     */
    removeSection(sectionId) {
        const section = this.sections.get(sectionId);
        if (section) {
            section.destroy();
            this.sections.delete(sectionId);
            
            // 설정에서도 제거
            this.config.sections = this.config.sections.filter(s => s.id !== sectionId);
            
            // DOM에서 제거
            const sectionContainer = this.container.querySelector(`#section-${sectionId}`);
            if (sectionContainer) {
                sectionContainer.remove();
            }
        }
    }

    /**
     * 특정 섹션 반환
     * @param {string} sectionId 섹션 ID
     * @returns {RelatedContentSection|null} 섹션 인스턴스
     */
    getSection(sectionId) {
        return this.sections.get(sectionId) || null;
    }

    /**
     * 모든 섹션 반환
     * @returns {Map} 섹션 맵
     */
    getAllSections() {
        return this.sections;
    }

    /**
     * 데이터 서비스 업데이트
     * @param {DataServiceInterface} newDataService 새로운 데이터 서비스
     */
    updateDataService(newDataService) {
        this.config.dataService = newDataService;
        
        // 모든 섹션의 데이터 서비스 업데이트
        this.sections.forEach(section => {
            section.updateConfig({ dataService: newDataService });
        });
    }

    /**
     * 전체 새로고침
     */
    async refresh() {
        await this.loadAllData();
    }

    /**
     * 매니저 파괴
     */
    destroy() {
        this.sections.forEach(section => section.destroy());
        this.sections.clear();
        this.container.innerHTML = '';
    }

    /**
     * 설정 업데이트
     * @param {Object} newConfig 새로운 설정
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // 제목 업데이트
        if (newConfig.title) {
            const titleElement = this.container.querySelector('.related-content__title');
            if (titleElement) {
                titleElement.textContent = newConfig.title;
            }
        }
    }
}

/**
 * 간편한 팩토리 함수들
 */

/**
 * 연관 콘텐츠 시스템 생성
 * @param {string|HTMLElement} container 컨테이너
 * @param {Object} config 설정
 * @returns {RelatedContentManager} 매니저 인스턴스
 */
export function createRelatedContent(container, config = {}) {
    return new RelatedContentManager(container, config);
}

/**
 * 단일 섹션 생성
 * @param {string|HTMLElement} container 컨테이너
 * @param {Object} config 설정
 * @returns {RelatedContentSection} 섹션 인스턴스
 */
export function createRelatedSection(container, config = {}) {
    return new RelatedContentSection(container, config);
}

/**
 * 단일 그리드 생성
 * @param {string|HTMLElement} container 컨테이너
 * @param {Object} options 옵션
 * @returns {RelatedContentGrid} 그리드 인스턴스
 */
export function createRelatedGrid(container, options = {}) {
    return new RelatedContentGrid(container, options);
}

/**
 * 단일 카드 생성
 * @param {Object} data 카드 데이터
 * @param {Object} options 옵션
 * @returns {RelatedContentCard} 카드 인스턴스
 */
export function createRelatedCard(data, options = {}) {
    return new RelatedContentCard(data, options);
}