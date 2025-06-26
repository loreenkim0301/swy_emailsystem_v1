/**
 * Related Content Component Entry Point
 * 연관 콘텐츠 컴포넌트 메인 진입점
 */

// 컴포넌트 클래스들
export { RelatedContentComponent } from './component.js';

// 데이터 서비스들
export { 
  RelatedContentDataService,
  SupabaseRelatedContentDataService,
  MockRelatedContentDataService 
} from './data-service.js';

// 설정
export { 
  RELATED_CONTENT_CONFIG,
  PORTFOLIO_RELATED_CONFIG,
  validateConfig,
  mergeConfig 
} from './config.js';

/**
 * 간편 초기화 함수
 * @param {HTMLElement} container - 컨테이너 엘리먼트
 * @param {Object} dataService - 데이터 서비스 인스턴스
 * @param {Object} config - 설정 객체 (선택사항)
 * @returns {RelatedContentComponent} 컴포넌트 인스턴스
 */
export async function createRelatedContent(container, dataService, config = null) {
  const { RelatedContentComponent } = await import('./component.js');
  const { RELATED_CONTENT_CONFIG, mergeConfig, validateConfig } = await import('./config.js');
  
  // 설정 병합 및 검증
  const finalConfig = config ? mergeConfig(RELATED_CONTENT_CONFIG, config) : RELATED_CONTENT_CONFIG;
  validateConfig(finalConfig);
  
  // 컴포넌트 생성 및 초기화
  const component = new RelatedContentComponent(container, {
    sections: finalConfig.sections,
    dataService: dataService,
    ...finalConfig.texts
  });
  
  await component.init();
  return component;
}

/**
 * CSS 로드 함수
 */
export function loadRelatedContentStyles() {
  const styleId = 'related-content-styles';
  
  // 이미 로드된 경우 스킵
  if (document.getElementById(styleId)) {
    return;
  }
  
  const link = document.createElement('link');
  link.id = styleId;
  link.rel = 'stylesheet';
  link.href = './components/related-content/design-system.css';
  
  document.head.appendChild(link);
}

/**
 * 자동 초기화 함수 (DOM 로드 후 자동 실행)
 */
export function autoInitRelatedContent(selector = '[data-related-content]', dataService, config = null) {
  document.addEventListener('DOMContentLoaded', async () => {
    const containers = document.querySelectorAll(selector);
    
    for (const container of containers) {
      try {
        await createRelatedContent(container, dataService, config);
      } catch (error) {
        console.error('Related Content 자동 초기화 실패:', error);
      }
    }
  });
}