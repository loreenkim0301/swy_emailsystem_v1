/*
  # 피그마 가이드 블로그 포스트 업데이트

  1. 변경사항
    - 제목: "[피그마] 컴포넌트, 스타일, 변수까지 : 실용적가이드"
    - URL: https://brunch.co.kr/@loreenkim/42
    - 피그마 관련 키워드로 업데이트
    - 설명과 내용을 피그마 실무 가이드에 맞게 수정

  2. 업데이트 대상
    - 기존 블로그 포스트 중 하나를 피그마 가이드로 변경
*/

-- 적절한 블로그 포스트를 피그마 가이드로 업데이트 (ID 202 사용)
UPDATE blogs 
SET 
  title = '[피그마] 컴포넌트, 스타일, 변수까지 : 실용적가이드',
  description = '피그마의 핵심 기능인 컴포넌트, 스타일, 변수를 실무에서 효율적으로 활용하는 방법을 알아봅시다. 디자인 시스템 구축부터 협업까지 실용적인 노하우를 제공합니다.',
  content = '피그마를 단순한 디자인 도구가 아닌 체계적인 디자인 시스템 구축 도구로 활용하는 방법을 다룹니다. 컴포넌트 설계 원칙, 스타일 가이드 작성법, 변수를 활용한 효율적인 디자인 관리 방법을 실무 경험을 바탕으로 소개합니다.',
  keywords = ARRAY['figma', 'design-system', 'component', 'style-guide', 'variables', 'ui-design'],
  slug = 'figma-practical-guide-components-styles-variables',
  meta_title = '[피그마] 컴포넌트, 스타일, 변수 실용적 가이드',
  meta_description = '피그마 컴포넌트, 스타일, 변수를 실무에서 효율적으로 활용하는 실용적 노하우',
  url = 'https://brunch.co.kr/@loreenkim/42',
  updated_at = NOW()
WHERE id = 202;