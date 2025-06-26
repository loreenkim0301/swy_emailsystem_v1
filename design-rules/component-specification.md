# 연관 콘텐츠 컴포넌트 명세서

## 🎯 컴포넌트 정의

### **컴포넌트명**: RelatedContentSection
### **목적**: 카테고리별 연관 콘텐츠를 카드 형태로 표시
### **사용처**: 웹사이트 하단, 블로그 포스트 하단 등

## 📐 디자인 토큰 (Design Tokens)

### **간격 (Spacing)**
```css
--section-margin: 80px 0;           /* 섹션 상하 여백 */
--section-gap: 60px;                /* 섹션 간 간격 */
--card-gap: 20px;                   /* 카드 간 간격 */
--card-padding: 24px;               /* 카드 내부 여백 */
--title-margin-bottom: 50px;        /* 메인 제목 하단 여백 */
--section-title-margin: 24px;       /* 섹션 제목 하단 여백 */
--card-title-margin: 8px;           /* 카드 제목 하단 여백 */
--card-desc-margin: 16px;           /* 카드 설명 하단 여백 */
```

### **크기 (Sizing)**
```css
--card-border-radius: 16px;         /* 카드 모서리 둥글기 */
--status-border-radius: 20px;       /* 상태 배지 둥글기 */
--status-padding: 4px 12px;         /* 상태 배지 패딩 */
```

### **색상 (Colors)**
```css
--card-background: var(--background-card);
--card-border: var(--border-light);
--text-primary: var(--text-primary);
--text-secondary: var(--text-secondary);

/* 상태별 색상 */
--status-published-bg: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
--status-published-text: #155724;
--status-coming-soon-bg: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
--status-coming-soon-text: #856404;

/* 링크 색상 */
--link-color: #667eea;
--link-hover-color: #764ba2;
```

### **그림자 (Shadows)**
```css
--card-shadow: var(--shadow-soft);
--card-shadow-hover: var(--shadow-hover);
```

### **애니메이션 (Animation)**
```css
--transition-duration: 0.3s;
--transition-easing: ease;
--hover-transform: translateY(-4px);
--arrow-transform: translateX(2px);
```

## 🏗️ 구조 명세

### **HTML 구조**
```html
<section class="related-content">
    <h2 class="related-content__title">🔗 연관 콘텐츠</h2>
    <div class="related-content__sections">
        <div class="related-content__section">
            <h3 class="related-content__section-title">
                <span class="section-icon">🔧</span>
                <span class="section-text">더 많은 학습 도구</span>
            </h3>
            <div class="related-content__grid">
                <article class="related-content__card">
                    <h4 class="card__title">카드 제목</h4>
                    <p class="card__description">카드 설명</p>
                    <footer class="card__footer">
                        <span class="card__status card__status--published">공개됨</span>
                        <a href="#" class="card__link">자세히 보기</a>
                    </footer>
                </article>
            </div>
        </div>
    </div>
</section>
```

### **CSS 클래스 계층**
```
.related-content
├── .related-content__title
├── .related-content__sections
    └── .related-content__section
        ├── .related-content__section-title
        │   ├── .section-icon
        │   └── .section-text
        └── .related-content__grid
            └── .related-content__card
                ├── .card__title
                ├── .card__description
                └── .card__footer
                    ├── .card__status
                    │   ├── .card__status--published
                    │   └── .card__status--coming-soon
                    └── .card__link
```

## 📱 반응형 명세

### **브레이크포인트**
```css
/* 모바일 퍼스트 */
.related-content__sections { grid-template-columns: 1fr; }
.related-content__grid { grid-template-columns: 1fr; }

/* 태블릿 (768px+) */
@media (min-width: 768px) {
    .related-content__grid { 
        grid-template-columns: repeat(2, 1fr); 
    }
}

/* 데스크톱 (1024px+) */
@media (min-width: 1024px) {
    .related-content__sections { 
        grid-template-columns: 1fr 1fr; 
    }
}

/* 대형 화면 (1200px+) */
@media (min-width: 1200px) {
    .related-content__grid { 
        grid-template-columns: repeat(3, 1fr); 
    }
}

/* 모바일 조정 */
@media (max-width: 768px) {
    .related-content {
        margin: 40px 0;
    }
}
```

## 🎨 상태 시스템

