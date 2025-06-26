/**
 * More Content 컴포넌트 통합 파일
 * 기존 프로젝트에서 새로운 컴포넌트를 사용하기 위한 통합 레이어
 */
import { MoreContentComponent } from '../components/more-content/MoreContentComponent.js';
import { SupabaseDataService } from '../components/more-content/DataService.js';
import { supabaseClient } from './supabase-client.js';

/**
 * 기존 more-content 섹션을 새로운 컴포넌트로 교체
 */
export async function initializeMoreContent() {
    const moreContentElement = document.querySelector('.more-content');
    
    if (!moreContentElement) {
        console.warn('More content 요소를 찾을 수 없습니다.');
        return;
    }

    try {
        // Supabase 데이터 서비스 생성
        const dataService = new SupabaseDataService(supabaseClient);
        
        // 컴포넌트 인스턴스 생성
        const moreContentComponent = new MoreContentComponent(
            moreContentElement,
            {
                title: '🚀 더 많은 콘텐츠 나아가기',
                subtitle: '더 많은 학습 도구와 바이브코딩 인사이트를 확인해보세요',
                sections: [
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
                dataService: dataService
            }
        );

        // 컴포넌트 초기화
        await moreContentComponent.init();
        
        console.log('✅ More Content 컴포넌트 초기화 완료');
        
        // 전역에서 접근 가능하도록 설정 (디버깅용)
        window.moreContentComponent = moreContentComponent;
        
        return moreContentComponent;

    } catch (error) {
        console.error('❌ More Content 컴포넌트 초기화 실패:', error);
        
        // 폴백: 기존 방식으로 로드
        console.log('기존 방식으로 폴백합니다...');
        await loadRelatedContentFallback();
    }
}

/**
 * 폴백: 기존 방식으로 연관 콘텐츠 로드
 */
async function loadRelatedContentFallback() {
    try {
        const { getWebsitesWithComingSoon, getBlogPosts } = await import('./blogs-client.js');
        
        // 기존 로직 실행
        const [websitesResult, blogsResult] = await Promise.all([
            getWebsitesWithComingSoon(6),
            getBlogPosts(6)
        ]);

        if (websitesResult.success) {
            renderWebsites(websitesResult.blogs);
        }

        if (blogsResult.success) {
            renderBlogs(blogsResult.blogs);
        }

    } catch (error) {
        console.error('폴백 로드 실패:', error);
    }
}

/**
 * 기존 웹사이트 렌더링 함수 (폴백용)
 */
function renderWebsites(websites) {
    const websitesGrid = document.querySelector('#websites-grid');
    if (!websitesGrid) return;

    websitesGrid.innerHTML = websites.map(website => `
        <div class="related-card" data-id="${website.id}">
            <h4>${website.title}</h4>
            <p>${website.description || ''}</p>
            <div class="card-footer">
                <span class="card-status ${website.status}">${getStatusText(website.status)}</span>
                ${website.url ? `<a href="${website.url}" class="card-link" target="_blank">자세히 보기</a>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * 기존 블로그 렌더링 함수 (폴백용)
 */
function renderBlogs(blogs) {
    const blogsGrid = document.querySelector('#blogs-grid');
    if (!blogsGrid) return;

    blogsGrid.innerHTML = blogs.map(blog => `
        <div class="related-card" data-id="${blog.id}">
            <h4>${blog.title}</h4>
            <p>${blog.description || ''}</p>
            <div class="card-footer">
                <span class="card-status ${blog.status}">${getStatusText(blog.status)}</span>
                ${blog.url ? `<a href="${blog.url}" class="card-link" target="_blank">자세히 보기</a>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * 상태 텍스트 변환 (폴백용)
 */
function getStatusText(status) {
    const statusMap = {
        'published': '공개됨',
        'coming-soon': '출시 예정',
        'draft': '준비 중'
    };
    return statusMap[status] || status;
}