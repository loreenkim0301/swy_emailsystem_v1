# 보안 강화된 이메일 발송 시스템

EmailJS를 사용한 안전한 이메일 발송 시스템입니다.

## 🔒 보안 특징

- **민감한 정보 보호**: API 키, 서비스 ID 등이 코드에 하드코딩되지 않음
- **로컬 저장**: 설정 정보는 사용자의 브라우저에만 저장됨
- **설정 분리**: 실제 설정값은 별도로 관리

## 🚀 사용 방법

### 1. EmailJS 설정 준비
1. [EmailJS](https://www.emailjs.com/) 계정 생성
2. 서비스 및 템플릿 설정
3. Public Key, Service ID, Template ID 확인

### 2. 웹페이지 설정
1. `email_sender.html` 파일을 브라우저에서 열기
2. 설정 폼에 EmailJS 정보 입력:
   - Public Key
   - Service ID  
   - Template ID
   - 받을 이메일 주소
3. "설정 저장" 클릭

### 3. 이메일 발송
설정 완료 후 이메일 발송 폼이 나타나며, 일반적인 이메일 발송이 가능합니다.

## 📁 파일 구조

```
├── email_sender.html          # 메인 이메일 발송 페이지
├── config.example.js          # 설정 예시 파일
└── README.md                  # 프로젝트 설명서
```

## 🛡️ 보안 고려사항

- 설정 정보는 localStorage에 저장되어 해당 브라우저에서만 접근 가능
- 실제 배포 시에는 HTTPS 사용 권장
- 정기적으로 EmailJS 키 갱신 권장

## 🔧 개발자 도구

브라우저 콘솔에서 다음 명령어 사용 가능:
```javascript
// 저장된 설정 초기화
resetEmailConfig();
```

## 📝 주의사항

- Public 저장소에 실제 API 키를 커밋하지 마세요
- `config.example.js`는 예시 파일이므로 실제 값으로 수정하여 사용하세요
- 프로덕션 환경에서는 추가적인 보안 조치를 고려하세요