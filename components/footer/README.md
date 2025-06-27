# 🦶 Footer Component

재사용 가능한 푸터 컴포넌트입니다. 다른 Bolt 프로젝트에서 쉽게 재사용할 수 있도록 설계되었습니다.

## 🎯 특징

### ✨ **완전한 재사용성**
- 설정 파일만 변경하면 다른 프로젝트에서 즉시 사용 가능
- 컴포넌트 기반 아키텍처
- 의존성 주입 패턴 적용

### 🎨 **모던한 디자인**
- 다크 테마 기반 전문적인 디자인
- Pretendard 폰트 적용 (한국어 최적화)
- 완전한 반응형 지원

### 🔧 **유연한 구성**
- 4가지 섹션 타입 지원 (list, tech, contact, subscription)
- 설정 기반 렌더링
- 커스텀 구독 핸들러 지원

## 🚀 사용법

### 1. 기본 사용법

```javascript
import { FooterComponent } from './components/footer/footer-component.js';
import { FOOTER_CONFIG } from './components/footer/footer-config.js';
import { subscribeToNewsletter } from './js/supabase-client.js';

// 푸터 컴포넌트 초기화
const footer = new FooterComponent(
    document.querySelector('.footer'),
    {
        config: FOOTER_CONFIG,
        subscriptionHandler: subscribeToNewsletter
    }
);

// 컴포넌트 렌더링
footer.init();
```

### 2. HTML 구조

```html
<!-- CSS 파일 로드 -->
<link rel="stylesheet" href="./components/footer/footer.css">

<!-- 푸터 요소 -->
<footer class="footer"></footer>
```

### 3. 다른 프로젝트에서 사용

```javascript
// 포트폴리오 프로젝트용 설정
const PORTFOLIO_CONFIG = {
    title: "포트폴리오",
    copyright: "© 2025 포트폴리오. All rights reserved.",
    sections: [
        {
            id: "about",
            type: "list",
            title: "🎯 About Me",
            items: [
                "Frontend Developer",
                "UI/UX Designer",
                "Creative Problem Solver"
            ]
        }
    ]
};

// 포트폴리오용 푸터 생성
const portfolioFooter = new FooterComponent(
    document.querySelector('.footer'),
    {
        config: PORTFOLIO_CONFIG,
        subscriptionHandler: myCustomSubscriptionHandler
    }
);

portfolioFooter.init();
```

## ⚙️ 설정 옵션

### 기본 설정

```javascript
{
    title: "웹사이트 제목",
    copyright: "© 2025 저작권 정보",
    sections: [] // 섹션 배열
}
```

### 섹션 타입

#### 1. List 섹션
```javascript
{
    id: "unique-id",
    type: "list",
    title: "섹션 제목",
    items: [
        "항목 1",
        "항목 2",
        "항목 3"
    ]
}
```

#### 2. Tech 섹션
```javascript
{
    id: "tech",
    type: "tech", 
    title: "기술 스택",
    description: "사용된 기술들",
    items: [
        { icon: "🌐", name: "HTML5" },
        { icon: "⚡", name: "JavaScript" }
    ]
}
```

#### 3. Contact 섹션
```javascript
{
    id: "contact",
    type: "contact",
    title: "연락처",
    author: "제작자 이름",
    tagline: "한줄 소개",
    contacts: [
        {
            type: "email",
            label: "이메일",
            value: "email@example.com"
        },
        {
            type: "link", 
            label: "웹사이트",
            value: "example.com",
            url: "https://example.com"
        }
    ]
}
```

#### 4. Subscription 섹션
```javascript
{
    id: "subscription",
    type: "subscription",
    title: "구독하기",
    description: "뉴스레터 설명",
    subscription: {
        title: "구독 제목",
        benefits: [
            "혜택 1",
            "혜택 2"
        ],
        placeholder: "이메일 입력",
        button: "구독하기"
    }
}
```

## 🎨 커스터마이징

### CSS 변수 수정

```css
:root {
    --footer-bg: #1a1a1a;
    --footer-text: #ffffff;
    --footer-text-secondary: #cccccc;
    --footer-border: #333333;
}
```

### 새로운 섹션 타입 추가

```javascript
// footer-component.js에서 새 렌더링 함수 추가
renderCustomSection(section) {
    return `
        <div class="footer-section">
            <h3>${section.title}</h3>
            <!-- 커스텀 내용 -->
        </div>
    `;
}

// renderSections()에서 케이스 추가
case 'custom':
    return this.renderCustomSection(section);
```

## 📱 반응형 지원

- **데스크톱** (1024px+): 4열 그리드
- **태블릿** (768px-1024px): 2열 그리드  
- **모바일** (768px 미만): 1열 세로 배치

## 🔌 API

### 메서드

- `init()`: 컴포넌트 초기화 및 렌더링
- `render()`: 푸터 다시 렌더링
- `updateConfig(newConfig)`: 설정 업데이트
- `destroy()`: 컴포넌트 정리

### 이벤트

- 구독 버튼 클릭
- 이메일 입력 필드 엔터키
- 링크 클릭 (자동 처리)

## 🔒 보안

- 이메일 형식 검증
- XSS 방지를 위한 안전한 HTML 렌더링
- 외부 링크 `target="_blank"` 적용

## 🧪 테스트

```javascript
// 테스트 예시
describe('FooterComponent', () => {
    test('올바른 섹션 수 렌더링', () => {
        const footer = new FooterComponent(element, { config: testConfig });
        footer.init();
        
        const sections = element.querySelectorAll('.footer-section');
        expect(sections.length).toBe(testConfig.sections.length);
    });
});
```

## 📦 파일 구조

```
components/footer/
├── footer.css              # 스타일시트
├── footer-component.js     # 메인 컴포넌트 클래스
├── footer-config.js        # 설정 파일
└── README.md              # 문서
```

## 🔄 마이그레이션 가이드

### 기존 푸터에서 컴포넌트로 변경

1. **CSS 분리**: 기존 푸터 CSS를 `footer.css`로 이동
2. **설정 추출**: 하드코딩된 내용을 `footer-config.js`로 분리
3. **컴포넌트 적용**: `FooterComponent` 클래스 사용
4. **이벤트 핸들러 연결**: 구독 기능 등 외부 함수 연결

### 다른 프로젝트로 복사

1. `components/footer/` 폴더 전체 복사
2. `footer-config.js`에서 프로젝트에 맞는 설정 작성
3. 구독 핸들러 함수 연결
4. CSS 변수로 디자인 커스터마이징

---

**🎯 이제 어떤 Bolt 프로젝트에서도 이 푸터 컴포넌트를 재사용할 수 있습니다!**