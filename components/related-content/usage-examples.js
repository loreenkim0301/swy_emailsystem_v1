// 연관 콘텐츠 컴포넌트 사용 예시들
// 다양한 프로젝트에서 어떻게 사용할 수 있는지 보여주는 예시

// ===== 1. 현재 프로젝트 (EmailJS 학습 도구) =====
import { RelatedContentComponent } from './related-content-component.js';
import { RELATED_CONTENT_CONFIG } from './related-content-config.js';
import { SupabaseDataService } from './data-service-interface.js';

export async function initEmailJSRelatedContent(supabaseClient) {
    const dataService = new SupabaseDataService(supabaseClient);
    
    const relatedContent = new RelatedContentComponent(
        document.querySelector('.related-content'),
        {
            config: RELATED_CONTENT_CONFIG,
            dataService: dataService,
            onCardClick: (cardData, event) => {
                // Google Analytics 추적
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'related_content_click', {
                        content_id: cardData.id,
                        content_category: cardData.category,
                        content_title: cardData.title
                    });
                }
                
                // 기본 동작: 새 탭에서 열기
                if (cardData.url) {
                    window.open(cardData.url, '_blank');
                }
            }
        }
    );
    
    await relatedContent.init();
    return relatedContent;
}

// ===== 2. 포트폴리오 프로젝트 예시 =====
const PORTFOLIO_CONFIG = {
    title: "🚀 관련 프로젝트",
    sections: [
        {
            id: "recent-projects",
            title: "💼 최신 프로젝트",
            category: "project",
            limit: 4,
            showComingSoon: true,
            sortBy: "created_at",
            sortOrder: "desc"
        },
        {
            id: "popular-projects",
            title: "⭐ 인기 프로젝트",
            category: "project", 
            limit: 4,
            showComingSoon: false,
            sortBy: "view_count",
            sortOrder: "desc"
        }
    ],
    statusText: {
        'published': 'Live',
        'coming-soon': 'Coming Soon',
        'preparing': 'In Development'
    },
    linkText: {
        available: 'View Project',
        unavailable: 'Coming Soon'
    }
};

export async function initPortfolioRelatedContent(dataService) {
    const relatedContent = new RelatedContentComponent(
        document.querySelector('.portfolio-related'),
        {
            config: PORTFOLIO_CONFIG,
            dataService: dataService,
            onCardClick: (cardData, event) => {
                // 포트폴리오 전용 모달 열기
                openProjectModal(cardData.id);
            }
        }
    );
    
    await relatedContent.init();
    return relatedContent;
}

// ===== 3. 블로그 프로젝트 예시 =====
const BLOG_CONFIG = {
    title: "📚 추천 글",
    sections: [
        {
            id: "popular-posts",
            title: "🔥 인기 글",
            category: "blog",
            limit: 3,
            showComingSoon: false,
            sortBy: "view_count",
            sortOrder: "desc"
        },
        {
            id: "recent-posts",
            title: "🆕 최신 글",
            category: "blog",
            limit: 3,
            showComingSoon: false,
            sortBy: "created_at",
            sortOrder: "desc"
        }
    ]
};

export async function initBlogRelatedContent(dataService) {
    const relatedContent = new RelatedContentComponent(
        document.querySelector('.blog-related'),
        {
            config: BLOG_CONFIG,
            dataService: dataService,
            onCardClick: (cardData, event) => {
                // 같은 페이지에서 이동 (SPA 방식)
                if (cardData.url) {
                    event.preventDefault();
                    navigateToPost(cardData.id);
                }
            }
        }
    );
    
    await relatedContent.init();
    return relatedContent;
}

// ===== 4. 학습 플랫폼 예시 =====
const LEARNING_CONFIG = {
    title: "📖 추천 학습 자료",
    sections: [
        {
            id: "courses",
            title: "🎓 강의",
            category: "course",
            limit: 4,
            showComingSoon: true,
            sortBy: "created_at",
            sortOrder: "desc"
        },
        {
            id: "tutorials",
            title: "📝 튜토리얼",
            category: "tutorial",
            limit: 4,
            showComingSoon: true,
            sortBy: "view_count",
            sortOrder: "desc"
        }
    ],
    statusText: {
        'published': '수강 가능',
        'coming-soon': '준비 중',
        'preparing': '제작 중'
    },
    linkText: {
        available: '수강하기',
        unavailable: '준비 중'
    }
};

export async function initLearningRelatedContent(dataService) {
    const relatedContent = new RelatedContentComponent(
        document.querySelector('.learning-related'),
        {
            config: LEARNING_CONFIG,
            dataService: dataService,
            onCardClick: (cardData, event) => {
                // 학습 진행 상황 추적
                trackLearningProgress(cardData.category, cardData.id);
                
                // 강의 페이지로 이동
                if (cardData.url) {
                    window.location.href = cardData.url;
                }
            }
        }
    );
    
    await relatedContent.init();
    return relatedContent;
}

