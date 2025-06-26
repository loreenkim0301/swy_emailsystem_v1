# Related Content Component

연관 콘텐츠를 표시하는 재사용 가능한 컴포넌트입니다.

## 🎯 특징

- **재사용 가능**: 다양한 프로젝트에서 사용 가능
- **설정 기반**: JSON 설정으로 쉽게 커스터마이징
- **접근성**: WCAG 가이드라인 준수
- **반응형**: 모바일부터 데스크톱까지 지원
- **타입 안전**: JSDoc으로 타입 정보 제공

## 🚀 빠른 시작

### 1. 기본 사용법

```javascript
import { createRelatedContent, SupabaseRelatedContentDataService } from './components/related-content/index.js';

// 데이터 서비스 생성
const dataService = new SupabaseRelatedContentDataService(supabaseClient);

// 컴포넌트 생성
const component = await createRelatedContent(
  document.querySelector('#related-content'),
  dataService
);
```

### 2. 커스텀 설정 사용

```javascript
const customConfig = {
  sections: [
    {
      id: 'tutorials',
      title: '튜토리얼',
      icon: '📖',
      category: 'tutorial',
      limit: 4
    }
  ],
  texts: {
    loading: '불러오는 중...',
    comingSoon: '곧 공개됩니다!'
  }
};

const component = await createRelatedContent(
  document.querySelector('#related-content'),
  dataService,
  customConfig
);
```

## 📋 API 문서

### RelatedContentComponent

#### 생성자
```javascript
new RelatedContentComponent(container, options)
```

**매개변수:**
- `container` (HTMLElement): 컨테이너 엘리먼트
- `options` (Object): 설정 옵션

#### 메서드

##### `async init()`
컴포넌트를 초기화합니다.

##### `async loadData()`
데이터를 다시 로드합니다.

##### `render()`
컴포넌트를 다시 렌더링합니다.

##### `async refresh()`
데이터를 새로고침하고 다시 렌더링합니다.

##### `destroy()`
컴포넌트를 정리합니다.

### 데이터 서비스

#### RelatedContentDataService (인터페이스)
```javascript
class RelatedContentDataService {
  async getContentByCategory(category, options) {}
  async incrementViewCount(itemId) {}
}
```

#### SupabaseRelatedContentDataService
Supabase를 사용하는 데이터 서비스 구현체입니다.

#### MockRelatedContentDataService
테스트용 목업 데이터 서비스입니다.

## ⚙️ 설정 옵션

### 섹션 설정
```javascript
{
  sections: [
    {
      id: 'unique-id',        // 고유 ID
      title: '섹션 제목',      // 표시될 제목
      icon: '🔧',            // 아이콘 (선택사항)
      category: 'website',   // 데이터 카테고리
      limit: 6               // 표시할 항목 수
    }
  ]
}
```

### 텍스트 설정
```javascript
{
  texts: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다.',
    empty: '콘텐츠가 없습니다.',
    comingSoon: '곧 출시됩니다!'
  }
}
```

## 🎨 스타일 커스터마이징

### CSS 변수 오버라이드
```css
:root {
  --rc-card-bg: #ffffff;
  --rc-card-radius: 16px;
  --rc-card-padding: 24px;
  --rc-grid-gap: 20px;
  --rc-transition-duration: 0.3s;
}
```

### 커스텀 클래스 추가
```css
.my-custom-related-content .related-content__card {
  border: 2px solid #007bff;
}
```

## 📱 반응형 브레이크포인트

- **모바일**: < 768px (1열)
- **태블릿**: 768px - 1200px (2열)
- **데스크톱**: > 1200px (3열)

## 🔒 비즈니스 로직

### 상태 결정 규칙
1. `status === 'published' && url 존재` → "공개됨" (초록 배지 + 링크)
2. 그 외 모든 경우 → "출시 예정" (노랑 배지 + 링크 없음)

### 클릭 동작
1. 콘솔에 클릭 정보 로그
2. 조회수 증가 (비동기)
3. 링크가 있으면 새 탭에서 열기
4. 링크가 없으면 "출시 예정" 메시지 표시

## 🧪 테스트

### 단위 테스트 예시
```javascript
import { RelatedContentComponent, MockRelatedContentDataService } from './components/related-content/index.js';

describe('RelatedContentComponent', () => {
  test('컴포넌트가 올바르게 렌더링됨', async () => {
    const container = document.createElement('div');
    const dataService = new MockRelatedContentDataService();
    
    const component = new RelatedContentComponent(container, {
      sections: [{ id: 'test', category: 'website', title: 'Test', limit: 2 }],
      dataService
    });
    
    await component.init();
    
    expect(container.querySelector('.related-content')).toBeTruthy();
  });
});
```

## 🔧 문제 해결

### 일반적인 문제들

1. **스타일이 적용되지 않음**
   ```javascript
   import { loadRelatedContentStyles } from './components/related-content/index.js';
   loadRelatedContentStyles();
   ```

2. **데이터가 로드되지 않음**
   - 데이터 서비스가 올바르게 구현되었는지 확인
   - 네트워크 연결 상태 확인
   - 브라우저 콘솔에서 오류 메시지 확인

3. **클릭 이벤트가 작동하지 않음**
   - `bindEvents()` 메서드가 호출되었는지 확인
   - 이벤트 위임이 올바르게 설정되었는지 확인

## 📄 라이선스

MIT License

## 🤝 기여하기

1. 이슈 생성
2. 기능 브랜치 생성
3. 변경사항 커밋
4. 풀 리퀘스트 생성

---

**Made with ❤️ for reusable components**