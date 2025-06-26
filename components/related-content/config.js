/**
 * Related Content Component Configuration
 * 연관 콘텐츠 컴포넌트 설정
 */

export const RELATED_CONTENT_CONFIG = {
  sections: [
    {
      id: 'websites',
      title: '더 많은 학습 도구',
      icon: '🔧',
      category: 'website',
      limit: 6
    },
    {
      id: 'blogs',
      title: '바이브코딩 인사이트',
      icon: '📚',
      category: 'blog',
      limit: 6
    }
  ],
  
  // UI 텍스트
  texts: {
    loading: '로딩 중...',
    error: '콘텐츠를 불러오는데 실패했습니다.',
    empty: '표시할 콘텐츠가 없습니다.',
    comingSoon: '🚀 이 콘텐츠는 곧 출시될 예정입니다!'
  },

  // 상태 텍스트 매핑
  statusTexts: {
    published: '공개됨',
    'coming-soon': '출시 예정'
  },

  // 애니메이션 설정
  animation: {
    enabled: true,
    duration: 300,
    easing: 'ease'
  }
};

/**
 * 다른 프로젝트용 설정 예시
 */
export const PORTFOLIO_RELATED_CONFIG = {
  sections: [
    {
      id: 'projects',
      title: '관련 프로젝트',
      icon: '🚀',
      category: 'project',
      limit: 4
    },
    {
      id: 'articles',
      title: '관련 아티클',
      icon: '📝',
      category: 'article',
      limit: 4
    }
  ],
  
  texts: {
    loading: 'Loading...',
    error: 'Failed to load content.',
    empty: 'No content available.',
    comingSoon: '🚧 Coming Soon!'
  }
};

/**
 * 설정 검증 함수
 */
export function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('설정 객체가 필요합니다.');
  }

  if (!Array.isArray(config.sections) || config.sections.length === 0) {
    throw new Error('최소 하나의 섹션이 필요합니다.');
  }

  for (const section of config.sections) {
    if (!section.id || !section.title || !section.category) {
      throw new Error('섹션에는 id, title, category가 필요합니다.');
    }
  }

  return true;
}

/**
 * 설정 병합 함수
 */
export function mergeConfig(defaultConfig, userConfig) {
  return {
    ...defaultConfig,
    ...userConfig,
    sections: userConfig.sections || defaultConfig.sections,
    texts: {
      ...defaultConfig.texts,
      ...(userConfig.texts || {})
    },
    animation: {
      ...defaultConfig.animation,
      ...(userConfig.animation || {})
    }
  };
}