# 📧 EmailJS 학습 도구

EmailJS를 배우고 테스트할 수 있는 단계별 학습 웹 애플리케이션입니다.

## 🎯 프로젝트 목적

**누구를 위해 만들었나요?**
- Bolt.new를 사용해서 이메일 발송 기능을 개발하고 싶은 분들
- EmailJS(외부 이메일 발송시스템)을 이해하고 테스트해보고 싶은 분들
- 웹 개발 초보자부터 전문가까지 누구나
- 실무에서 바로 사용할 수 있는 이메일 기능이 필요한 분들

## 🚀 개발 과정 & 기술적 진화

### 📅 **개발 타임라인**

#### **Phase 1: 기본 구조 (초기 버전)**
- **목표**: EmailJS 학습을 위한 단순한 웹 페이지
- **기술 스택**: HTML, CSS, Vanilla JavaScript
- **특징**: 
  - 3단계 학습 시스템 구축
  - 클라이언트 사이드 전용 처리
  - 보안 우선 설계 (메모리에서만 처리)

#### **Phase 2: 디자인 시스템 구축**
- **목표**: 전문적이고 모던한 UI/UX 구현
- **개선사항**:
  - **Pretendard 폰트** 도입 (한국어 최적화)
  - **JetBrains Mono** 코드 블록 전용 폰트
  - **반응형 그리드 시스템** (모바일 → 태블릿 → 데스크톱)
  - **다크 테마 푸터** 구현

#### **Phase 3: 백엔드 통합 (Node.js + SQLite)**
- **목표**: 구독자 관리 시스템 구축
- **기술 추가**:
  - **Express.js** 서버
  - **SQLite** 데이터베이스
  - **관리자 대시보드** 구현
  - **RESTful API** 설계

#### **Phase 4: 현대적 스택으로 마이그레이션 (현재)**
- **목표**: 확장 가능하고 안전한 아키텍처
- **주요 변경사항**:
  - **SQLite → Supabase PostgreSQL** 마이그레이션
  - **Express.js → Supabase Edge Functions** (서버리스)
  - **Vite** 빌드 도구 도입
  - **ES Modules** 모듈 시스템
  - **Row Level Security (RLS)** 보안 강화

### 🔄 **기술적 의사결정 과정**

#### **1. 데이터베이스 선택**
```
SQLite (로컬) → Supabase (클라우드)
```
**이유**: 
- 실시간 데이터베이스 필요
- 확장성과 보안 강화
- 서버리스 아키텍처 지향

#### **2. 빌드 도구 진화**
```
정적 파일 → Vite
```
**이유**:
- 빠른 개발 서버
- ES Modules 지원
- 현대적 개발 경험

#### **3. 보안 아키텍처**
```
클라이언트 전용 → 하이브리드 (클라이언트 + 서버리스)
```
**이유**:
- EmailJS 키는 여전히 클라이언트에서만 처리
- 구독자 데이터는 안전한 서버에서 관리
- RLS로 데이터 접근 제어

### 🛠️ **개발 도구 & 워크플로우**

#### **사용된 AI 도구**
- **Bolt.new**: 전체 프로젝트 개발 및 관리
- **Claude Sonnet 4**: 코드 작성 및 아키텍처 설계
- **실시간 협업**: AI와 인간의 페어 프로그래밍

#### **개발 워크플로우**
1. **요구사항 분석** → AI와 함께 기능 정의
2. **프로토타이핑** → 빠른 MVP 구현
3. **반복 개선** → 사용자 피드백 기반 개선
4. **기술 업그레이드** → 더 나은 기술 스택으로 마이그레이션

### 📊 **성능 최적화 과정**

#### **폰트 최적화**
- **Google Fonts** 사전 로딩
- **font-display: swap** 적용
- **한국어 특화** Pretendard 폰트 선택

#### **번들 최적화**
- **Vite** 트리 쉐이킹
- **ES Modules** 동적 임포트
- **CDN** 라이브러리 로딩

#### **데이터베이스 최적화**
- **인덱스** 최적화 (이메일, 날짜, 상태)
- **RLS 정책** 효율적 설계
- **페이지네이션** 구현

### 🔐 **보안 진화 과정**

#### **Phase 1: 기본 보안**
- 클라이언트 사이드 전용 처리
- 메모리에서만 데이터 보관

#### **Phase 2: 서버 보안**
- SQLite 파일 기반 저장
- 기본적인 입력 검증

#### **Phase 3: 엔터프라이즈 보안**
- **Supabase RLS** 적용
- **환경 변수** 관리
- **CORS** 정책 설정
- **SQL Injection** 방지

### 🎨 **디자인 시스템 발전**

#### **컬러 시스템**
```css
/* 초기: 단순한 그라데이션 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 현재: 체계적인 컬러 팔레트 */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-primary: #333;
  --text-secondary: #666;
  --background-card: #ffffff;
  --shadow-soft: 0 15px 35px rgba(0, 0, 0, 0.1);
}
```

