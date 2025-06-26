/**
 * 기존 프로젝트와 모듈화된 연관 콘텐츠 컴포넌트 통합
 */
import { createRelatedContent, SupabaseDataService } from '../components/related-content/index.js';
import { supabaseClient } from './supabase-client.js';
import { incrementViewCount } from './blogs-client.js';

/**
 * 연관 콘텐츠 초기화 및 로드
 */
export async function initializeRelatedContent() {
    try {
        // Supabase 클라이언트 확인
        if (!supabaseClient) {
            console.warn('Supabase 클라이언트가 초기화되지 않았습니다.');
            return null;
        }

        // 데이터 서비스 생성
        const dataService = new SupabaseDataService(supabaseClient);

        // 연관 콘텐츠 매니저 생성
        const relatedContentManager = createRelatedContent('#related-content-container', {
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
            dataService: dataService,
            onCardClick: handleCardClick,
            onViewCountIncrement: handleViewCountIncrement
        });

        // 데이터 로드
        await relatedContentManager.loadAllData();

        console.log('✅ 연관 콘텐츠 컴포넌트 초기화 완료');
        return relatedContentManager;

    } catch (error) {
        console.error('❌ 연관 콘텐츠 초기화 실패:', error);
        return null;
    }
}

/**
 * 카드 클릭 핸들러
 * @param {Object} data 카드 데이터
 * @param {Event} event 클릭 이벤트
 */
function handleCardClick(data, event) {
    // 로그 출력
    console.log(`🔗 연관 게시글 클릭됨:`, {
        id: data.id,
        title: data.title,
        category: data.category,
        status: data.status,
        hasUrl: !!(data.url && data.url.trim() !== ''),
        url: data.url || null
    });

    // Google Analytics 이벤트 추적 (있는 경우)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'related_content_click', {
            content_id: data.id,
            content_title: data.title,
            content_category: data.category,
            content_status: data.status
        });
    }
}

/**
 * 조회수 증가 핸들러
 * @param {string|number} blogId 블로그 ID
 * @returns {Promise<Object>} 결과
 */
async function handleViewCountIncrement(blogId) {
    try {
        const result = await incrementViewCount(blogId);
        
        if (result.success) {
            console.log(`📈 조회수 증가 성공: 게시글 ID ${blogId}`);
        } else {
            console.warn(`📈 조회수 증가 실패: 게시글 ID ${blogId}`, result.error);
        }

        return result;

    } catch (error) {
        console.error(`📈 조회수 증가 오류: 게시글 ID ${blogId}`, error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 기존 연관 콘텐츠 로드 함수 (하위 호환성)
 * @deprecated 새로운 모듈화된 시스템을 사용하세요
 */
export async function loadRelatedContent() {
    console.warn('⚠️ loadRelatedContent는 deprecated입니다. initializeRelatedContent를 사용하세요.');
    return await initializeRelatedContent();
}