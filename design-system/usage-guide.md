# 📖 디자인 시스템 사용 가이드

## 🎯 시작하기

### **1. 디자인 시스템 로드**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- 폰트 사전 로딩 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- 디자인 시스템 CSS -->
    <link rel="stylesheet" href="design-system/v2.1.5/styles.css">
    
    <!-- 폰트 로딩 -->
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
    <!-- 콘텐츠 -->
</body>
</html>
```

### **2. 기본 페이지 구조**
```html
<body>
    <!-- 헤더 -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1>페이지 제목</h1>
                <p>페이지 설명</p>
            </div>
        </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
        <div class="container">
            <!-- 콘텐츠 섹션들 -->
        </div>
    </main>

    <!-- 푸터 -->
    <footer class="footer">
        <div class="container">
            <!-- 푸터 내용 -->
        </div>
    </footer>
</body>
```

---

## 🧩 컴포넌트 사용법

### **Step Card 컴포넌트**
```html
<section class="step" data-step="step1">
    <h2>
        <span class="step-number">1</span>
        EmailJS 설정
    </h2>
    <p>EmailJS 계정 정보를 입력하여 서비스를 초기화합니다.</p>
    
    <div class="form-group">
        <label for="publicKey">Public Key:</label>
        <input type="text" id="publicKey" placeholder="EmailJS Public Key를 입력하세요">
    </div>
    
    <button class="step-button" onclick="initializeEmailJS()">설정 완료</button>
    <div id="step1-status"></div>
</section>
```

### **폼 컴포넌트**
```html
<!-- 기본 입력 필드 -->
<div class="form-group">
    <label for="email">이메일 주소</label>
    <input type="email" id="email" placeholder="example@email.com" required>
</div>

<!-- 텍스트 영역 -->
<div class="form-group">
    <label for="message">메시지</label>
    <textarea id="message" rows="4" placeholder="메시지를 입력하세요"></textarea>
</div>

<!-- 선택 박스 -->
<div class="form-group">
    <label for="category">카테고리</label>
    <select id="category">
        <option value="">선택하세요</option>
        <option value="general">일반</option>
        <option value="support">지원</option>
    </select>
</div>
```

### **버튼 컴포넌트**
```html
<!-- 기본 버튼 -->
<button class="step-button">기본 버튼</button>

<!-- 테스트 버튼 (녹색) -->
<button class="step-button test-button">연결 테스트</button>

<!-- 이메일 버튼 (주황색) -->
<button class="step-button email-button">이메일 발송</button>

<!-- 비활성화 버튼 -->
<button class="step-button" disabled>비활성화</button>

<!-- 로딩 상태 버튼 -->
<button class="step-button" disabled>
    <span class="loading-spinner"></span>
    처리 중...
</button>
```

### **상태 메시지**
```html
<!-- 성공 메시지 -->
<div class="status-message status-success">
    ✅ 이메일이 성공적으로 발송되었습니다!
</div>

<!-- 오류 메시지 -->
<div class="status-message status-error">
    ❌ 이메일 발송에 실패했습니다. 다시 시도해주세요.
</div>

<!-- 정보 메시지 -->
<div class="status-message status-info">
    ℹ️ 연결을 테스트하는 중입니다...
</div>

<!-- 경고 메시지 -->
<div class="status-message status-warning">
    ⚠️ 모든 필드를 입력해주세요.
</div>
```

### **관련 콘텐츠 그리드**
```html
<section class="related-content">
    <div class="container">
        <h2>🔧 더 많은 학습 도구</h2>
        <div class="content-grid">
            <a href="#" class="content-card">
                <h3>EmailJS 학습 도구</h3>
                <p>EmailJS를 단계별로 학습할 수 있는 도구입니다.</p>
                <span class="status-badge">출시됨</span>
            </a>
            
            <a href="#" class="content-card">
                <h3>OpenAI API 학습 도구</h3>
                <p>OpenAI API를 실습하며 배울 수 있습니다.</p>
                <span class="status-badge coming-soon">출시 예정</span>
            </a>
        </div>
    </div>
