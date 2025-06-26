/**
 * 기존 프로젝트와 ContentCard 컴포넌트 통합
 */
import { createContentCard } from '../components/ContentCard/index.js';
import { getAllBlogs, incrementViewCount } from './blogs-client.js';

/**
 * 콘텐츠 목록을 카드로 렌더링
 * @param {string} containerId 컨테이너 ID
 * @param {string} category 카테고리
 * @param {number} limit 제한 수
 */
export async function renderContentCards(containerId, category, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`컨테이너를 찾을 수 없습니다: ${containerId}`);
        return;
    }

    try {
        // 로딩 상태 표시
        container.innerHTML = '<div class="loading">콘텐츠를 불러오는 중...</div>';

        // 데이터 조회
        const result = await getAllBlogs({
            category,
            status: ['published', 'coming-soon'],
            limit
        });

        if (!result.success || result.blogs.length === 0) {
            container.innerHTML = '<div class="empty-state">표시할 콘텐츠가 없습니다.</div>';
            return;
        }

        // 카드들 생성
        const cards = result.blogs.map(blog => {
            return createContentCard(blog, {
                onClick: async (data, event) => {
                    // 조회수 증가
                    if (data.id) {
                        try {
                            await incrementViewCount(data.id);
                            console.log(`📈 조회수 증가: ${data.title}`);
                        } catch (error) {
                            console.warn('조회수 증가 실패:', error);
                        }
                    }

                    // 분석 이벤트 (있는 경우)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'content_card_click', {
                            content_id: data.id,
                            content_title: data.title,
                            content_category: data.category
                        });
                    }
                }
            });
        });

        // DOM에 렌더링
        container.innerHTML = '';
        cards.forEach(card => {
            const cardElement = card.createElement();
            container.appendChild(cardElement);
        });

        console.log(`✅ ${category} 카드 ${cards.length}개 렌더링 완료`);

    } catch (error) {
        console.error(`❌ ${category} 카드 렌더링 실패:`, error);
        container.innerHTML = '<div class="error-state">콘텐츠를 불러오는데 실패했습니다.</div>';
    }
}

/**
 * 웹사이트 목록 렌더링
 */
export async function renderWebsiteCards() {
    await renderContentCards('websiteList', 'website', 6);
}

/**
 * 블로그 목록 렌더링
 */
export async function renderBlogCards() {
    await renderContentCards('blogList', 'blog', 6);
}

/**
 * 모든 콘텐츠 카드 초기화
 */
export async function initializeContentCards() {
    try {
        await Promise.all([
            renderWebsiteCards(),
            renderBlogCards()
        ]);
        console.log('✅ 모든 콘텐츠 카드 초기화 완료');
    } catch (error) {
        console.error('❌ 콘텐츠 카드 초기화 실패:', error);
    }
}

/**
 * 특정 카테고리 새로고침
 * @param {string} category 카테고리
 */
export async function refreshContentCards(category) {
    const containerMap = {
        'website': 'websiteList',
        'blog': 'blogList'
    };

    const containerId = containerMap[category];
    if (containerId) {
        await renderContentCards(containerId, category, 6);
    }
}