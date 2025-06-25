/*
  # ID 201 블로그 포스트 정확한 업데이트

  1. 변경 내용
    - 제목: "[바이브코딩] 1.Bolt.new로 이메일 발송 개발하기"로 변경
    - 설명: Bolt.new를 활용한 이메일 발송 기능 개발에 대한 내용으로 변경
    - 키워드: AI 코딩과 EmailJS 관련 키워드로 업데이트
    - URL: 실제 브런치 링크로 연결

  2. 보안
    - WHERE 조건으로 정확한 레코드만 수정
    - 기존 데이터 무결성 보장
*/

-- ID 201 블로그 포스트 정보를 실제 브런치 아티클에 맞게 업데이트
UPDATE blogs 
SET 
  title = '[바이브코딩] 1.Bolt.new로 이메일 발송 개발하기',
  description = 'Bolt.new를 활용해서 이메일 발송 기능을 개발하는 방법을 단계별로 알아봅시다. AI 코딩 도구로 EmailJS를 활용한 실무 개발 과정을 소개합니다.',
  content = 'AI 코딩 도구 Bolt.new를 사용해서 EmailJS 라이브러리를 활용한 이메일 발송 기능을 개발하는 전체 과정을 다룹니다. 기획자도 따라할 수 있는 단계별 가이드와 실무 노하우를 제공합니다.',
  keywords = ARRAY['ai-coding', 'beginner', 'bolt.new', 'emailJS', 'API', 'no-code'],
  slug = 'vibecoding-bolt-email-development',
  meta_title = '[바이브코딩] Bolt.new로 이메일 발송 개발하기',
  meta_description = 'AI 코딩 도구 Bolt.new로 EmailJS를 활용한 이메일 발송 기능 개발 가이드',
  url = 'https://brunch.co.kr/@loreenkim/45',
  updated_at = NOW()
WHERE id = 201;