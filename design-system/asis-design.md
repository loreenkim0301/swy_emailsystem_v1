# 🎨 ASIS 디자인 시스템 문서

## 📋 개요
현재 EmailJS 학습 도구 프론트엔드에 적용된 디자인 시스템을 코드 기준으로 문서화합니다.

---

## 🎯 디자인 토큰 (CSS Variables)

### 색상 시스템
```css
:root {
    /* 그라데이션 팔레트 */
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --warning-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    --error-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    
    /* 텍스트 색상 */
    --text-primary: #333;
    --text-secondary: #666;
    --text-muted: #999;
    
    /* 배경 색상 */
    --background-main: #f8fafc;
    --background-card: #ffffff;
    --border-light: #e2e8f0;
    
    /* 그림자 */
    --shadow-soft: 0 15px 35px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
    
    /* 폰트 패밀리 */
    --font-main: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --font-code: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
}
```

---

## 🔤 타이포그래피 시스템

### 폰트 계층 구조
```css
/* 헤더 타이틀 */
.header h1 {
    font-size: 36px;
    font-weight: 700;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 헤더 서브타이틀 */
.header p {
    font-size: 18px;
    font-weight: 300;
    opacity: 0.9;
}

/* 섹션 제목 */
.step-card h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
}

/* 본문 텍스트 */
body {
    font-family: var(--font-main);
    font-size: 14px;
    line-height: 1.6;
}

/* 코드 블록 */
.code-block {
    font-family: var(--font-code);
    font-size: 13px;
    line-height: 1.5;
}

/* 인라인 코드 */
.code-inline {
    font-family: var(--font-code);
    font-size: 12px;
}
```

---

## 🏗️ 레이아웃 시스템

### 컨테이너
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
```

### 그리드 시스템
```css
/* 메인 단계 그리드 */
.steps-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 80px;
}

