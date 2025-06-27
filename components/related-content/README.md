# 🔗 Related Content Component

재사용 가능한 연관 콘텐츠 컴포넌트입니다. 다른 Bolt 프로젝트에서 쉽게 재사용할 수 있도록 설계되었습니다.

## 🎯 특징

### ✨ **완전한 재사용성**
- 설정 파일만 변경하면 다른 프로젝트에서 즉시 사용 가능
- 컴포넌트 기반 아키텍처
- 의존성 주입 패턴 적용 (데이터 서비스)

### 🎨 **모던한 디자인**
- 반응형 카드 그리드 시스템
- 호버 애니메이션 및 마이크로 인터랙션
- 상태 배지 시스템 (공개됨, 출시 예정 등)

### 🔧 **유연한 구성**
- 다중 섹션 지원
- 카테고리별 필터링
- 정렬 옵션 (ID, 날짜, 제목, 조회수)
- 커스텀 데이터 서비스 지원

## 🚀 사용법

### 1. 기본 사용법

```javascript
import { RelatedContentComponent } from './components/related-content/related-content-component.js';
import { RELATED_CONTENT_CONFIG } from './components/related-content/related-content-config.js';
import { SupabaseDataService } from './components/related-content/data-service-interface.js';

// 데이터 서비스 초기화
const dataService = new SupabaseDataService(supabaseClient);

// 연관 콘텐츠 컴포넌트 초기화
const relatedContent = new RelatedContentComponent(
    document.querySelector('.related-content'),
    {
        config: RELATED_CONTENT_CONFIG,
        dataService: dataService,
        onCardClick: (cardData, event) => {
            console.log('Card clicked:', cardData);
            // 커스텀 클릭 처리
        }
    }
);

// 컴포넌트 렌더링
await relatedContent.init();
```

### 2. HTML 구조

```html
<!-- CSS 파일 로드 -->
<link rel="stylesheet" href="./components/related-content/related-content.css">

<!-- 연관 콘텐츠 섹션 -->
<section class="related-content"></section>
```

### 3. 다른 프로젝트에서 사용

```javascript
// 포트폴리오 프로젝트용 설정
import { PORTFOLIO_RELATED_CONFIG } from './components/related-content/related-content-config.js';

const portfolioRelated = new RelatedContentComponent(
    document.querySelector('.portfolio-related'),
    {
        config: PORTFOLIO_RELATED_CONFIG,
        dataService: new MockDataService(), // 다른 데이터 서비스
        onCardClick: (cardData) => {
            // 포트폴리오 전용 클릭 처리
            showProjectModal(cardData.id);
        }
    }
);
```

## ⚙️ 설정 옵션

### 기본 설정 구조

```javascript
{
    title: "연관 콘텐츠 제목",
    sections: [
        {
            id: "unique-section-id",
            title: "섹션 제목",
            category: "데이터 카테고리",
            limit: 6,
            showComingSoon: true,
            sortBy: "created_at", // id, created_at, title, view_count
            sortOrder: "desc" // asc, desc
        }
    ],
    statusText: {
        'published': '공개됨',
        'coming-soon': '출시 예정'
    },
    linkText: {
        available: '자세히 보기',
        unavailable: '출시 예정'
    },
    messages: {
        loading: '로딩 중...',
        error: '오류 발생',
        empty: '콘텐츠 없음'
    }
}
```

### 섹션 설정 옵션

- `id`: 섹션 고유 식별자
- `title`: 섹션 제목
- `category`: 데이터 카테고리 (website, blog, project 등)
- `limit`: 표시할 최대 항목 수
- `showComingSoon`: 출시 예정 항목 포함 여부
- `sortBy`: 정렬 기준 필드
- `sortOrder`: 정렬 순서 (asc/desc)

## 🔌 데이터 서비스

### 인터페이스 구현

```javascript
import { DataServiceInterface } from './components/related-content/data-service-interface.js';

class CustomDataService extends DataServiceInterface {
    async getContentByCategory(category, options) {
        // 커스텀 데이터 로딩 로직
        return {
            success: true,
            data: [...],
            count: 10
        };
    }
    
    async getContentById(id) {
        // ID로 단일 콘텐츠 조회
    }
    
    async searchContent(query, options) {
        // 검색 기능
    }
}
```

### 제공되는 데이터 서비스

#### 1. SupabaseDataService
```javascript
import { SupabaseDataService } from './components/related-content/data-service-interface.js';

const dataService = new SupabaseDataService(supabaseClient);
```

#### 2. MockDataService (테스트용)
```javascript
import { MockDataService } from './components/related-content/data-service-interface.js';

const dataService = new MockDataService();
```

## 🎨 커스터마이징

### CSS 변수 수정

