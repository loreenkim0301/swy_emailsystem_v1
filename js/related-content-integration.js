/**
 * Related Content Integration
 * 기존 프로젝트와 새로운 컴포넌트 시스템 통합
 */

import { supabaseClient } from './supabase-client.js';
import { 
  RelatedContentComponent, 
  SupabaseRelatedContentDataService,
  RELATED_CONTENT_CONFIG 
} from '../components/related-content/index.js';

/**
 * 기존 방식과 호환되는 통합 함수
 */
export async function initializeRelatedContent() {
  try {
    // Supabase 클라이언트 확인
    if (!supabaseClient) {
      console.warn('Supabase 클라이언트가 초기화되지 않았습니다.');
      return false;
    }

    // 컨테이너 확인
    const container = document.querySelector('.related-content');
    if (!container) {
      console.warn('Related content 컨테이너를 찾을 수 없습니다.');
      return false;
    }

    // 데이터 서비스 생성
    const dataService = new SupabaseRelatedContentDataService(supabaseClient);

    // 컴포넌트 생성 및 초기화
    const component = new RelatedContentComponent(container, {
      sections: RELATED_CONTENT_CONFIG.sections,
      dataService: dataService,
      onCardClick: handleCardClick,
      ...RELATED_CONTENT_CONFIG.texts
    });

    await component.init();
    
    console.log('✅ Related Content 컴포넌트 초기화 완료');
    return component;

  } catch (error) {
    console.error('❌ Related Content 초기화 실패:', error);
    return false;
  }
}

/**
 * 카드 클릭 핸들러 (기존 로직 유지)
 */
function handleCardClick(item, category) {
  // 기존 handleCardClick 로직과 동일
  console.log(`🔗 연관 게시글 클릭됨:`, {
    id: item.id,
    title: item.title,
    type: category,
    status: item.status,
    hasUrl: !!(item.url && item.url.trim() !== ''),
    url: item.url || null
  });

  // Google Analytics 등 추가 트래킹이 필요한 경우 여기에 추가
  if (typeof gtag !== 'undefined') {
    gtag('event', 'related_content_click', {
      content_type: category,
      content_id: item.id,
      content_title: item.title
    });
  }
}

/**
 * 레거시 함수들 (하위 호환성 유지)
 */
export async function loadRelatedContent() {
  console.warn('loadRelatedContent()는 deprecated입니다. initializeRelatedContent()를 사용하세요.');
  return await initializeRelatedContent();
}

export function renderRelatedCards(containerId, items, type) {
  console.warn('renderRelatedCards()는 deprecated입니다. 새로운 컴포넌트 시스템을 사용하세요.');
  // 기존 코드와의 호환성을 위해 빈 함수로 유지
}

/**
 * 컴포넌트 인스턴스 저장 (전역 접근용)
 */
window.relatedContentComponent = null;

/**
 * 전역 초기화 함수
 */
window.initRelatedContent = async function() {
  window.relatedContentComponent = await initializeRelatedContent();
  return window.relatedContentComponent;
};