#### **타이포그래피 시스템**
```css
/* 폰트 계층 구조 */
h1: 36px / 700 weight (헤드라인)
h2: 20px / 600 weight (섹션 제목)
body: 14px / 400 weight (본문)
code: JetBrains Mono (코드 블록)
```

#### **반응형 그리드**
```css
/* 모바일 퍼스트 접근 */
.grid {
  grid-template-columns: 1fr; /* 모바일 */
}

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); } /* 태블릿 */
}

@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); } /* 데스크톱 */
}
```

### 📈 **성장 지표**

#### **기술적 성장**
- **코드 품질**: 단일 파일 → 모듈화된 구조
- **성능**: 정적 → 최적화된 빌드 시스템
- **보안**: 기본 → 엔터프라이즈 수준
- **확장성**: 로컬 → 클라우드 네이티브

#### **사용자 경험 개선**
- **로딩 속도**: 즉시 → 최적화된 리소스 로딩
- **접근성**: 기본 → WCAG 가이드라인 준수
- **반응성**: 데스크톱 중심 → 모바일 퍼스트

### 🔮 **향후 계획**

#### **기술적 로드맵**
1. **TypeScript** 도입으로 타입 안전성 강화
2. **PWA** 기능 추가 (오프라인 지원)
3. **테스트 자동화** (Jest, Cypress)
4. **CI/CD** 파이프라인 구축

#### **기능 확장**
1. **다국어 지원** (i18n)
2. **테마 시스템** (라이트/다크 모드)
3. **고급 분석** 대시보드
4. **이메일 템플릿** 빌더

### 💡 **배운 교훈**

#### **기술적 교훈**
- **점진적 개선**이 혁신적 재작성보다 효과적
- **사용자 피드백**이 기술 선택의 핵심 지표
- **보안은 처음부터** 고려해야 하는 필수 요소

#### **AI 협업 교훈**
- **명확한 요구사항**이 AI 협업의 핵심
- **반복적 개선**을 통한 품질 향상
- **인간의 창의성 + AI의 효율성** = 최적의 결과

---

## ✨ 주요 특징

### 🔒 **개인정보 보호 우선**
- **사용자의 중요한 정보를 저장하지 않습니다**
- 입력하신 EmailJS 키와 ID는 서버에 전송되지 않습니다
- 모든 정보는 브라우저 메모리에서만 임시 사용됩니다
- 페이지를 새로고침하거나 닫으면 모든 정보가 완전히 삭제됩니다
- 안전한 학습 환경을 위해 설계되었습니다

### 📚 **단계별 학습 시스템**
1. **EmailJS 설정**: 계정 정보 입력 및 초기화
2. **연결 테스트**: 설정 검증 및 연결 상태 확인
3. **이메일 발송**: 실제 이메일 작성 및 발송 테스트

### 🎨 **모던한 디자인**
- **Pretendard 폰트**: 한국어에 최적화된 웹폰트 적용
- **JetBrains Mono**: 코드 블록 전용 개발자 친화적 폰트
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- **다크 테마 푸터**: 전문적이고 모던한 느낌

## 🚀 사용 방법

