// 푸터 컴포넌트 설정 파일
// 다른 프로젝트에서 이 설정만 변경하면 재사용 가능

export const FOOTER_CONFIG = {
    // 기본 설정
    title: "EmailJS 학습 도구",
    copyright: "© 2025 EmailJS 학습 도구. 학습 목적으로 제작된 오픈소스 프로젝트입니다.",
    
    // 섹션 구성
    sections: [
        {
            id: "contact",
            type: "contact",
            title: "🏠 제작자 정보",
            author: "AI코딩하는 김로린 기획자",
            tagline: "기획자와 디자이너도 할 수 있는 AI코딩의 가능성",
            contacts: [
                {
                    type: "email",
                    label: "업무/광고",
                    value: "loreen@selectway.co.kr"
                },
                {
                    type: "link",
                    label: "인스타그램",
                    value: "@loreenkim.ceo",
                    url: "https://www.instagram.com/loreenkim.ceo/"
                },
                {
                    type: "link",
                    label: "브런치",
                    value: "@loreenkim",
                    url: "https://brunch.co.kr/@loreenkim/"
                }
            ]
        },
        {
            id: "subscription",
            type: "subscription",
            title: "🚀 바이브코드제로 클럽",
            description: "기획자, 디자이너라면 바이브코드제로 멤버가 될 수 있어요!",
            subscription: {
                title: "최신 소식 받아보기",
                benefits: [
                    "기획자/디자이너를 위한 AI특강",
                    "최신 기술 사용 리뷰 및 인사이트",
                    "바이브코드제로 신규 모집 소식"
                ],
                placeholder: "이메일 주소를 입력하세요",
                button: "구독하기"
            }
        }
    ]
};

// 다른 프로젝트용 설정 예시
export const PORTFOLIO_FOOTER_CONFIG = {
    title: "포트폴리오 사이트",
    copyright: "© 2025 포트폴리오. All rights reserved.",
    sections: [
        {
            id: "about",
            type: "list", 
            title: "🎯 About Me",
            items: [
                "Frontend Developer",
                "UI/UX Designer",
                "Creative Problem Solver"
            ]
        },
        {
            id: "skills",
            type: "tech",
            title: "💻 Skills",
            description: "기술 스택",
            items: [
                { icon: "⚛️", name: "React" },
                { icon: "🎨", name: "CSS3" },
                { icon: "📱", name: "React Native" }
            ]
        }
    ]
};