# AI 에이전트 개발 가이드

## 📋 프로젝트 개요

이 프로젝트는 **재사용 가능한 컴포넌트 시스템**을 갖추고 있습니다.
헤더(Header)와 푸터(Footer)를 공통 컴포넌트로 사용하고, 본문(Main Content)만 교체하여 새로운 콘텐츠 페이지를 빠르게 생성할 수 있습니다.

---

## 🏗️ 프로젝트 구조

```
project/
├── index.html                      # 메인 페이지 (EmailJS 학습 도구)
├── components/                     # 재사용 가능한 컴포넌트
│   ├── footer/                    # 푸터 컴포넌트
│   │   ├── footer-component.js   # 푸터 로직
│   │   ├── footer-config.js      # 푸터 설정 (★ 수정 대상)
│   │   ├── footer.css            # 푸터 스타일
│   │   └── README.md             # 푸터 사용 가이드
│   └── related-content/           # 관련 콘텐츠 컴포넌트
├── js/                            # JavaScript 모듈
│   ├── supabase-client.js        # Supabase 클라이언트
│   └── blogs-client.js           # 블로그 데이터 처리
└── supabase/migrations/          # 데이터베이스 마이그레이션
```

---

## 🎯 새로운 페이지 생성 방법

### 1단계: HTML 파일 생성

새로운 콘텐츠 페이지를 만들 때는 `index.html`을 템플릿으로 활용합니다.

```bash
# 예시: 새로운 학습 도구 페이지 생성
cp index.html learning-tools.html
```

### 2단계: HTML 구조 이해

모든 페이지는 다음 구조를 따릅니다:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- ✅ 메타 정보 (페이지별 커스터마이징) -->
    <title>페이지 제목</title>
    <meta name="description" content="페이지 설명">
    <meta name="keywords" content="키워드1, 키워드2">

    <!-- ✅ 공통 리소스 (변경하지 마세요) -->
    <link rel="stylesheet" href="./components/footer/footer.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <!-- ✅ 페이지별 스타일 -->
    <style>
        /* 이 페이지만의 스타일 */
    </style>
</head>
<body>
    <!-- ✅ 헤더 (페이지별 커스터마이징) -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="https://www.swy.kr/" class="header-link">다른 콘텐츠 더보기</a>
                <h1>📧 페이지 제목</h1>
                <p>페이지 설명</p>
            </div>
        </div>
    </header>

    <!-- ✅ 본문 콘텐츠 (여기를 수정하세요!) -->
    <main class="main">
        <div class="container">
            <!-- 여기에 페이지별 고유 콘텐츠를 작성 -->
        </div>
    </main>

    <!-- ✅ 푸터 (자동 생성, 수정 금지) -->
    <footer class="footer"></footer>

    <!-- ✅ JavaScript (푸터 초기화 포함) -->
    <script type="module">
        import { initializeSupabase, subscribeToNewsletter } from './js/supabase-client.js';
        import { FooterComponent } from './components/footer/footer-component.js';
        import { FOOTER_CONFIG } from './components/footer/footer-config.js';

        document.addEventListener('DOMContentLoaded', async () => {
            // Supabase 초기화
            const supabaseInitialized = initializeSupabase();

            if (supabaseInitialized) {
                // 푸터 컴포넌트 초기화
                const footer = new FooterComponent(
                    document.querySelector('.footer'),
                    {
                        config: FOOTER_CONFIG,
                        subscriptionHandler: subscribeToNewsletter
                    }
                );
                footer.init();
            }

            // 여기에 페이지별 JavaScript 코드 추가
        });
    </script>
</body>
</html>
```

---

## 📝 수정 가이드

### ✅ 반드시 수정해야 하는 부분

#### 1. SEO 메타 정보
```html
<title>바이브코드제로 - 새로운 페이지 제목</title>
<meta name="description" content="페이지 설명">
<meta name="keywords" content="키워드1, 키워드2">

<!-- Open Graph -->
<meta property="og:title" content="새로운 페이지 제목">
<meta property="og:description" content="페이지 설명">
```

#### 2. 헤더 콘텐츠
```html
<header class="header">
    <div class="container">
        <div class="header-content">
            <a href="https://www.swy.kr/" class="header-link">다른 콘텐츠 더보기</a>
            <h1>📧 새로운 페이지 제목</h1>
            <p>새로운 페이지 설명</p>
        </div>
    </div>
