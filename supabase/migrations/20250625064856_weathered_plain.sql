/*
  # ID 201 블로그 포스트 업데이트

  1. 변경 내용
    - 제목: "JavaScript로 이메일 보내기 튜토리얼" → "기획자도 할 수 있는 AI 코딩 입문"
    - 설명: EmailJS 관련 내용 → AI 코딩 입문 가이드로 변경
    - URL: 실제 브런치 링크로 업데이트
    - 키워드: AI 코딩, 기획자, 입문 관련으로 변경
    - 메타 정보: SEO 최적화된 내용으로 업데이트

  2. 보안
    - 기존 데이터 보존을 위해 UPDATE 사용
    - WHERE 조건으로 정확한 레코드만 수정
*/

-- ID 201 블로그 포스트 정보 업데이트
UPDATE blogs 
SET 
  title = '기획자도 할 수 있는 AI 코딩 입문',
  description = '코딩을 모르는 기획자도 AI 도구를 활용해 실제 웹 애플리케이션을 만들 수 있는 시대입니다. 실무 경험을 바탕으로 한 AI 코딩 입문 가이드를 소개합니다.',
  content = '비개발자도 AI 코딩 도구를 활용해 실제 서비스를 개발할 수 있는 방법을 단계별로 안내합니다. Bolt.new, Claude, ChatGPT 등 다양한 AI 도구를 활용한 실무 경험담과 노하우를 공유합니다.',
  keywords = ARRAY['ai-coding', 'planner', 'beginner', 'bolt.new', 'claude', 'no-code'],
  slug = 'planner-ai-coding-beginner-guide',
  meta_title = '기획자를 위한 AI 코딩 입문 완벽 가이드',
  meta_description = '코딩 몰라도 OK! 기획자가 AI 도구로 웹 애플리케이션 만드는 실무 노하우',
  url = 'https://brunch.co.kr/@loreenkim/45',
  updated_at = NOW()
WHERE id = 201;