@media (min-width: 768px) {
    .steps-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* 연관 콘텐츠 섹션 그리드 */
.related-sections {
    display: grid;
    grid-template-columns: 1fr;
    gap: 60px;
}

@media (min-width: 1024px) {
    .related-sections {
        grid-template-columns: 1fr 1fr;
    }
}

/* 연관 콘텐츠 카드 그리드 */
.related-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

@media (min-width: 768px) {
    .related-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1200px) {
    .related-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

---

## 🎴 카드 컴포넌트 시스템

### 기본 카드 스타일
```css
.step-card {
    background: var(--background-card);
    border-radius: 20px;
    padding: 40px 30px;
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
    border: 1px solid var(--border-light);
    position: relative;
    overflow: hidden;
}

.step-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--primary-gradient);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.step-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-hover);
}

.step-card:hover::before {
    transform: scaleX(1);
}
```

### 연관 콘텐츠 카드
```css
.related-card {
    background: var(--background-card);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
    border: 1px solid var(--border-light);
    position: relative;
    cursor: pointer;
}

.related-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
}

.related-card h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
    line-height: 1.4;
}

.related-card p {
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 16px;
}
```

---

## 🏷️ 상태 배지 시스템

### 카드 상태 배지
```css
.card-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.card-status.published {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    color: #155724;
}

.card-status.coming-soon {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    color: #856404;
}
```

### 시스템 상태 메시지
```css
.status-message {
    padding: 16px 20px;
    border-radius: 12px;
    margin: 20px 0;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-success {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    color: #155724;
    border: 1px solid #c3e6cb;
}

.status-error {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.status-warning {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    color: #856404;
    border: 1px solid #ffeaa7;
}

.status-info {
    background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
    color: #0c5460;
    border: 1px solid #bee5eb;
}
```

---

## 🔘 버튼 시스템

### 기본 버튼 스타일
```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    font-family: var(--font-main);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    gap: 8px;
    min-height: 48px;
}

.btn-primary {
    background: var(--primary-gradient);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
    background: var(--secondary-gradient);
    color: white;
}

.btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}
```

---

## 📝 폼 시스템

### 폼 그룹
```css
.form-group {
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text-primary);
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid var(--border-light);
    border-radius: 12px;
    font-family: var(--font-main);
    font-size: 14px;
    transition: all 0.3s ease;
    background: var(--background-card);
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
    resize: vertical;
    min-height: 120px;
}

.form-group .help-text {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 6px;
}
```

---

## 🎨 헤더 시스템

### 메인 헤더
```css
.header {
    background: var(--primary-gradient);
    color: white;
    padding: 60px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
}

.header-content {
    position: relative;
    z-index: 1;
}
```

---

## 🦶 푸터 시스템

### 다크 테마 푸터
```css
.footer {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    color: white;
    padding: 60px 0 40px;
    margin-top: 100px;
}

.footer-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

@media (min-width: 768px) {
    .footer-content {
        grid-template-columns: 2fr 1fr 1fr;
    }
}

.footer-section h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: white;
}

.footer-section p,
.footer-section li {
    color: #a0aec0;
    line-height: 1.6;
    margin-bottom: 8px;
}

.footer-section a {
    color: #a0aec0;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-section a:hover {
    color: white;
}

.footer-bottom {
    border-top: 1px solid #4a5568;
    padding-top: 30px;
    text-align: center;
    color: #a0aec0;
    font-size: 13px;
}
```

---

## 🔗 링크 시스템

### 카드 링크
```css
.card-link {
    color: #667eea;
    font-size: 12px;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.3s ease;
}

.card-link:hover {
    color: #764ba2;
}

.card-link::after {
    content: '→';
    transition: transform 0.3s ease;
}

.card-link:hover::after {
    transform: translateX(2px);
}
```

---

## 🎭 애니메이션 시스템

### 로딩 애니메이션
```css
.loading {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.loading::after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

### 호버 트랜지션
```css
/* 모든 인터랙티브 요소에 공통 적용 */
.step-card,
.related-card,
.btn {
    transition: all 0.3s ease;
}

/* 카드 호버 효과 */
.step-card:hover,
.related-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
}

/* 버튼 호버 효과 */
.btn:hover {
    transform: translateY(-2px);
}
```

---

## 📱 반응형 브레이크포인트

### 미디어 쿼리 시스템
```css
/* 모바일 퍼스트 접근 */
/* 기본: 모바일 (< 768px) */

/* 태블릿 */
@media (min-width: 768px) {
    .steps-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .related-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .newsletter-form {
        flex-direction: row;
    }
    
    .footer-content {
        grid-template-columns: 2fr 1fr 1fr;
    }
}

/* 데스크톱 */
@media (min-width: 1024px) {
    .related-sections {
        grid-template-columns: 1fr 1fr;
    }
}

/* 대형 데스크톱 */
@media (min-width: 1200px) {
    .related-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* 모바일 전용 스타일 */
@media (max-width: 768px) {
    .header {
        padding: 40px 0;
    }
    
    .header h1 {
        font-size: 28px;
    }
    
    .header p {
        font-size: 16px;
    }
    
    .main {
        padding: 40px 0;
    }
    
    .step-card {
        padding: 30px 20px;
    }
    
    .newsletter-section {
        padding: 30px 20px;
        margin: 40px 0;
    }
    
    .newsletter-form {
        flex-direction: column;
    }
}
```

---

## 🎨 특수 컴포넌트

### 단계 번호 배지
```css
.step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: var(--primary-gradient);
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 24px;
}
```

### 뉴스레터 섹션
```css
.newsletter-section {
    background: var(--background-card);
    border-radius: 20px;
    padding: 40px;
    box-shadow: var(--shadow-soft);
    text-align: center;
    margin: 60px 0;
    border: 1px solid var(--border-light);
}

.newsletter-form {
    display: flex;
    gap: 12px;
    max-width: 400px;
    margin: 0 auto;
}

.newsletter-form input {
    flex: 1;
    margin-bottom: 0;
}
```

---

## ♿ 접근성 고려사항

### 포커스 스타일
```css
.btn:focus,
input:focus,
textarea:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}
```

### 모션 감소 설정
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### 인쇄 스타일
```css
@media print {
    .header,
    .footer,
    .newsletter-section {
        display: none;
    }
    
    .step-card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ccc;
    }
}
```

---

## 📊 디자인 시스템 통계

### 색상 사용량
- **그라데이션**: 5개 (Primary, Secondary, Success, Warning, Error)
- **텍스트 색상**: 3개 (Primary, Secondary, Muted)
- **배경 색상**: 3개 (Main, Card, Border)

### 폰트 크기 계층
- **36px**: 메인 헤더 (H1)
- **28px**: 모바일 헤더 (H1)
- **24px**: 뉴스레터 제목 (H2)
- **20px**: 섹션 제목 (H2)
- **18px**: 헤더 서브타이틀
- **16px**: 카드 제목 (H4)
- **14px**: 본문, 버튼
- **13px**: 카드 설명, 코드 블록
- **12px**: 링크, 도움말
- **11px**: 배지

### 간격 시스템
- **4px**: 작은 간격 (배지 내부)
- **8px**: 기본 간격 (라벨-입력 필드)
- **12px**: 중간 간격 (폼 요소)
- **16px**: 표준 간격 (카드 내부)
- **20px**: 큰 간격 (카드 그리드)
- **24px**: 섹션 간격
- **40px**: 대형 간격 (그리드, 패딩)
- **60px**: 특대 간격 (헤더, 푸터)
- **80px**: 최대 간격 (메인 섹션)

### 반응형 브레이크포인트
- **768px**: 태블릿 시작점
- **1024px**: 데스크톱 시작점  
- **1200px**: 대형 데스크톱 시작점

---

## 🎯 디자인 일관성 체크리스트

### ✅ 적용된 디자인 원칙
- [x] **일관된 색상 시스템** (CSS 변수 사용)
- [x] **타이포그래피 계층** (명확한 폰트 크기 구조)
- [x] **그리드 시스템** (반응형 레이아웃)
- [x] **카드 기반 UI** (일관된 카드 스타일)
- [x] **호버 인터랙션** (마이크로 애니메이션)
- [x] **상태 시스템** (배지, 메시지)
- [x] **접근성 고려** (포커스, 모션 감소)

### 🎨 디자인 특징
- **모던한 그라데이션** 사용
- **부드러운 그림자** 효과
- **둥근 모서리** (12px~20px)
- **적절한 여백** 시스템
- **한국어 최적화** 폰트
- **모바일 퍼스트** 반응형

---

이 문서는 현재 프론트엔드에 적용된 모든 디자인 요소를 코드 기준으로 정리한 ASIS 상태입니다.