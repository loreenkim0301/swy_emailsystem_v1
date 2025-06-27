// 연관 콘텐츠 컴포넌트 설정 파일
// 다른 프로젝트에서 이 설정만 변경하면 재사용 가능

export const RELATED_CONTENT_CONFIG = {
    // 기본 설정
    title: "🔧 더 많은 콘텐츠 나아가기",
    
    // 섹션 구성
    sections: [
        {
            id: "websites",
            title: "🔧 더 많은 학습 도구",
            category: "website",
            limit: 6,
            showComingSoon: true,
            sortBy: "id", // id, created_at, title, view_count
            sortOrder: "desc" // asc, desc
        },
        {
            id: "blogs",
            title: "📚 바이브코딩 인사이트", 
            category: "blog",
            limit: 6,
            showComingSoon: true,
            sortBy: "id",
            sortOrder: "desc"
        }
    ],
    
    // 상태 텍스트 매핑
    statusText: {
        'published': '공개됨',
        'coming-soon': '출시 예정',
        'preparing': '준비 중',
        'draft': '초안'
    },
    
    // 링크 텍스트
    linkText: {
        available: '자세히 보기',
        unavailable: '출시 예정'
    },
    
    // 로딩/에러 메시지
    messages: {
        loading: '콘텐츠를 불러오는 중...',
        error: '콘텐츠를 불러오는데 실패했습니다.',
        empty: '표시할 콘텐츠가 없습니다.'
    }
};

// 다른 프로젝트용 설정 예시들

// 포트폴리오 프로젝트용
export const PORTFOLIO_RELATED_CONFIG = {
    title: "🚀 관련 프로젝트",
    sections: [
        {
            id: "projects",
            title: "💼 포트폴리오 프로젝트",
            category: "project",
            limit: 4,
            showComingSoon: false,
            sortBy: "created_at",
            sortOrder: "desc"
        },
        {
            id: "articles",
            title: "📝 기술 아티클",
            category: "article", 
            limit: 4,
            showComingSoon: true,
            sortBy: "view_count",
            sortOrder: "desc"
        }
    ],
    statusText: {
        'published': 'Live',
        'coming-soon': 'Coming Soon',
        'preparing': 'In Progress'
    },
    linkText: {
        available: 'View Project',
        unavailable: 'Coming Soon'
    }
};

// 블로그 프로젝트용
export const BLOG_RELATED_CONFIG = {
    title: "📚 추천 글",
    sections: [
        {
            id: "popular",
            title: "🔥 인기 글",
            category: "blog",
            limit: 3,
            showComingSoon: false,
            sortBy: "view_count",
            sortOrder: "desc"
        },
        {
            id: "recent",
            title: "🆕 최신 글",
            category: "blog",
            limit: 3,
            showComingSoon: false,
            sortBy: "created_at", 
            sortOrder: "desc"
        }
    ]
};

// 학습 플랫폼용
export const LEARNING_RELATED_CONFIG = {
    title: "📖 추천 학습 자료",
    sections: [
        {
            id: "courses",
            title: "🎓 강의",
            category: "course",
            limit: 4,
            showComingSoon: true,
            sortBy: "created_at",
            sortOrder: "desc"
        },
        {
            id: "tutorials",
            title: "📝 튜토리얼",
            category: "tutorial",
            limit: 4,
            showComingSoon: true,
            sortBy: "created_at",
            sortOrder: "desc"
        }
    ]
};