</section>
```

### **뉴스레터 구독**
```html
<section class="newsletter-section">
    <h2>📬 바이브코드제로 클럽 구독</h2>
    <p>AI 코딩의 최신 소식과 실무 팁을 받아보세요.</p>
    
    <form class="newsletter-form" id="newsletter-form">
        <input type="email" id="newsletter-email" placeholder="이메일 주소를 입력하세요" required>
        <button type="submit">구독하기</button>
    </form>
    
    <div id="newsletter-status" class="newsletter-status"></div>
</section>
```

### **다크 테마 푸터**
```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>바이브코드제로</h3>
                <p>AI와 함께하는 코딩의 새로운 패러다임을 제시합니다.</p>
            </div>
            
            <div class="footer-section">
                <h3>학습 도구</h3>
                <ul>
                    <li><a href="#step1">EmailJS 설정</a></li>
                    <li><a href="#step2">연결 테스트</a></li>
                    <li><a href="#step3">이메일 발송</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>연결하기</h3>
                <ul>
                    <li><a href="https://www.instagram.com/loreenkim.ceo/" target="_blank">Instagram</a></li>
                    <li><a href="https://brunch.co.kr/@loreenkim/" target="_blank">Brunch</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <div class="footer-social">
                <a href="https://www.instagram.com/loreenkim.ceo/" target="_blank">📷</a>
                <a href="https://brunch.co.kr/@loreenkim/" target="_blank">✍️</a>
                <a href="#newsletter">📧</a>
            </div>
            <p>&copy; 2024 바이브코드제로. All rights reserved.</p>
        </div>
    </div>
</footer>
```

---

## 🎨 커스터마이징

### **CSS 변수 오버라이드**
```css
/* 브랜드 컬러 변경 */
:root {
    --primary-gradient: linear-gradient(135deg, #your-color-1, #your-color-2);
    --primary-color: #your-primary-color;
    --text-primary: #your-text-color;
}

/* 간격 조정 */
:root {
    --spacing-custom: 2.5rem;
}

/* 폰트 변경 */
:root {
    --font-family-primary: 'Your Font', sans-serif;
}
```

### **새로운 버튼 스타일**
```css
.step-button.custom {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.step-button.outline {
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
}

.step-button.outline:hover {
    background: var(--primary-color);
    color: white;
}
```

### **새로운 상태 메시지 타입**
```css
.status-message.status-custom {
    background-color: #e8f5e8;
    color: #2d5a2d;
    border-color: #4caf50;
}
```

---

## 📱 반응형 사용법

### **반응형 유틸리티**
```css
/* 모바일에서만 숨기기 */
@media (max-width: 767px) {
    .hide-mobile {
        display: none;
    }
}

/* 데스크톱에서만 표시 */
@media (min-width: 1024px) {
    .show-desktop {
        display: block;
    }
}
```

### **반응형 그리드 커스터마이징**
```css
/* 커스텀 그리드 */
.custom-grid {
    display: grid;
    gap: var(--spacing-6);
    grid-template-columns: 1fr; /* 모바일 */
}

@media (min-width: 768px) {
    .custom-grid {
        grid-template-columns: repeat(2, 1fr); /* 태블릿 */
    }
}

@media (min-width: 1024px) {
    .custom-grid {
        grid-template-columns: repeat(3, 1fr); /* 데스크톱 */
    }
}
```

---

## 🔧 JavaScript 통합

### **상태 메시지 동적 생성**
```javascript
function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
}

// 사용 예시
showStatus('step1-status', '✅ 설정이 완료되었습니다!', 'success');
showStatus('step2-status', '❌ 연결에 실패했습니다.', 'error');
showStatus('step3-status', 'ℹ️ 처리 중입니다...', 'info');
```

### **버튼 상태 관리**
```javascript
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span> 처리 중...';
    } else {
        button.disabled = false;
        button.innerHTML = '완료';
    }
}

// 사용 예시
const button = document.querySelector('.step-button');
setButtonLoading(button, true);

