# ContentCard Component

## 🎯 목적
재사용 가능한 콘텐츠 카드 UI 컴포넌트

## 🚀 사용법

### 기본 사용법
```javascript
import { ContentCard } from './components/ContentCard/ContentCard.js';

const cardData = {
    id: 1,
    title: 'EmailJS 학습 도구 소개',
    description: 'EmailJS를 쉽게 배울 수 있는 인터랙티브 학습 도구입니다.',
    status: 'published',
    url: 'https://example.com',
    keywords: ['emailjs', 'javascript', 'email']
};

const card = new ContentCard(cardData, {
    showTags: true,
    showDescription: true,
    showStatus: true,
    onClick: (data, event) => {
        console.log('카드 클릭됨:', data);
    }
});

// DOM에 추가
const cardElement = card.createElement();
document.querySelector('#card-container').appendChild(cardElement);
```

### 팩토리 함수 사용
```javascript
import { createContentCard } from './components/ContentCard/index.js';

const card = createContentCard(cardData, options);
const element = card.createElement();
```

## ⚙️ 설정 옵션

### 카드 데이터 (data)
```javascript
{
    id: number|string,           // 고유 ID
    title: string,               // 카드 제목
    description: string,         // 카드 설명
    status: string,              // 상태 ('published', 'coming-soon', 'draft', etc.)
    url: string,                 // 링크 URL (선택사항)
    keywords: string[]           // 태그 배열 (선택사항)
}
```

### 옵션 (options)
```javascript
{
    showTags: boolean,           // 태그 표시 여부 (기본: true)
    showDescription: boolean,    // 설명 표시 여부 (기본: true)
    showStatus: boolean,         // 상태 배지 표시 여부 (기본: true)
    onClick: function,           // 클릭 핸들러 (선택사항)
    className: string            // 커스텀 CSS 클래스 (기본: 'content-item')
}
```

## 🎨 상태별 스타일

### 지원하는 상태
- `published`: 공개됨 (초록색)
- `coming-soon`: 출시 예정 (노란색)
- `draft`: 준비 중 (빨간색)
- `preparing`: 준비 중 (파란색)
- `archived`: 보관됨 (회색)

## 📱 반응형 지원

- **데스크톱**: 24px 패딩, 16px 제목
- **모바일**: 20px 패딩, 15px 제목
- **태그**: 최대 3개까지 표시

## 🎭 인터랙션

### 호버 효과
- 카드 위로 이동 (-4px)
- 그림자 증가
- 링크 화살표 이동

### 클릭 동작
- URL이 있으면 새 탭에서 열기
- URL이 없으면 "출시 예정" 메시지
- 커스텀 onClick 핸들러 지원

## 🔧 커스터마이징

### CSS 변수
```css
:root {
    --background-card: #ffffff;
    --text-primary: #333;
    --text-secondary: #666;
    --text-muted: #999;
    --border-light: #e2e8f0;
    --shadow-soft: 0 15px 35px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 커스텀 클래스
```javascript
const card = new ContentCard(data, {
    className: 'my-custom-card'
});
```

## 📡 API

### 메서드
- `render()`: HTML 문자열 반환
- `createElement()`: DOM 요소 생성
- `updateData(newData)`: 데이터 업데이트
- `updateOptions(newOptions)`: 옵션 업데이트

### 이벤트
- `click`: 카드 클릭 시 발생

## ♿ 접근성

- 포커스 스타일 지원
- 키보드 네비게이션 가능
- 스크린 리더 친화적
- 모션 감소 설정 지원

## 🌙 다크 모드

자동으로 시스템 다크 모드를 감지하여 적절한 색상으로 변경됩니다.

## 📄 예제

### 기본 카드
```javascript
const basicCard = createContentCard({
    id: 1,
    title: '기본 카드',
    description: '기본 설정으로 만든 카드입니다.',
    status: 'published',
    url: 'https://example.com'
});
```

### 태그 없는 카드
```javascript
const simpleCard = createContentCard(data, {
    showTags: false,
    showStatus: false
});
```

### 커스텀 클릭 핸들러
```javascript
const interactiveCard = createContentCard(data, {
    onClick: (data, event) => {
        // 분석 이벤트 전송
        gtag('event', 'card_click', {
            card_id: data.id,
            card_title: data.title
        });
    }
});
```