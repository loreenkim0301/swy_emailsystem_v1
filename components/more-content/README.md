# More Content Component

## 🎯 목적
연관된 콘텐츠를 그리드 형태로 표시하는 재사용 가능한 컴포넌트입니다.

## 🚀 사용법

### 기본 사용법
```javascript
import { MoreContentComponent } from './components/more-content/MoreContentComponent.js';
import { SupabaseDataService } from './components/more-content/DataService.js';

// Supabase 클라이언트가 있는 경우
const dataService = new SupabaseDataService(supabaseClient);

const moreContent = new MoreContentComponent(
    document.querySelector('#more-content'),
    {
        dataService: dataService
    }
);

await moreContent.init();
```

### 목업 데이터로 테스트
```javascript
import { MockDataService } from './components/more-content/DataService.js';

const moreContent = new MoreContentComponent(
    document.querySelector('#more-content'),
    {
        dataService: new MockDataService()
    }
);

await moreContent.init();
```

### 커스텀 설정
```javascript
const moreContent = new MoreContentComponent(
    document.querySelector('#more-content'),
    {
        title: '🚀 관련 프로젝트',
        subtitle: '더 많은 프로젝트를 확인해보세요',
        sections: [
            {
                id: 'projects',
                title: '💻 개발 프로젝트',
                category: 'project',
                limit: 4
            },
            {
                id: 'tutorials',
                title: '📚 튜토리얼',
                category: 'tutorial',
                limit: 6
            }
        ],
        dataService: new CustomDataService()
    }
);
```

## ⚙️ 설정 옵션

### 기본 옵션
- `title`: 메인 제목 (기본값: '🚀 더 많은 콘텐츠 나아가기')
- `subtitle`: 서브 제목 (기본값: '더 많은 학습 도구와 바이브코딩 인사이트를 확인해보세요')
- `dataService`: 데이터 서비스 인스턴스 (필수)

### sections 배열 옵션
각 섹션은 다음 속성을 가집니다:
- `id`: 섹션 고유 ID
- `title`: 섹션 제목
- `category`: 데이터 카테고리
- `limit`: 표시할 항목 수

## 🔌 데이터 서비스 인터페이스

다른 프로젝트에서 사용하려면 `DataServiceInterface`를 구현해야 합니다:

```javascript
import { DataServiceInterface } from './components/more-content/DataService.js';

export class CustomDataService extends DataServiceInterface {
    async getContentByCategory(category, options = {}) {
        // 여기에 실제 데이터 조회 로직 구현
        return {
            success: true,
            blogs: [], // 데이터 배열
            count: 0
        };
    }
}
```

### 반환 데이터 형식
```javascript
{
    success: boolean,
    blogs: [
        {
            id: number,
            title: string,
            description: string,
            status: 'published' | 'coming-soon' | 'draft',
            url: string | null
        }
    ],
    count: number,
    error?: string
}
```

## 🎨 스타일 커스터마이징

CSS 파일을 수정하거나 CSS 변수를 오버라이드하여 스타일을 커스터마이징할 수 있습니다:

```css
.more-content {
    --primary-color: #your-color;
    --card-background: #your-background;
    --border-radius: 12px;
}
```

## 📡 API

### 메서드
- `init()`: 컴포넌트 초기화
- `refresh()`: 데이터 다시 로드
- `updateConfig(newConfig)`: 설정 업데이트
- `destroy()`: 컴포넌트 정리

### 상태
- `state.loading`: 로딩 상태
- `state.error`: 에러 메시지
- `state.data`: 로드된 데이터

## 🔧 다른 프로젝트에서 사용하기

1. **컴포넌트 파일 복사**
   ```
   components/more-content/
   ├── MoreContentComponent.js
   ├── DataService.js
   ├── more-content.css
   └── README.md
   ```

2. **데이터 서비스 구현**
   ```javascript
   // 예: WordPress REST API 사용
   export class WordPressDataService extends DataServiceInterface {
       async getContentByCategory(category, options = {}) {
           const response = await fetch(`/wp-json/wp/v2/posts?categories=${category}`);
           const posts = await response.json();
           
           return {
               success: true,
               blogs: posts.map(post => ({
                   id: post.id,
                   title: post.title.rendered,
                   description: post.excerpt.rendered,
                   status: 'published',
                   url: post.link
               })),
               count: posts.length
           };
       }
   }
   ```

3. **HTML에 컨테이너 추가**
   ```html
   <div id="more-content"></div>
   ```

4. **CSS 파일 로드**
   ```html
   <link rel="stylesheet" href="components/more-content/more-content.css">
   ```

5. **JavaScript로 초기화**
   ```javascript
   import { MoreContentComponent } from './components/more-content/MoreContentComponent.js';
   import { WordPressDataService } from './WordPressDataService.js';

   const moreContent = new MoreContentComponent(
       document.querySelector('#more-content'),
       {
           dataService: new WordPressDataService()
       }
   );

   await moreContent.init();
   ```

## 🧪 테스트

목업 데이터 서비스를 사용하여 컴포넌트를 테스트할 수 있습니다:

```javascript
import { MockDataService } from './components/more-content/DataService.js';

// 테스트용 인스턴스 생성
const testComponent = new MoreContentComponent(
    document.querySelector('#test-container'),
    {
        dataService: new MockDataService()
    }
);

await testComponent.init();
```

## 📱 반응형 지원

- **모바일** (< 768px): 1열 배치
- **태블릿** (768px - 1200px): 2열 배치  
- **데스크톱** (> 1200px): 3열 배치

## 🔒 보안 고려사항

- 데이터 서비스에서 적절한 입력 검증 수행
- XSS 방지를 위한 HTML 이스케이프 처리
- CORS 정책 확인