```css
:root {
    --text-primary: #333;
    --text-secondary: #666;
    --background-card: #ffffff;
    --border-light: #e2e8f0;
    --shadow-soft: 0 15px 35px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
    --font-main: 'Pretendard', sans-serif;
}
```

### 상태 배지 스타일 추가

```css
.related-content__card-status--custom {
    background: linear-gradient(135deg, #your-color1, #your-color2);
    color: #your-text-color;
}
```

### 카드 레이아웃 변경

```css
/* 2열 그리드로 변경 */
@media (min-width: 768px) {
    .related-content__grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

## 📱 반응형 지원

- **모바일** (768px 미만): 1열 세로 배치
- **태블릿** (768px-1024px): 섹션별 1열
- **데스크톱** (1024px 이상): 2개 섹션 나란히 배치

## 🔧 API

### 메서드

- `init()`: 컴포넌트 초기화 및 데이터 로드
- `refresh()`: 데이터 다시 로드 및 렌더링
- `updateConfig(newConfig)`: 설정 업데이트
- `getState()`: 현재 상태 반환
- `destroy()`: 컴포넌트 정리

### 이벤트

- `onCardClick(cardData, event)`: 카드 클릭 시 호출
- `onAnalytics(eventName, data)`: 분석 이벤트 발생 시 호출

### 카드 데이터 구조

```javascript
{
    id: "콘텐츠 ID",
    title: "제목",
    description: "설명",
    status: "published", // published, coming-soon, preparing
    category: "카테고리",
    url: "링크 URL",
    created_at: "생성일시",
    view_count: 조회수
}
```

## 🔒 보안 및 접근성

### 보안
- HTML 이스케이프 처리
- XSS 방지
- 안전한 외부 링크 처리

### 접근성
- 키보드 네비게이션 지원
- ARIA 레이블 적용
- 스크린 리더 호환
- 고대비 모드 지원

## 🧪 테스트

```javascript
// 테스트 예시
describe('RelatedContentComponent', () => {
    test('설정에 따라 올바른 섹션 수 렌더링', async () => {
        const component = new RelatedContentComponent(element, {
            config: testConfig,
            dataService: new MockDataService()
        });
        
        await component.init();
        
        const sections = element.querySelectorAll('.related-content__section');
        expect(sections.length).toBe(testConfig.sections.length);
    });
    
    test('카드 클릭 이벤트 처리', () => {
        const onCardClick = jest.fn();
        const component = new RelatedContentComponent(element, {
            config: testConfig,
            dataService: new MockDataService(),
            onCardClick
        });
        
        // 카드 클릭 시뮬레이션
        const card = element.querySelector('.related-content__card');
        card.click();
        
        expect(onCardClick).toHaveBeenCalled();
    });
});
```

## 📦 파일 구조

```
components/related-content/
├── related-content.css              # 스타일시트
├── related-content-component.js     # 메인 컴포넌트 클래스
├── related-content-config.js        # 설정 파일
├── data-service-interface.js        # 데이터 서비스 인터페이스
└── README.md                        # 문서
```

## 🔄 마이그레이션 가이드

### 기존 연관 콘텐츠에서 컴포넌트로 변경

1. **CSS 분리**: 기존 스타일을 `related-content.css`로 이동
2. **설정 추출**: 하드코딩된 내용을 설정 파일로 분리
3. **데이터 로직 분리**: 데이터 서비스 인터페이스 구현
4. **컴포넌트 적용**: `RelatedContentComponent` 클래스 사용

### 다른 프로젝트로 복사

1. `components/related-content/` 폴더 전체 복사
2. 프로젝트에 맞는 설정 파일 작성
3. 데이터 서비스 구현 또는 기존 서비스 연결
4. CSS 변수로 디자인 커스터마이징

## 💡 사용 예시

### 블로그 사이트
```javascript
const BLOG_CONFIG = {
    title: "추천 글",
    sections: [
        {
            id: "popular",
            title: "인기 글",
            category: "blog",
            limit: 4,
            sortBy: "view_count",
            sortOrder: "desc"
        }
    ]
};
```

### 포트폴리오 사이트
```javascript
const PORTFOLIO_CONFIG = {
    title: "관련 프로젝트",
    sections: [
        {
            id: "projects",
            title: "최신 프로젝트",
            category: "project",
            limit: 6,
            sortBy: "created_at",
            sortOrder: "desc"
        }
    ]
};
```

### 학습 플랫폼
```javascript
const LEARNING_CONFIG = {
    title: "추천 학습 자료",
    sections: [
        {
            id: "courses",
            title: "강의",
            category: "course",
            limit: 3
        },
        {
            id: "tutorials", 
            title: "튜토리얼",
            category: "tutorial",
            limit: 3
        }
    ]
};
```

---

**🎯 이제 어떤 Bolt 프로젝트에서도 이 연관 콘텐츠 컴포넌트를 재사용할 수 있습니다!**