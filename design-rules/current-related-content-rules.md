# 현재 적용된 연관 콘텐츠 디자인 규칙

## 📋 현재 구현 상태 분석

### 🎨 **CSS 클래스 구조**
```css
/* 메인 섹션 */
.related-content
.related-content h2
.related-sections
.related-section
.related-section h3
.related-grid

/* 카드 컴포넌트 */
.related-card
.related-card h4
.related-card p
.related-card .card-footer

/* 상태 및 링크 */
.card-status
.card-status.published
.card-status.coming-soon
.card-link
```

### 🏗️ **HTML 구조**
```html
<section class="related-content">
    <h2>🔗 연관 콘텐츠</h2>
    <div class="related-sections">
        <div class="related-section">
            <h3>🔧 더 많은 학습 도구</h3>
            <div class="related-grid" id="websites-grid">
                <div class="related-card">
                    <h4>카드 제목</h4>
                    <p>카드 설명</p>
                    <div class="card-footer">
                        <span class="card-status published">공개됨</span>
                        <a href="#" class="card-link">자세히 보기</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="related-section">
            <h3>📚 바이브코딩 인사이트</h3>
            <div class="related-grid" id="blogs-grid">
                <!-- 동일한 카드 구조 -->
            </div>
        </div>
    </div>
</section>
```

## 🎯 **현재 디자인 규칙 정의**

### **1. 레이아웃 규칙**
- **메인 컨테이너**: `margin: 80px 0`
- **섹션 간격**: `gap: 60px` (1024px 이상에서 2열)
- **카드 간격**: `gap: 20px`
- **카드 패딩**: `padding: 24px`

### **2. 그리드 시스템**
```css
/* 모바일 (기본) */
.related-sections { grid-template-columns: 1fr; }
.related-grid { grid-template-columns: 1fr; }

/* 태블릿 (768px+) */
.related-grid { grid-template-columns: repeat(2, 1fr); }

/* 데스크톱 (1024px+) */
.related-sections { grid-template-columns: 1fr 1fr; }

/* 대형 화면 (1200px+) */
.related-grid { grid-template-columns: repeat(3, 1fr); }
```

### **3. 타이포그래피 규칙**
- **메인 제목**: `font-size: 28px; font-weight: 600; text-align: center;`
- **섹션 제목**: `font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px;`
- **카드 제목**: `font-size: 16px; font-weight: 600; line-height: 1.4;`
- **카드 설명**: `font-size: 13px; line-height: 1.5; color: var(--text-secondary);`

### **4. 색상 시스템**
```css
/* 카드 배경 */
background: var(--background-card);
border: 1px solid var(--border-light);

/* 상태 배지 */
.card-status.published {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    color: #155724;
}

.card-status.coming-soon {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    color: #856404;
}

/* 링크 색상 */
.card-link {
    color: #667eea;
}
.card-link:hover {
    color: #764ba2;
}
```

### **5. 상태 배지 규칙**
- **크기**: `padding: 4px 12px; border-radius: 20px;`
- **폰트**: `font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;`
- **published**: 초록 그라데이션 + 진한 초록 텍스트
- **coming-soon**: 노랑 그라데이션 + 진한 노랑 텍스트

### **6. 인터랙션 규칙**
```css
/* 호버 효과 */
.related-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
}

/* 링크 화살표 애니메이션 */
.card-link::after {
    content: '→';
    transition: transform 0.3s ease;
}
.card-link:hover::after {
    transform: translateX(2px);
}
```

### **7. 그림자 시스템**
- **기본**: `box-shadow: var(--shadow-soft);`
- **호버**: `box-shadow: var(--shadow-hover);`
- **전환**: `transition: all 0.3s ease;`

## 🔧 **비즈니스 로직 규칙**

### **상태 결정 로직**
```javascript
// 현재 구현된 로직
const hasLink = item.url && item.url.trim() !== '';
const status = hasLink ? item.status : 'coming-soon';

// 실제 적용:
// 1. URL이 있고 status='published' → 'published' (초록 배지 + 링크)
// 2. URL이 없거나 status≠'published' → 'coming-soon' (노랑 배지 + 링크 없음)
```

### **카드 렌더링 로직**
```javascript
card.innerHTML = `
    <h4>${item.title || '제목 없음'}</h4>
    <p>${item.description || '설명이 없습니다.'}</p>
    <div class="card-footer">
        <span class="card-status ${status}">
            ${status === 'published' ? '공개됨' : '출시 예정'}
        </span>
        ${hasLink ? `<a href="${item.url}" class="card-link" target="_blank">자세히 보기</a>` : ''}
    </div>
`;
```

### **클릭 이벤트 로직**
1. 콘솔에 클릭 정보 로그 출력
2. 조회수 증가 API 호출 (비동기)
3. URL이 있으면 새 탭에서 열기
4. URL이 없으면 "출시 예정" 메시지 표시

## 📱 **반응형 규칙**

### **모바일 (< 768px)**
- 모든 그리드가 1열로 변경
- `related-content { margin: 40px 0; }`

### **태블릿 (768px - 1024px)**
- 카드 그리드: 2열
- 섹션: 여전히 1열

### **데스크톱 (1024px+)**
- 섹션: 2열 (좌우 분할)
- 카드 그리드: 2열 유지

### **대형 화면 (1200px+)**
- 카드 그리드: 3열로 확장

## 🎨 **현재 적용된 CSS 변수**
```css
:root {
    --background-card: #ffffff;
    --border-light: #e2e8f0;
    --shadow-soft: 0 15px 35px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
    --text-primary: #333;
    --text-secondary: #666;
}
```

## 🔍 **현재 구현의 특징**

### **장점**
1. ✅ 일관된 그리드 시스템
2. ✅ 명확한 상태 구분 (published vs coming-soon)
3. ✅ 부드러운 호버 애니메이션
4. ✅ 반응형 디자인 완벽 지원
5. ✅ 접근성 고려 (키보드 네비게이션)

### **개선 가능한 부분**
1. 🔄 CSS 클래스명이 BEM 방법론을 완전히 따르지 않음
2. 🔄 컴포넌트별 CSS 변수 네임스페이스 부족
3. 🔄 상태별 아이콘 시스템 부재

## 📋 **섹션별 동일성 확인**

### **websites-grid와 blogs-grid 비교**
- ✅ **HTML 구조**: 100% 동일
- ✅ **CSS 클래스**: 100% 동일  
- ✅ **상태 로직**: 100% 동일
- ✅ **클릭 동작**: 100% 동일
- ✅ **스타일링**: 100% 동일

**결론**: 현재 두 섹션은 완전히 동일한 디자인 규칙을 사용하고 있습니다.