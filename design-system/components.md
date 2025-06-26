# 🧩 디자인 시스템 컴포넌트 라이브러리

## 📋 목차
1. [컴포넌트 개요](#컴포넌트-개요)
2. [기본 컴포넌트](#기본-컴포넌트)
3. [레이아웃 컴포넌트](#레이아웃-컴포넌트)
4. [인터랙티브 컴포넌트](#인터랙티브-컴포넌트)
5. [사용 가이드](#사용-가이드)

---

## 🎯 컴포넌트 개요

### **디자인 원칙**
- **일관성**: 모든 컴포넌트는 동일한 디자인 토큰 사용
- **재사용성**: 다양한 상황에서 활용 가능한 유연한 구조
- **접근성**: WCAG 2.1 AA 수준 준수
- **성능**: 최적화된 CSS와 애니메이션

### **컴포넌트 상태**
- ✅ **Stable**: 프로덕션에서 안전하게 사용 가능
- 🚧 **Beta**: 테스트 중, 변경 가능성 있음
- 📋 **Planned**: 개발 예정

---

## 🏗️ 기본 컴포넌트

### **1. Header Component** ✅
```html
<header class="header">
    <div class="container">
        <div class="header-content">
            <h1>페이지 제목</h1>
            <p>페이지 설명</p>
        </div>
    </div>
</header>
```

**특징:**
- 그라데이션 배경 (`--primary-gradient`)
- 텍스처 오버레이 효과
- 반응형 타이포그래피
- 중앙 정렬 레이아웃

**CSS 변수:**
```css
--header-padding: var(--spacing-12);
--header-text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

### **2. Step Card Component** ✅
```html
<section class="step">
    <h2>
        <span class="step-number">1</span>
        단계 제목
    </h2>
    <p>단계 설명</p>
    <div class="form-group">
        <label for="input">라벨</label>
        <input type="text" id="input" placeholder="입력하세요">
    </div>
    <button class="step-button">다음 단계</button>
</section>
```

**특징:**
- 호버 시 상승 효과 (`translateY(-2px)`)
- 그림자 변화 애니메이션
- 단계 번호 원형 배지
- 카드 기반 레이아웃

**변형:**
- `.step.completed`: 완료된 단계
- `.step.current`: 현재 진행 중인 단계
- `.step.disabled`: 비활성화된 단계

### **3. Button Component** ✅
```html
<!-- 기본 버튼 -->
<button class="step-button">기본 버튼</button>

<!-- 테스트 버튼 -->
<button class="step-button test-button">테스트</button>

<!-- 이메일 버튼 -->
<button class="step-button email-button">이메일 발송</button>

<!-- 비활성화 버튼 -->
<button class="step-button" disabled>비활성화</button>
```

**특징:**
- 그라데이션 배경
- 호버 시 상승 및 그림자 효과
- 활성/비활성 상태 지원
- 다양한 색상 변형

**상태:**
- `:hover`: 상승 효과 + 그림자
- `:active`: 원래 위치로 복귀
- `:disabled`: 투명도 감소 + 포인터 비활성화
- `:focus`: 아웃라인 표시

### **4. Form Components** ✅
```html
<div class="form-group">
    <label for="email">이메일 주소</label>
    <input type="email" id="email" placeholder="example@email.com">
</div>

<div class="form-group">
    <label for="message">메시지</label>
    <textarea id="message" rows="4" placeholder="메시지를 입력하세요"></textarea>
</div>
```

**특징:**
- 포커스 시 테두리 색상 변경
- 부드러운 상승 효과
- 플레이스홀더 스타일링
- 일관된 간격 시스템

### **5. Status Message Component** ✅
```html
<div class="status-message status-success">
    ✅ 성공적으로 완료되었습니다!
</div>

<div class="status-message status-error">
    ❌ 오류가 발생했습니다.
</div>

<div class="status-message status-info">
    ℹ️ 정보를 확인해주세요.
</div>

<div class="status-message status-warning">
    ⚠️ 주의가 필요합니다.
</div>
```

**특징:**
- 4가지 상태 타입 (success, error, info, warning)
- 왼쪽 테두리 강조
- 적절한 색상 대비
- 아이콘과 텍스트 조합

---

## 📐 레이아웃 컴포넌트

### **6. Container Component** ✅
```html
<div class="container">
    <!-- 콘텐츠 -->
</div>
```

**특징:**
- 최대 너비: `1200px`
- 중앙 정렬
- 반응형 패딩
- 모든 주요 섹션에서 사용

### **7. Content Grid Component** ✅
```html
<div class="content-grid">
    <div class="content-card">
        <h3>카드 제목</h3>
        <p>카드 설명</p>
    </div>
    <!-- 더 많은 카드들... -->
</div>
```

**특징:**
- CSS Grid 기반
- 자동 반응형 (`auto-fit, minmax(280px, 1fr)`)
- 일관된 간격 (`--spacing-6`)
- 호버 효과가 있는 카드

**반응형 동작:**
- 모바일: 1열
- 태블릿: 2열
- 데스크톱: 4열

### **8. Related Content Section** ✅
```html
<section class="related-content">
    <div class="container">
        <h2>관련 콘텐츠</h2>
        <div class="content-grid">
            <a href="#" class="content-card">
                <h3>콘텐츠 제목</h3>
                <p>콘텐츠 설명</p>
                <span class="status-badge">출시 예정</span>
            </a>
        </div>
    </div>
</section>
```

**특징:**
- 카드 기반 그리드 레이아웃
- 상태 배지 지원
- 호버 애니메이션
- 링크 카드 형태

---

## 🎪 인터랙티브 컴포넌트

### **9. Newsletter Section** ✅
```html
<section class="newsletter-section">
    <h2>📬 뉴스레터 구독</h2>
    <p>최신 소식을 받아보세요.</p>
    <form class="newsletter-form">
        <input type="email" placeholder="이메일 주소를 입력하세요" required>
        <button type="submit">구독하기</button>
    </form>
    <div class="newsletter-status"></div>
</section>
```

**특징:**
- 상단 그라데이션 테두리
- 인라인 폼 레이아웃
- 반응형 (모바일에서 세로 배치)
- 상태 메시지 영역

### **10. Footer Component** ✅
```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>섹션 제목</h3>
                <p>섹션 내용</p>
            </div>
            <!-- 더 많은 섹션들... -->
        </div>
        <div class="footer-bottom">
            <div class="footer-social">
                <a href="#">📷</a>
                <a href="#">✍️</a>
                <a href="#">📧</a>
            </div>
            <p>&copy; 2024 저작권 정보</p>
        </div>
    </div>
</footer>
```

**특징:**
- 다크 테마 디자인
- 3단 그리드 레이아웃
- 소셜 링크 버튼
- 반응형 중앙 정렬 (모바일)

---

## 🚧 개발 예정 컴포넌트

### **11. Modal Component** 📋
```html
<div class="modal" id="modal">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3>모달 제목</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p>모달 내용</p>
        </div>
        <div class="modal-footer">
            <button class="step-button">확인</button>
            <button class="step-button secondary">취소</button>
        </div>
    </div>
</div>
```

### **12. Dropdown Component** 📋
```html
<div class="dropdown">
    <button class="dropdown-trigger">옵션 선택</button>
    <div class="dropdown-menu">
        <a href="#" class="dropdown-item">옵션 1</a>
        <a href="#" class="dropdown-item">옵션 2</a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">옵션 3</a>
    </div>
</div>
```

### **13. Tooltip Component** 📋
```html
<span class="tooltip" data-tooltip="도움말 텍스트">
    도움말이 있는 텍스트
</span>
```

### **14. Tabs Component** 📋
```html
<div class="tabs">
    <div class="tab-list">
        <button class="tab-button active">탭 1</button>
        <button class="tab-button">탭 2</button>
        <button class="tab-button">탭 3</button>
    </div>
    <div class="tab-content">
        <div class="tab-panel active">탭 1 내용</div>
        <div class="tab-panel">탭 2 내용</div>
        <div class="tab-panel">탭 3 내용</div>
    </div>
</div>
```

---

## 📚 사용 가이드

### **컴포넌트 조합 예시**
```html
<!-- 완전한 페이지 구조 -->
<header class="header">
    <!-- 헤더 내용 -->
</header>

<main class="main-content">
    <div class="container">
        <section class="step">
            <!-- 단계 내용 -->
        </section>
        
        <section class="related-content">
            <!-- 관련 콘텐츠 -->
        </section>
        
        <section class="newsletter-section">
            <!-- 뉴스레터 구독 -->
        </section>
    </div>
</main>

<footer class="footer">
    <!-- 푸터 내용 -->
</footer>
```

### **커스터마이징 가이드**
```css
/* 브랜드 컬러 변경 */
:root {
    --primary-gradient: linear-gradient(135deg, #your-color-1, #your-color-2);
    --primary-color: #your-primary-color;
}

/* 간격 조정 */
.custom-spacing {
    padding: var(--spacing-8) var(--spacing-6);
    margin-bottom: var(--spacing-10);
}

/* 새로운 버튼 변형 */
.step-button.custom {
    background: linear-gradient(135deg, #custom-color-1, #custom-color-2);
}
```

### **접근성 체크리스트**
- [ ] 모든 인터랙티브 요소에 포커스 표시
- [ ] 적절한 색상 대비 (4.5:1 이상)
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 호환성
- [ ] 의미있는 HTML 구조

### **성능 최적화 팁**
```css
/* GPU 가속 활용 */
.step:hover {
    will-change: transform;
    transform: translateZ(0) translateY(-2px);
}

/* 애니메이션 최적화 */
@media (prefers-reduced-motion: reduce) {
    .step {
        transition: none;
    }
}
```

---

## 🔧 개발 도구

### **컴포넌트 테스트**
```javascript
// 컴포넌트 상태 확인
function testComponent(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.error(`컴포넌트를 찾을 수 없습니다: ${selector}`);
        return;
    }
    
    const styles = getComputedStyle(element);
    console.log('컴포넌트 스타일:', {
        background: styles.background,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow
    });
}

// 사용 예시
testComponent('.step');
testComponent('.step-button');
```

### **반응형 테스트**
```javascript
// 반응형 중단점 테스트
function testResponsive() {
    const breakpoints = {
        mobile: '(max-width: 767px)',
        tablet: '(min-width: 768px) and (max-width: 1023px)',
        desktop: '(min-width: 1024px)'
    };
    
    Object.entries(breakpoints).forEach(([name, query]) => {
        if (window.matchMedia(query).matches) {
            console.log(`현재 화면: ${name}`);
            document.body.setAttribute('data-breakpoint', name);
        }
    });
}

// 화면 크기 변경 시 자동 테스트
window.addEventListener('resize', testResponsive);
testResponsive();
```

---

**🧩 이 컴포넌트 라이브러리는 EmailJS 학습 도구의 일관된 디자인을 위해 지속적으로 발전하고 있습니다.**