// ===== 5. 커스텀 데이터 서비스 예시 =====
class WordPressDataService extends DataServiceInterface {
    constructor(apiUrl) {
        super();
        this.apiUrl = apiUrl;
    }
    
    async getContentByCategory(category, options = {}) {
        const { limit = 10, sortBy = 'date', sortOrder = 'desc' } = options;
        
        try {
            const response = await fetch(
                `${this.apiUrl}/wp-json/wp/v2/posts?categories=${category}&per_page=${limit}&orderby=${sortBy}&order=${sortOrder}`
            );
            
            if (!response.ok) throw new Error('Failed to fetch');
            
            const posts = await response.json();
            
            const data = posts.map(post => ({
                id: post.id,
                title: post.title.rendered,
                description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
                status: post.status === 'publish' ? 'published' : 'draft',
                category: category,
                url: post.link,
                created_at: post.date
            }));
            
            return {
                success: true,
                data: data,
                count: data.length
            };
            
        } catch (error) {
            return {
                success: false,
                data: [],
                error: error.message
            };
        }
    }
}

// ===== 6. 실시간 업데이트 예시 =====
export async function initRealtimeRelatedContent(supabaseClient) {
    const dataService = new SupabaseDataService(supabaseClient);
    
    const relatedContent = new RelatedContentComponent(
        document.querySelector('.realtime-related'),
        {
            config: RELATED_CONTENT_CONFIG,
            dataService: dataService
        }
    );
    
    await relatedContent.init();
    
    // Supabase 실시간 구독
    const subscription = supabaseClient
        .channel('blogs-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'blogs' },
            (payload) => {
                console.log('Database change detected:', payload);
                // 데이터 변경 시 자동 새로고침
                relatedContent.refresh();
            }
        )
        .subscribe();
    
    return { relatedContent, subscription };
}

// ===== 7. 검색 기능 통합 예시 =====
export async function initSearchableRelatedContent(dataService) {
    const relatedContent = new RelatedContentComponent(
        document.querySelector('.searchable-related'),
        {
            config: RELATED_CONTENT_CONFIG,
            dataService: dataService
        }
    );
    
    await relatedContent.init();
    
    // 검색 기능 추가
    const searchInput = document.querySelector('#content-search');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(async () => {
                const query = e.target.value.trim();
                
                if (query.length > 2) {
                    // 검색 결과로 업데이트
                    const searchResults = await dataService.searchContent(query);
                    
                    if (searchResults.success) {
                        const searchConfig = {
                            ...RELATED_CONTENT_CONFIG,
                            title: `"${query}" 검색 결과`,
                            sections: [{
                                id: 'search-results',
                                title: '검색 결과',
                                items: searchResults.data
                            }]
                        };
                        
                        relatedContent.updateConfig(searchConfig);
                    }
                } else {
                    // 원래 설정으로 복원
                    relatedContent.updateConfig(RELATED_CONTENT_CONFIG);
                    await relatedContent.refresh();
                }
            }, 300);
        });
    }
    
    return relatedContent;
}

// ===== 8. 다국어 지원 예시 =====
const MULTILANG_CONFIG = {
    ko: {
        title: "🔧 더 많은 콘텐츠",
        statusText: {
            'published': '공개됨',
            'coming-soon': '출시 예정'
        },
        linkText: {
            available: '자세히 보기',
            unavailable: '출시 예정'
        }
    },
    en: {
        title: "🔧 More Content",
        statusText: {
            'published': 'Published',
            'coming-soon': 'Coming Soon'
        },
        linkText: {
            available: 'Learn More',
            unavailable: 'Coming Soon'
        }
    }
};

export async function initMultilingualRelatedContent(dataService, language = 'ko') {
    const config = {
        ...RELATED_CONTENT_CONFIG,
        ...MULTILANG_CONFIG[language]
    };
    
    const relatedContent = new RelatedContentComponent(
        document.querySelector('.multilang-related'),
        {
            config: config,
            dataService: dataService
        }
    );
    
    await relatedContent.init();
    return relatedContent;
}

// ===== 유틸리티 함수들 =====
function openProjectModal(projectId) {
    // 프로젝트 모달 열기 로직
    console.log(`Opening project modal for ID: ${projectId}`);
}

function navigateToPost(postId) {
    // SPA 네비게이션 로직
    console.log(`Navigating to post: ${postId}`);
}

function trackLearningProgress(category, contentId) {
    // 학습 진행 상황 추적 로직
    console.log(`Tracking progress: ${category}/${contentId}`);
}