// 작업 완료 후
setTimeout(() => {
    setButtonLoading(button, false);
}, 2000);
```

### **폼 유효성 검사**
```javascript
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#f56565';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });
    
    return isValid;
}

// 사용 예시
document.getElementById('myForm').addEventListener('submit', (e) => {
    if (!validateForm(e.target)) {
        e.preventDefault();
        showStatus('form-status', '❌ 모든 필수 필드를 입력해주세요.', 'error');
    }
});
```

---

## 🎯 접근성 가이드

### **키보드 네비게이션**
```javascript
// 키보드 네비게이션 지원
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('step-button')) {
        e.target.click();
    }
});
```

### **스크린 리더 지원**
```html
<!-- ARIA 라벨 추가 -->
<button class="step-button" aria-label="EmailJS 설정 완료">
    설정 완료
</button>

<!-- 상태 메시지에 role 추가 -->
<div class="status-message status-success" role="alert">
    ✅ 성공적으로 완료되었습니다!
</div>

<!-- 폼 그룹에 설명 추가 -->
<div class="form-group">
    <label for="email">이메일 주소</label>
    <input type="email" id="email" aria-describedby="email-help">
    <small id="email-help">유효한 이메일 주소를 입력해주세요.</small>
</div>
```

### **색상 대비 확인**
```css
/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
    :root {
        --text-secondary: #000000;
        --border-light: #000000;
    }
    
    .step {
        border: 2px solid #000000;
    }
}
```

---

## 🚀 성능 최적화

### **CSS 최적화**
```css
/* GPU 가속 활용 */
.step:hover {
    will-change: transform;
    transform: translateZ(0) translateY(-2px);
}

/* 애니메이션 완료 후 will-change 제거 */
.step:not(:hover) {
    will-change: auto;
}
```

### **이미지 최적화**
```html
<!-- 반응형 이미지 -->
<img src="image-small.jpg" 
     srcset="image-small.jpg 480w, image-medium.jpg 768w, image-large.jpg 1024w"
     sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
     alt="설명">

<!-- 지연 로딩 -->
<img src="image.jpg" loading="lazy" alt="설명">
```

### **폰트 최적화**
```html
<!-- 폰트 사전 로딩 -->
<link rel="preload" href="fonts/Pretendard-Regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- 폰트 디스플레이 최적화 -->
<style>
@font-face {
    font-family: 'Pretendard';
    src: url('fonts/Pretendard-Regular.woff2') format('woff2');
    font-display: swap;
}
</style>
```

---

## 🔍 디버깅 도구

### **디자인 시스템 상태 확인**
```javascript
// 현재 로드된 디자인 시스템 버전 확인
function checkDesignSystem() {
    const styleSheets = Array.from(document.styleSheets);
    const designSystemSheet = styleSheets.find(sheet => 
        sheet.href && sheet.href.includes('design-system')
    );
    
    if (designSystemSheet) {
        console.log('디자인 시스템 로드됨:', designSystemSheet.href);
    } else {
        console.error('디자인 시스템이 로드되지 않았습니다.');
    }
}

// CSS 변수 값 확인
function checkCSSVariables() {
    const root = getComputedStyle(document.documentElement);
    const variables = [
        '--primary-gradient',
        '--text-primary',
        '--spacing-lg',
        '--border-radius-md'
    ];
    
    variables.forEach(variable => {
        console.log(`${variable}: ${root.getPropertyValue(variable)}`);
    });
}
```

### **컴포넌트 상태 확인**
```javascript
// 컴포넌트 스타일 확인
function inspectComponent(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.error(`컴포넌트를 찾을 수 없습니다: ${selector}`);
        return;
    }
    
    const styles = getComputedStyle(element);
    console.log(`${selector} 스타일:`, {
        background: styles.background,
        padding: styles.padding,
        margin: styles.margin,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow
    });
}

// 사용 예시
inspectComponent('.step');
inspectComponent('.step-button');
```

---

**📖 이 가이드를 통해 EmailJS 학습 도구의 디자인 시스템을 효과적으로 활용하세요!**