### **카드 상태 정의**
```javascript
const CARD_STATES = {
    PUBLISHED: {
        className: 'card__status--published',
        text: '공개됨',
        hasLink: true,
        bgColor: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
        textColor: '#155724'
    },
    COMING_SOON: {
        className: 'card__status--coming-soon', 
        text: '출시 예정',
        hasLink: false,
        bgColor: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
        textColor: '#856404'
    }
};
```

### **상태 결정 로직**
```javascript
function determineCardState(item) {
    // 비즈니스 규칙: published + URL 존재 → PUBLISHED
    // 그 외 모든 경우 → COMING_SOON
    if (item.status === 'published' && item.url && item.url.trim() !== '') {
        return CARD_STATES.PUBLISHED;
    }
    return CARD_STATES.COMING_SOON;
}
```

## 🔧 인터랙션 명세

### **호버 효과**
```css
.related-content__card:hover {
    transform: var(--hover-transform);
    box-shadow: var(--card-shadow-hover);
    transition: all var(--transition-duration) var(--transition-easing);
}
```

### **링크 애니메이션**
```css
.card__link::after {
    content: '→';
    transition: transform var(--transition-duration) var(--transition-easing);
}

.card__link:hover::after {
    transform: var(--arrow-transform);
}
```

### **클릭 이벤트 플로우**
```javascript
function handleCardClick(event, item, category) {
    // 1. 이벤트 로깅
    console.log('🔗 연관 게시글 클릭됨:', {
        id: item.id,
        title: item.title,
        type: category,
        status: item.status,
        hasUrl: !!(item.url && item.url.trim() !== ''),
        url: item.url || null
    });
    
    // 2. 조회수 증가 (비동기)
    incrementViewCount(item.id);
    
    // 3. 링크 처리
    const state = determineCardState(item);
    if (state.hasLink) {
        window.open(item.url, '_blank');
    } else {
        showTemporaryMessage('🚀 이 콘텐츠는 곧 출시될 예정입니다!');
    }
}
```

## 📋 데이터 인터페이스

### **카드 데이터 구조**
```typescript
interface CardData {
    id: number;
    title: string;
    description?: string;
    status: 'published' | 'coming-soon' | 'draft';
    url?: string;
    category: 'website' | 'blog' | 'tutorial' | 'guide';
    created_at: string;
    view_count?: number;
}
```

### **섹션 설정 구조**
```typescript
interface SectionConfig {
    id: string;
    title: string;
    icon?: string;
    category: string;
    limit: number;
}
```

## ♿ 접근성 명세

### **키보드 네비게이션**
```css
.related-content__card:focus {
    outline: 2px solid var(--link-color);
    outline-offset: 2px;
}

.card__link:focus {
    outline: 2px solid var(--link-color);
    outline-offset: 2px;
}
```

### **스크린 리더 지원**
```html
<article class="related-content__card" 
         role="button"
         tabindex="0"
         aria-label="카드 제목 - 카드 설명">
    <!-- 카드 내용 -->
</article>
```

### **모션 감소 지원**
```css
@media (prefers-reduced-motion: reduce) {
    .related-content__card {
        transition: none;
    }
    
    .related-content__card:hover {
        transform: none;
    }
    
    .card__link::after {
        transition: none;
    }
}
```

## 🧪 테스트 케이스

### **시각적 테스트**
1. ✅ 카드가 올바른 그리드로 배치되는가?
2. ✅ 호버 시 애니메이션이 부드러운가?
3. ✅ 상태 배지 색상이 올바른가?
4. ✅ 반응형에서 레이아웃이 깨지지 않는가?

### **기능적 테스트**
1. ✅ published + URL → 링크 표시
2. ✅ coming-soon → 링크 없음
3. ✅ 클릭 시 조회수 증가
4. ✅ 새 탭에서 링크 열기

### **접근성 테스트**
1. ✅ 키보드로 모든 카드 접근 가능
2. ✅ 스크린 리더로 내용 읽기 가능
3. ✅ 포커스 표시가 명확한가?

## 📊 성능 명세

### **로딩 최적화**
- 이미지 lazy loading
- CSS 애니메이션 GPU 가속
- 불필요한 리플로우 방지

### **메모리 최적화**
- 이벤트 리스너 정리
- DOM 요소 재사용
- 메모리 누수 방지

---

**이 명세서는 현재 구현된 디자인 규칙을 정확히 반영합니다.**