</header>
```

#### 3. 본문 콘텐츠
```html
<main class="main">
    <div class="container">
        <!-- 여기에 완전히 새로운 콘텐츠를 작성 -->
        <h2>새로운 섹션</h2>
        <p>새로운 내용</p>
    </div>
</main>
```

### ❌ 절대 수정하지 말아야 할 부분

1. **푸터 컴포넌트 구조**
   ```html
   <!-- ❌ 이 부분을 수정하지 마세요 -->
   <footer class="footer"></footer>
   ```

2. **푸터 초기화 코드**
   ```javascript
   // ❌ 이 부분을 수정하지 마세요
   const footer = new FooterComponent(
       document.querySelector('.footer'),
       {
           config: FOOTER_CONFIG,
           subscriptionHandler: subscribeToNewsletter
       }
   );
   footer.init();
   ```

3. **공통 CSS 클래스**
   - `.header`, `.header-content`, `.header-link`
   - `.main`, `.container`
   - `.footer`

---

## 🎨 스타일링 가이드

### CSS 변수 (모든 페이지 공통)

```css
:root {
    /* 그라데이션 팔레트 */
    --primary-gradient: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
    --secondary-gradient: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
    --success-gradient: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
    --warning-gradient: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    --error-gradient: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);

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

### 공통 컴포넌트 클래스

```css
/* 버튼 */
.btn { }
.btn-primary { background: var(--primary-gradient); }
.btn-secondary { background: var(--secondary-gradient); }

/* 상태 메시지 */
.status-message { }
.status-success { }
.status-error { }
.status-warning { }
.status-info { }

/* 폼 */
.form-group { }
.form-group input { }
.form-group textarea { }

/* 코드 블록 */
.code-block { }
.code-inline { }
```

---

## 🔧 푸터 설정 변경

푸터 콘텐츠를 변경하려면 `components/footer/footer-config.js` 파일만 수정하세요.

### 현재 푸터 구성

```javascript
export const FOOTER_CONFIG = {
    title: "EmailJS 학습 도구",
    copyright: "© 2025 EmailJS 학습 도구. 학습 목적으로 제작된 오픈소스 프로젝트입니다.",

    sections: [
        {
            id: "contact",
            type: "contact",
            title: "🏠 제작자 정보",
            author: "AI코딩하는 김로린 기획자",
            // ...
        },
        {
            id: "subscription",
            type: "subscription",
            title: "🚀 바이브코드제로 클럽",
            // ...
        }
    ]
};
```

### 푸터 섹션 타입

1. **contact** - 제작자 정보
2. **subscription** - 뉴스레터 구독
3. **list** - 일반 리스트
4. **tech** - 기술 스택

---

## 📦 새로운 페이지 생성 체크리스트

새로운 페이지를 만들 때 다음 체크리스트를 따르세요:

- [ ] `index.html`을 복사하여 새 파일 생성 (예: `new-page.html`)
- [ ] `<title>` 태그 수정
- [ ] `<meta name="description">` 수정
- [ ] `<meta name="keywords">` 수정
- [ ] Open Graph 메타 태그 수정
- [ ] 헤더 제목(`<h1>`) 수정
- [ ] 헤더 설명(`<p>`) 수정
- [ ] `<main>` 태그 안의 본문 콘텐츠 완전히 교체
- [ ] 페이지별 스타일 추가 (`<style>` 태그 안)
- [ ] 페이지별 JavaScript 로직 추가 (필요시)
- [ ] 푸터 초기화 코드는 그대로 유지
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 브라우저에서 정상 작동 확인

---

## 💡 실전 예시

### 예시 1: 새로운 학습 도구 페이지 만들기

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>바이브코드제로 - Supabase 데이터베이스 배우기</title>
    <meta name="description" content="Supabase 데이터베이스를 배우는 실습 도구">
    <meta name="keywords" content="셀렉트웨이, 김로린, 바이브코드제로, Supabase, 데이터베이스">

    <!-- 공통 리소스 -->
    <link rel="stylesheet" href="./components/footer/footer.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <style>
        /* 공통 스타일 (index.html에서 복사) */
        /* ... */

        /* 이 페이지만의 추가 스타일 */
        .database-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: var(--shadow-soft);
        }
    </style>
