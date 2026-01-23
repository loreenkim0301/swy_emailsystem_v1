# 🚀 보일러플레이트 프로젝트 가이드

**복사 → 붙여넣기 → 설정 변경** 3단계로 새 프로젝트 시작하기

---

## ⚠️ 중요: 프로젝트 사용 방법

### 🎯 올바른 방법: 전체 프로젝트 클론 + AI-AGENT-GUIDE 읽기

이 프로젝트는 **보일러플레이트 템플릿 저장소**입니다. 새 프로젝트를 시작하려면 **전체 프로젝트를 클론**해야 합니다!

```bash
# ✅ 올바른 방법
git clone <이-저장소-URL> my-new-project
cd my-new-project

# Bolt.new에 업로드 후 AI에게 프롬프트
"AI-AGENT-GUIDE.md를 읽고 새 프로젝트로 세팅해줘.
프로젝트명: my-portfolio
작성자: 김철수
이메일: hello@kimcs.com"
```

### ❌ 잘못된 방법

```bash
# ❌ AI-AGENT-GUIDE.md 파일만 복사 (이렇게 하지 마세요!)
새 프로젝트에 AI-AGENT-GUIDE.md만 붙여넣기

# 문제점:
- 필수 파일들(footer, supabase-client 등)이 없음
- AI가 처음부터 다시 만들어야 함
- 템플릿의 장점을 활용할 수 없음
```

### 📦 포함된 필수 파일들

전체 클론을 해야 하는 이유는 다음 필수 파일들이 함께 필요하기 때문입니다:

```
✅ components/footer/          ← 재사용 가능한 푸터 컴포넌트
✅ js/supabase-client.js       ← Supabase 유틸리티
✅ .env.example                 ← 환경 변수 템플릿
✅ package.json                 ← 의존성 템플릿
✅ index.html                   ← 페이지 템플릿
✅ AI-AGENT-GUIDE.md            ← 이 사용 설명서
```

---

## 📋 목차