### 1단계: EmailJS 설정
1. [EmailJS 웹사이트](https://www.emailjs.com/)에서 계정 생성
2. 이메일 서비스 및 템플릿 설정
3. 웹 애플리케이션에서 다음 정보 입력:
   - **Public Key**: EmailJS Dashboard → Account → General에서 확인
   - **Service ID**: EmailJS Dashboard → Email Services에서 확인
   - **Template ID**: EmailJS Dashboard → Email Templates에서 확인
   - **받을 이메일 주소**: 테스트 이메일을 받을 주소

### 2단계: 연결 테스트
- 입력한 설정으로 EmailJS 연결 상태 확인
- 실제 테스트 이메일 발송으로 설정 검증
- 문제 발생 시 상세한 오류 메시지와 해결 가이드 제공

### 3단계: 이메일 발송
- **필수 정보**: 보내는 사람 이름, 이메일
- **선택 정보**: 제목, 내용 (비워두면 템플릿 기본값 사용)
- 실시간 발송 상태 확인 및 결과 피드백

## 🛠️ 기술 스택

### **프론트엔드**
- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 스타일링 (Grid, Flexbox, 애니메이션)
- **Vanilla JavaScript**: 순수 자바스크립트로 구현
- **EmailJS SDK**: 이메일 발송 라이브러리

### **백엔드 & 데이터베이스**
- **Supabase**: 실시간 데이터베이스 및 인증
- **PostgreSQL**: 구독자 데이터 저장
- **Row Level Security**: 데이터 보안

### **빌드 도구**
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **ES Modules**: 모던 JavaScript 모듈 시스템

### **폰트 및 디자인**
- **Pretendard**: 한국어 최적화 메인 폰트
- **JetBrains Mono**: 코드 블록 전용 폰트
- **Google Fonts**: 웹폰트 로딩 최적화

## 📱 반응형 지원

- **모바일** (< 768px): 세로 1열 배치
- **태블릿** (768px - 1024px): 2열 배치
- **데스크톱** (> 1024px): 4열 배치

## 🔧 개발 및 배포

### **환경 설정**

1. **환경 변수 설정**
   ```bash
   # .env.example을 .env로 복사
   cp .env.example .env
   
   # .env 파일에서 Supabase 정보 입력
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

### **로컬 개발**
```bash
# 개발 서버 실행
npm run dev
# 또는
npm start
```

### **빌드 및 배포**
```bash
# 빌드
npm run build

# 프리뷰
npm run preview
```

### **서버 포트**
- **개발 서버**: http://localhost:5173
- **프리뷰**: http://localhost:4173

## 🔒 보안 고려사항

### **환경 변수 관리**
- `.env` 파일은 **절대 Git에 커밋하지 마세요**
- `.env.example` 파일로 필요한 환경 변수 가이드 제공
- Supabase 키는 환경 변수로만 관리

### **Supabase 보안**
- **Row Level Security (RLS)** 활성화
- 익명 사용자는 구독만 가능
- 인증된 사용자만 관리 기능 접근

### **클라이언트 보안**
- EmailJS 키는 브라우저 메모리에서만 처리
- 페이지 새로고침 시 모든 정보 삭제
- 서버에 민감 정보 전송 안함

## 📝 EmailJS 템플릿 설정 가이드

EmailJS 템플릿에서 사용 가능한 변수들:

```javascript
// 필수 변수
{{name}}        // 보내는 사람 이름
{{email}}       // 보내는 사람 이메일

// 선택 변수 (비워두면 템플릿 기본값 사용)
{{subject}}     // 이메일 제목
{{message}}     // 이메일 내용

// 시스템 변수
{{to_email}}    // 받는 사람 이메일 (자동 설정)
```

### **템플릿 예시**
```html
제목: {{subject}}

안녕하세요,

{{name}} ({{email}})님으로부터 메시지가 도착했습니다:

{{message}}

---
EmailJS 학습 도구에서 발송됨
받는 사람: {{to_email}}
```

## 🔍 문제 해결 가이드

### **일반적인 문제들**

1. **EmailJS 라이브러리 로드 실패**
   - 네트워크 연결 확인
   - 브라우저 새로고침

2. **연결 테스트 실패**
   - Public Key 확인 (활성화 상태)
   - Service ID 정확성 확인
   - Template ID 정확성 확인
   - 도메인 허용 설정 확인

3. **이메일 발송 실패**
   - 템플릿 변수 설정 확인
   - 이메일 서비스 활성화 상태 확인
   - API 사용량 제한 확인

4. **Supabase 연결 실패**
   - 환경 변수 설정 확인
   - Supabase 프로젝트 상태 확인
   - RLS 정책 확인

### **디버깅 도구**
- 브라우저 개발자 도구 콘솔 확인
- 실시간 상태 메시지 모니터링
- 단계별 진행 상황 추적

## 🌟 추가 기능

### **바이브코드제로 클럽 구독**
- Supabase 기반 이메일 구독 시스템
- 실시간 데이터베이스 저장
- 구독자 관리 기능

### **보안 기능**
- 클라이언트 사이드 데이터만 처리
- 서버에 민감 정보 전송 안함
- 페이지 새로고침 시 데이터 완전 삭제

## 👩‍💻 제작자 정보

**AI코딩하는 김로린 기획자**
- 기획자와 디자이너도 할 수 있는 AI코딩의 가능성을 보여주는 프로젝트
- Instagram: [@loreenkim.ceo](https://www.instagram.com/loreenkim.ceo/)
- Brunch: [@loreenkim](https://brunch.co.kr/@loreenkim/)

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🤝 기여하기

이 프로젝트는 학습 목적으로 제작된 오픈소스입니다. 
개선 사항이나 버그 리포트는 언제든 환영합니다!

---

**📧 EmailJS 학습 도구로 이메일 발송 기능을 마스터하세요!**

## ⚠️ 보안 주의사항

**중요**: 이 프로젝트를 사용할 때는 반드시 다음 보안 수칙을 지켜주세요:

1. **환경 변수 사용**: API 키나 토큰을 코드에 직접 작성하지 마세요
2. **Git 관리**: `.env` 파일은 절대 Git에 커밋하지 마세요
3. **키 관리**: Supabase 키가 노출되면 즉시 재생성하세요
4. **접근 제한**: 프로덕션에서는 도메인 제한을 설정하세요