</head>
<body>
    <!-- 헤더 -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="https://www.swy.kr/" class="header-link">다른 콘텐츠 더보기</a>
                <h1>🗄️ Supabase 데이터베이스 학습 도구</h1>
                <p>데이터베이스 연결부터 CRUD 작업까지 단계별로 배워보세요.</p>
            </div>
        </div>
    </header>

    <!-- 본문 -->
    <main class="main">
        <div class="container">
            <div class="database-card">
                <h2>데이터베이스 연결하기</h2>
                <!-- 새로운 콘텐츠 -->
            </div>
        </div>
    </main>

    <!-- 푸터 (자동 생성) -->
    <footer class="footer"></footer>

    <!-- JavaScript -->
    <script type="module">
        import { initializeSupabase, subscribeToNewsletter } from './js/supabase-client.js';
        import { FooterComponent } from './components/footer/footer-component.js';
        import { FOOTER_CONFIG } from './components/footer/footer-config.js';

        document.addEventListener('DOMContentLoaded', async () => {
            const supabaseInitialized = initializeSupabase();

            if (supabaseInitialized) {
                const footer = new FooterComponent(
                    document.querySelector('.footer'),
                    {
                        config: FOOTER_CONFIG,
                        subscriptionHandler: subscribeToNewsletter
                    }
                );
                footer.init();
            }

            // 페이지별 로직
            console.log('Supabase 학습 도구 시작');
        });
    </script>
</body>
</html>
```

---

## 🚀 배포 전 확인사항

1. **빌드 테스트**
   ```bash
   npm run build
   ```

2. **SEO 확인**
   - [ ] 모든 이미지에 `alt` 속성 있는지
   - [ ] `<title>`, `<meta description>`, `<meta keywords>` 설정되었는지
   - [ ] Open Graph 태그 설정되었는지

3. **접근성 확인**
   - [ ] 키보드 네비게이션 작동하는지
   - [ ] 색상 대비가 적절한지
   - [ ] 모든 폼 요소에 `label` 있는지

4. **반응형 확인**
   - [ ] 모바일에서 정상 작동하는지
   - [ ] 태블릿에서 정상 작동하는지
   - [ ] 데스크톱에서 정상 작동하는지

---

## 🎯 주요 원칙

### DO ✅

- 헤더와 푸터는 일관성 유지
- 본문 콘텐츠만 자유롭게 수정
- CSS 변수 활용하여 스타일링
- 공통 컴포넌트 클래스 재사용
- 시맨틱 HTML 사용
- 접근성 고려

### DON'T ❌

- 푸터 컴포넌트 HTML 구조 직접 수정
- 푸터 초기화 코드 제거
- CSS 변수 이름 변경
- 공통 클래스 이름 변경
- 인라인 스타일 남발
- 접근성 무시

---

## 📚 추가 리소스

- **푸터 컴포넌트 가이드**: `components/footer/README.md`
- **Supabase 클라이언트**: `js/supabase-client.js`
- **데이터베이스 마이그레이션**: `supabase/migrations/`

---

## 🆘 문제 해결

### 푸터가 나타나지 않을 때

```javascript
// 1. Supabase 초기화 확인
const supabaseInitialized = initializeSupabase();
console.log('Supabase 초기화:', supabaseInitialized);

// 2. 푸터 요소 확인
const footerElement = document.querySelector('.footer');
console.log('푸터 요소:', footerElement);

// 3. 콘솔에 오류 메시지 확인
```

### 스타일이 깨질 때

1. CSS 파일 경로 확인
   ```html
   <link rel="stylesheet" href="./components/footer/footer.css">
   ```

2. CSS 변수 사용 확인
   ```css
   background: var(--primary-gradient);
   ```

### JavaScript 오류가 날 때

1. 모듈 임포트 확인
   ```javascript
   import { initializeSupabase } from './js/supabase-client.js';
   ```

2. `type="module"` 속성 확인
   ```html
   <script type="module">
   ```

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. 브라우저 개발자 도구 콘솔 확인
2. 네트워크 탭에서 리소스 로드 확인
3. 파일 경로가 올바른지 확인
4. 빌드 오류 메시지 확인

---

**버전**: v1.0.0
**마지막 업데이트**: 2025-01-23
**제작**: 바이브코드제로 (김로린)