1. [빠른 시작 (5분 안에)](#-빠른-시작-5분-안에)
2. [보일러플레이트 패키지](#-보일러플레이트-패키지)
3. [설정 가이드](#️-설정-가이드)
4. [템플릿 파일](#-템플릿-파일)
5. [커스터마이징 포인트](#-커스터마이징-포인트)
6. [프로젝트 타입별 예시](#-프로젝트-타입별-예시)
7. [스타일링 가이드](#-스타일링-가이드)
8. [문제 해결](#-문제-해결)
9. [고급 사용법](#-고급-사용법)

---

## 🚀 빠른 시작 (5분 안에)

### 필수 파일 복사 체크리스트

새 프로젝트를 시작하려면 다음 5개 항목만 복사하세요:

```bash
✅ 1. components/footer/          # 푸터 컴포넌트 (폴더 전체)
✅ 2. js/supabase-client.js       # Supabase 클라이언트
✅ 3. .env.example                 # 환경 변수 템플릿
✅ 4. package.json                 # 의존성 설정
✅ 5. index.html                   # 페이지 템플릿
```

### 3줄 명령어로 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 Supabase URL과 Key를 입력하세요

# 3. 개발 서버 시작
npm run dev
```

---

## 📦 보일러플레이트 패키지

### 폴더 구조

```
your-new-project/
├── components/
│   └── footer/                      ⭐ 필수 복사
│       ├── footer-component.js     # 푸터 로직 (수정 금지)
│       ├── footer-config.js        # 푸터 설정 (수정 대상)
│       ├── footer.css              # 푸터 스타일 (수정 금지)
│       └── README.md               # 푸터 가이드
│
├── js/
│   └── supabase-client.js          ⭐ 필수 복사 (수정 금지)
│
├── .env.example                     ⭐ 필수 복사 → .env로 이름 변경
├── package.json                     ⭐ 필수 복사 → 내용 수정
├── index.html                       ⭐ 필수 복사 → 내용 수정
│
└── supabase/migrations/             ⚠️ 선택 (DB 사용 시)
```

### 최소 의존성

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## ⚙️ 설정 가이드

### STEP 1: 프로젝트 초기화

#### 1-1. package.json 수정

```json
{
  "name": "{{PROJECT_NAME}}",
  "version": "{{PROJECT_VERSION}}",
  "description": "{{PROJECT_DESCRIPTION}}",
  "main": "index.html",
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  },
  "keywords": ["{{KEYWORD_1}}", "{{KEYWORD_2}}", "{{KEYWORD_3}}"],
  "author": "{{AUTHOR_NAME}}",
  "license": "MIT"
}
```

#### 1-2. 변수 치환 예시

```json
{
  "name": "my-portfolio",
  "version": "1.0.0",
  "description": "김철수의 포트폴리오 웹사이트",
  "keywords": ["portfolio", "developer", "frontend"],
  "author": "김철수"
}
```

---

### STEP 2: 환경 변수 설정

#### 2-1. .env 파일 생성

```bash
cp .env.example .env
```

#### 2-2. .env 파일 수정

```bash
# Supabase 설정
VITE_SUPABASE_URL={{YOUR_SUPABASE_URL}}
VITE_SUPABASE_ANON_KEY={{YOUR_SUPABASE_ANON_KEY}}
```

#### 2-3. Supabase 프로젝트 생성

1. https://supabase.com 에서 프로젝트 생성
2. Settings → API 메뉴로 이동
3. `Project URL` 복사 → `VITE_SUPABASE_URL`에 붙여넣기
4. `anon public` 키 복사 → `VITE_SUPABASE_ANON_KEY`에 붙여넣기

---

### STEP 3: 푸터 설정 커스터마이징

#### 3-1. footer-config.js 파일 열기

```javascript
// components/footer/footer-config.js

export const FOOTER_CONFIG = {
    title: "{{PROJECT_TITLE}}",
    copyright: "{{COPYRIGHT_TEXT}}",

    sections: [
        {
            id: "contact",
            type: "contact",
            title: "{{CONTACT_SECTION_TITLE}}",
            author: "{{AUTHOR_NAME}}",
            tagline: "{{AUTHOR_TAGLINE}}",
            contacts: [
                {
                    type: "email",
                    label: "{{EMAIL_LABEL}}",
                    value: "{{YOUR_EMAIL}}"
                },
                {
                    type: "link",
                    label: "{{SNS_1_LABEL}}",
                    value: "{{SNS_1_HANDLE}}",
                    url: "{{SNS_1_URL}}"
                }
            ]
        },
        {
            id: "subscription",
            type: "subscription",
            title: "{{SUBSCRIPTION_TITLE}}",
            description: "{{SUBSCRIPTION_DESCRIPTION}}",
            subscription: {
                title: "{{SUBSCRIPTION_FORM_TITLE}}",
                benefits: [
                    "{{BENEFIT_1}}",
                    "{{BENEFIT_2}}",
                    "{{BENEFIT_3}}"
                ],
                placeholder: "{{EMAIL_PLACEHOLDER}}",
                button: "{{SUBSCRIBE_BUTTON_TEXT}}"
            }
        }
    ]
};
```

#### 3-2. 변수 치환 예시

```javascript
export const FOOTER_CONFIG = {
    title: "김철수의 포트폴리오",
    copyright: "© 2025 김철수. All rights reserved.",

    sections: [
        {
            id: "contact",
            type: "contact",
            title: "🏠 연락처",
            author: "김철수",
            tagline: "프론트엔드 개발자",
            contacts: [
                {
                    type: "email",
                    label: "이메일",
                    value: "hello@kimcs.com"
                },
                {
                    type: "link",
                    label: "GitHub",
                    value: "@kimcs",
                    url: "https://github.com/kimcs"
                }
            ]
        },
        {
            id: "subscription",
            type: "subscription",
            title: "🚀 뉴스레터",
            description: "최신 개발 소식을 받아보세요!",
            subscription: {
                title: "구독하기",
                benefits: [
                    "매주 개발 팁 공유",
                    "새로운 프로젝트 소식",
                    "특별 이벤트 안내"
                ],
                placeholder: "이메일 주소를 입력하세요",
                button: "구독하기"
            }
        }
    ]
};
```

---

### STEP 4: 첫 페이지 생성

#### 4-1. index.html 수정

`index.html` 파일을 열고 다음 부분을 수정하세요:

##### A. SEO 메타 정보 수정

```html
<head>
    <!-- ⭐ 여기를 수정하세요 -->
    <title>{{SITE_TITLE}}</title>
    <meta name="description" content="{{SITE_DESCRIPTION}}">
    <meta name="keywords" content="{{KEYWORD_1}}, {{KEYWORD_2}}, {{KEYWORD_3}}">

    <!-- Open Graph -->
    <meta property="og:title" content="{{OG_TITLE}}">
    <meta property="og:description" content="{{OG_DESCRIPTION}}">
    <meta property="og:site_name" content="{{SITE_NAME}}">

    <!-- Author -->
    <meta name="author" content="{{AUTHOR_NAME}}">
</head>
```

##### B. 헤더 수정

```html
<header class="header">
    <div class="container">
        <div class="header-content">
            <!-- ⭐ 여기를 수정하세요 -->
            <a href="{{EXTERNAL_LINK}}" class="header-link">{{LINK_TEXT}}</a>
            <h1>{{PAGE_TITLE}}</h1>
            <p>{{PAGE_DESCRIPTION}}</p>
        </div>
    </div>
</header>
```

##### C. 본문 수정

```html
<main class="main">
    <div class="container">
        <!-- ⭐ 여기에 페이지 콘텐츠를 작성하세요 -->
        <h2>{{SECTION_TITLE}}</h2>
        <p>{{SECTION_CONTENT}}</p>
    </div>
</main>
```

##### D. 푸터 및 JavaScript (수정 금지)

```html
<!-- ❌ 아래 코드는 수정하지 마세요 -->
<footer class="footer"></footer>

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

        // ⭐ 여기에 페이지별 JavaScript 코드를 추가하세요
    });
</script>
```

---

## 📝 템플릿 파일

### 1. package.json 템플릿 (복사용)

```json
{
  "name": "my-new-project",
  "version": "1.0.0",
  "description": "나의 새로운 프로젝트",
  "main": "index.html",
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  },
  "keywords": ["project", "web", "app"],
  "author": "Your Name",
  "license": "MIT"
}
```

---

### 2. .env 템플릿 (복사용)

```bash
# Supabase 설정
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# 사용법:
# 1. https://supabase.com 에서 프로젝트 생성
# 2. Settings → API 메뉴에서 URL과 Key 복사
# 3. 위 값을 실제 값으로 교체
# 4. .env 파일은 절대 Git에 커밋하지 마세요!
```

---

### 3. index.html 템플릿 (복사용)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나의 프로젝트</title>
    <meta name="description" content="프로젝트 설명">
    <meta name="keywords" content="키워드1, 키워드2">
    <meta name="author" content="Your Name">

    <!-- Footer Component CSS -->
    <link rel="stylesheet" href="./components/footer/footer.css">

    <!-- Supabase CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <style>
        /* CSS Variables */
        :root {
            --primary-gradient: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
            --secondary-gradient: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
            --success-gradient: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
            --text-primary: #333;
            --text-secondary: #666;
            --background-main: #f8fafc;
            --background-card: #ffffff;
            --shadow-soft: 0 15px 35px rgba(0, 0, 0, 0.1);
            --font-main: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-main);
            font-size: 14px;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--background-main);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header */
        .header {
            background: var(--primary-gradient);
            color: white;
            padding: 60px 0;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        /* Main */
        .main {
            padding: 60px 0;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1>🚀 나의 프로젝트</h1>
                <p>프로젝트 설명을 입력하세요</p>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <h2>콘텐츠 제목</h2>
            <p>여기에 콘텐츠를 작성하세요.</p>
        </div>
    </main>

    <!-- Footer (자동 생성) -->
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

            // 페이지별 JavaScript 코드
            console.log('페이지 로드 완료');
        });
    </script>
</body>
</html>
```

---

### 4. footer-config.js 템플릿 (복사용)

```javascript
// 푸터 컴포넌트 설정
export const FOOTER_CONFIG = {
    title: "나의 프로젝트",
    copyright: "© 2025 나의 프로젝트. All rights reserved.",

    sections: [
        {
            id: "contact",
            type: "contact",
            title: "🏠 연락처",
            author: "Your Name",
            tagline: "당신의 한 줄 소개",
            contacts: [
                {
                    type: "email",
                    label: "이메일",
                    value: "your@email.com"
                },
                {
                    type: "link",
                    label: "웹사이트",
                    value: "yourwebsite.com",
                    url: "https://yourwebsite.com"
                }
            ]
        },
        {
            id: "subscription",
            type: "subscription",
            title: "🚀 뉴스레터",
            description: "최신 소식을 받아보세요!",
            subscription: {
                title: "구독하기",
                benefits: [
                    "최신 콘텐츠 업데이트",
                    "특별 이벤트 안내",
                    "유용한 정보 제공"
                ],
                placeholder: "이메일 주소를 입력하세요",
                button: "구독하기"
            }
        }
    ]
};
```

---

## 🔧 커스터마이징 포인트

### 필수 변수 목록

#### 프로젝트 메타 정보

| 변수 | 설명 | 예시 |
|------|------|------|
| `{{PROJECT_NAME}}` | 프로젝트 이름 (영문, 소문자, 하이픈) | `my-portfolio` |
| `{{PROJECT_VERSION}}` | 프로젝트 버전 | `1.0.0` |
| `{{PROJECT_DESCRIPTION}}` | 프로젝트 설명 | `김철수의 포트폴리오` |
| `{{AUTHOR_NAME}}` | 제작자 이름 | `김철수` |
| `{{KEYWORDS}}` | SEO 키워드 (쉼표 구분) | `portfolio, developer, frontend` |

#### Supabase 설정

| 변수 | 설명 | 위치 |
|------|------|------|
| `{{SUPABASE_URL}}` | Supabase 프로젝트 URL | Supabase Dashboard → Settings → API |
| `{{SUPABASE_ANON_KEY}}` | Supabase Anon Key | Supabase Dashboard → Settings → API |

#### 푸터 설정

| 변수 | 설명 | 예시 |
|------|------|------|
| `{{PROJECT_TITLE}}` | 푸터 제목 | `김철수의 포트폴리오` |
| `{{COPYRIGHT_TEXT}}` | 저작권 문구 | `© 2025 김철수. All rights reserved.` |
| `{{AUTHOR_TAGLINE}}` | 제작자 한 줄 소개 | `프론트엔드 개발자` |
| `{{YOUR_EMAIL}}` | 이메일 주소 | `hello@kimcs.com` |
| `{{SNS_LABEL}}` | SNS 라벨 | `GitHub`, `Instagram` |
| `{{SNS_URL}}` | SNS 주소 | `https://github.com/kimcs` |

#### 페이지 메타 정보

| 변수 | 설명 | 예시 |
|------|------|------|
| `{{SITE_TITLE}}` | 사이트 제목 (브라우저 탭) | `김철수 포트폴리오` |
| `{{SITE_DESCRIPTION}}` | 사이트 설명 (SEO) | `프론트엔드 개발자 김철수의 포트폴리오` |
| `{{PAGE_TITLE}}` | 페이지 제목 (H1) | `🚀 환영합니다` |
| `{{PAGE_DESCRIPTION}}` | 페이지 설명 (부제목) | `저의 작업물을 만나보세요` |

---

## 💡 프로젝트 타입별 예시

### 예시 1: 블로그/포트폴리오 사이트

#### package.json
```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "description": "개발자 블로그",
  "author": "홍길동",
  "keywords": ["blog", "developer", "tech"]
}
```

#### footer-config.js
```javascript
export const FOOTER_CONFIG = {
    title: "Tech Blog",
    copyright: "© 2025 홍길동. All rights reserved.",
    sections: [
        {
            id: "about",
            type: "list",
            title: "📚 About",
            items: [
                "풀스택 개발자",
                "오픈소스 기여자",
                "기술 블로거"
            ]
        },
        {
            id: "social",
            type: "contact",
            title: "🔗 Social",
            author: "홍길동",
            tagline: "코드로 세상을 바꾸는 개발자",
            contacts: [
                { type: "link", label: "GitHub", value: "@gildong", url: "https://github.com/gildong" },
                { type: "link", label: "LinkedIn", value: "홍길동", url: "https://linkedin.com/in/gildong" }
            ]
        }
    ]
};
```

---

### 예시 2: 학습 도구/튜토리얼 사이트

#### package.json
```json
{
  "name": "react-tutorial",
  "version": "1.0.0",
  "description": "React 기초 튜토리얼",
  "author": "김튜터",
  "keywords": ["react", "tutorial", "learning"]
}
```

#### footer-config.js
```javascript
export const FOOTER_CONFIG = {
    title: "React 튜토리얼",
    copyright: "© 2025 React 튜토리얼. 학습 목적으로 제작되었습니다.",
    sections: [
        {
            id: "lessons",
            type: "list",
            title: "📖 학습 과정",
            items: [
                "React 기초",
                "컴포넌트 만들기",
                "상태 관리",
                "라우팅"
            ]
        },
        {
            id: "subscription",
            type: "subscription",
            title: "🚀 학습 소식 받기",
            description: "새로운 튜토리얼을 가장 먼저 받아보세요!",
            subscription: {
                title: "이메일 구독",
                benefits: [
                    "신규 튜토리얼 알림",
                    "학습 팁 공유",
                    "Q&A 세션 초대"
                ],
                placeholder: "이메일을 입력하세요",
                button: "구독하기"
            }
        }
    ]
};
```

---

### 예시 3: 랜딩 페이지

#### package.json
```json
{
  "name": "product-landing",
  "version": "1.0.0",
  "description": "혁신적인 제품 소개",
  "author": "스타트업XYZ",
  "keywords": ["product", "saas", "landing"]
}
```

#### footer-config.js
```javascript
export const FOOTER_CONFIG = {
    title: "ProductX",
    copyright: "© 2025 스타트업XYZ. All rights reserved.",
    sections: [
        {
            id: "product",
            type: "list",
            title: "🎯 제품",
            items: [
                "기능 소개",
                "가격 정책",
                "고객 후기",
                "FAQ"
            ]
        },
        {
            id: "company",
            type: "list",
            title: "🏢 회사",
            items: [
                "회사 소개",
                "팀 소개",
                "채용",
                "문의하기"
            ]
        },
        {
            id: "waitlist",
            type: "subscription",
            title: "🚀 얼리 액세스",
            description: "제품 출시 시 가장 먼저 알려드립니다!",
            subscription: {
                title: "대기자 명단 등록",
                benefits: [
                    "출시 알림",
                    "특별 할인",
                    "베타 테스터 기회"
                ],
                placeholder: "이메일 주소",
                button: "등록하기"
            }
        }
    ]
};
```

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

    /* 폰트 */
    --font-main: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --font-code: 'JetBrains Mono', monospace;
}
```

### 공통 클래스

```css
/* 컨테이너 */
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 버튼 */
.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--primary-gradient);
    color: white;
}

/* 카드 */
.card {
    background: var(--background-card);
    padding: 30px;
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
}

/* 폼 */
.form-group {
    margin-bottom: 20px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--border-light);
    border-radius: 8px;
    font-size: 14px;
}
```

---

## 🆘 문제 해결

### FAQ

#### Q1. 푸터가 나타나지 않아요

**해결 방법:**

```javascript
// 1. 브라우저 콘솔 확인 (F12)
// 2. Supabase 초기화 확인
const supabaseInitialized = initializeSupabase();
console.log('Supabase 초기화:', supabaseInitialized);

// 3. .env 파일 확인
// VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY가 올바른지 확인
```

#### Q2. 구독 기능이 작동하지 않아요

**해결 방법:**

1. Supabase에 `subscribers` 테이블이 생성되어 있는지 확인
2. RLS 정책이 설정되어 있는지 확인
3. 마이그레이션 실행: `supabase/migrations/` 폴더 확인

#### Q3. 스타일이 깨져요

**해결 방법:**

```html
<!-- CSS 파일 경로 확인 -->
<link rel="stylesheet" href="./components/footer/footer.css">

<!-- 상대 경로가 올바른지 확인 -->
<!-- 프로젝트 루트에서 실행하고 있는지 확인 -->
```

#### Q4. 빌드가 실패해요

**해결 방법:**

```bash
# 1. node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 2. Vite 버전 확인
npm list vite

# 3. 빌드 재시도
npm run build
```

---

### 트러블슈팅 체크리스트

```
환경 설정
✅ .env 파일이 존재하는가?
✅ VITE_SUPABASE_URL이 올바른가?
✅ VITE_SUPABASE_ANON_KEY가 올바른가?

파일 구조
✅ components/footer/ 폴더가 존재하는가?
✅ js/supabase-client.js 파일이 존재하는가?
✅ package.json이 올바르게 설정되어 있는가?

의존성
✅ npm install을 실행했는가?
✅ @supabase/supabase-js가 설치되었는가?
✅ vite가 설치되었는가?

코드
✅ import 경로가 올바른가?
✅ type="module" 속성이 있는가?
✅ 푸터 초기화 코드가 있는가?
```

---

## 🚀 고급 사용법

### 여러 페이지 추가하기

#### 1. 새 페이지 생성

```bash
# index.html을 복사하여 새 페이지 생성
cp index.html about.html
```

#### 2. 페이지 수정

```html
<!-- about.html -->
<head>
    <title>About - 나의 프로젝트</title>
    <meta name="description" content="나의 프로젝트 소개">
</head>

<body>
    <header class="header">
        <h1>📝 About</h1>
        <p>프로젝트 소개 페이지</p>
    </header>

    <main class="main">
        <!-- 새로운 콘텐츠 -->
    </main>

    <!-- 푸터는 그대로 유지 -->
    <footer class="footer"></footer>

    <!-- JavaScript도 그대로 유지 -->
    <script type="module">
        // 동일한 초기화 코드
    </script>
</body>
```

---

### 푸터 섹션 타입 상세 가이드

#### 1. contact (연락처)

```javascript
{
    id: "contact",
    type: "contact",
    title: "🏠 연락처",
    author: "이름",
    tagline: "한 줄 소개",
    contacts: [
        { type: "email", label: "이메일", value: "your@email.com" },
        { type: "link", label: "웹사이트", value: "example.com", url: "https://example.com" }
    ]
}
```

#### 2. subscription (구독 폼)

```javascript
{
    id: "subscription",
    type: "subscription",
    title: "🚀 뉴스레터",
    description: "설명 텍스트",
    subscription: {
        title: "구독하기",
        benefits: ["혜택1", "혜택2", "혜택3"],
        placeholder: "이메일 주소",
        button: "구독하기"
    }
}
```

#### 3. list (일반 리스트)

```javascript
{
    id: "links",
    type: "list",
    title: "📚 링크",
    items: [
        "항목 1",
        "항목 2",
        "항목 3"
    ]
}
```

#### 4. tech (기술 스택)

```javascript
{
    id: "tech",
    type: "tech",
    title: "💻 기술 스택",
    description: "사용 기술",
    items: [
        { icon: "⚛️", name: "React" },
        { icon: "🎨", name: "CSS3" },
        { icon: "🔥", name: "Firebase" }
    ]
}
```

---

### 여러 푸터 설정 관리하기

#### 방법 1: 조건부 export

```javascript
// footer-config.js
const BLOG_CONFIG = { /* 블로그용 설정 */ };
const PORTFOLIO_CONFIG = { /* 포트폴리오용 설정 */ };

// 환경에 따라 다른 설정 사용
export const FOOTER_CONFIG =
    import.meta.env.MODE === 'blog'
        ? BLOG_CONFIG
        : PORTFOLIO_CONFIG;
```

#### 방법 2: 별도 파일

```javascript
// footer-config-blog.js
export const FOOTER_CONFIG = { /* 블로그용 */ };

// footer-config-portfolio.js
export const FOOTER_CONFIG = { /* 포트폴리오용 */ };

// index.html에서 선택적으로 import
import { FOOTER_CONFIG } from './components/footer/footer-config-blog.js';
```

---

## 📚 추가 리소스

- **푸터 컴포넌트 상세 가이드**: `components/footer/README.md`
- **Supabase 공식 문서**: https://supabase.com/docs
- **Vite 공식 문서**: https://vitejs.dev

---

## 🎯 최종 체크리스트

새 프로젝트를 시작하기 전 다음을 확인하세요:

```
파일 복사
✅ components/footer/ 폴더 복사
✅ js/supabase-client.js 파일 복사
✅ .env.example 파일 복사 → .env로 이름 변경
✅ package.json 파일 복사
✅ index.html 파일 복사

설정 변경
✅ package.json에서 프로젝트 정보 수정
✅ .env에서 Supabase URL/Key 입력
✅ footer-config.js에서 푸터 내용 수정
✅ index.html에서 메타 정보 수정
✅ index.html에서 헤더/본문 수정

의존성 설치
✅ npm install 실행

테스트
✅ npm run dev 실행
✅ 브라우저에서 localhost 열기
✅ 푸터가 정상적으로 나타나는지 확인
✅ 구독 기능이 작동하는지 확인

빌드
✅ npm run build 실행
✅ 빌드 성공 확인
```

---

**버전**: v2.0.0 (보일러플레이트 버전)
**마지막 업데이트**: 2025-01-23
**제작**: 바이브코드제로 (김로린)

---

## 💬 피드백

이 가이드가 도움이 되셨나요? 개선 사항이나 질문이 있다면 언제든지 연락해주세요!
