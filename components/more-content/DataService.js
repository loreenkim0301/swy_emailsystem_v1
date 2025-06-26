/**
 * 데이터 서비스 인터페이스
 * 다른 프로젝트에서 구현해야 하는 인터페이스
 */
export class DataServiceInterface {
    async getContentByCategory(category, options) {
        throw new Error('getContentByCategory 메서드를 구현해야 합니다');
    }
}

/**
 * Supabase 데이터 서비스 구현체
 */
export class SupabaseDataService extends DataServiceInterface {
    constructor(supabaseClient) {
        super();
        this.supabaseClient = supabaseClient;
    }

    async getContentByCategory(category, options = {}) {
        const { limit = 6 } = options;

        try {
            let query = this.supabaseClient
                .from('blogs')
                .select('*')
                .eq('category', category)
                .in('status', ['published', 'coming-soon'])
                .order('created_at', { ascending: false });

            if (limit > 0) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            return {
                success: true,
                blogs: data || [],
                count: data?.length || 0
            };

        } catch (error) {
            console.error(`${category} 콘텐츠 조회 중 오류:`, error);
            return {
                success: false,
                error: error.message,
                blogs: []
            };
        }
    }
}

/**
 * 목업 데이터 서비스 (테스트용)
 */
export class MockDataService extends DataServiceInterface {
    constructor() {
        super();
        this.mockData = {
            website: [
                { 
                    id: 1, 
                    title: 'EmailJS 학습 도구', 
                    description: 'EmailJS를 쉽게 배울 수 있는 인터랙티브 학습 도구입니다.',
                    status: 'published',
                    url: 'https://example.com/emailjs'
                },
                { 
                    id: 2, 
                    title: 'OpenAI API 학습 도구', 
                    description: 'OpenAI API를 실습하며 배울 수 있는 학습 도구입니다.',
                    status: 'coming-soon',
                    url: null
                }
            ],
            blog: [
                { 
                    id: 3, 
                    title: '[바이브코딩] 2.Supabase로 데이터베이스 구축하기', 
                    description: 'Supabase를 활용한 실시간 데이터베이스 구축 과정을 상세히 다룹니다.',
                    status: 'published',
                    url: 'https://example.com/supabase'
                },
                { 
                    id: 4, 
                    title: '[바이브코딩] 1.Bolt.new로 이메일 발송 개발하기', 
                    description: 'Bolt.new를 활용해서 이메일 발송 기능을 개발하는 방법을 단계별로 알아봅시다.',
                    status: 'published',
                    url: 'https://example.com/bolt-email'
                }
            ]
        };
    }

    async getContentByCategory(category, options = {}) {
        const { limit = 6 } = options;
        
        // 실제 API 호출을 시뮬레이션하기 위한 지연
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data = this.mockData[category] || [];
        const limited = limit > 0 ? data.slice(0, limit) : data;
        
        return {
            success: true,
            blogs: limited,
            count: limited.length
        };
    }
}