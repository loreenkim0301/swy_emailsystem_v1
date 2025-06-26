// Related Content 설정
export const RELATED_CONTENT_CONFIG = {
    sections: [
        {
            id: 'websites',
            title: '🔧 더 많은 학습 도구',
            category: 'website',
            limit: 6,
            showComingSoon: true,
            template: 'card-grid'
        },
        {
            id: 'blogs', 
            title: '📚 바이브코딩 인사이트',
            category: 'blog',
            limit: 6,
            showComingSoon: true,
            template: 'card-grid'
        }
    ],
    layout: {
        type: 'grid',
        responsive: true,
        breakpoints: {
            mobile: 1,
            tablet: 2, 
            desktop: 4
        }
    },
    animation: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out'
    }
};