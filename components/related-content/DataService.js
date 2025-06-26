/**
 * 데이터 서비스 인터페이스 및 구현체
 * 다양한 데이터 소스를 지원하는 추상화 레이어
 */

/**
 * 데이터 서비스 인터페이스
 */
export class DataServiceInterface {
    /**
     * 카테고리별 콘텐츠 조회
     * @param {string} category 카테고리
     * @param {Object} options 옵션
     * @returns {Promise<Object>} 결과 객체
     */
    async getContentByCategory(category, options = {}) {
        throw new Error('getContentByCategory 메서드를 구현해야 합니다');
    }

    /**
     * ID로 콘텐츠 조회
     * @param {string|number} id 콘텐츠 ID
     * @returns {Promise<Object>} 결과 객체
     */
    async getContentById(id) {
        throw new Error('getContentById 메서드를 구현해야 합니다');
    }

    /**
     * 콘텐츠 검색
     * @param {string} query 검색어
     * @param {Object} options 옵션
     * @returns {Promise<Object>} 결과 객체
     */
    async searchContent(query, options = {}) {
        throw new Error('searchContent 메서드를 구현해야 합니다');
    }

    /**
     * 조회수 증가
     * @param {string|number} id 콘텐츠 ID
     * @returns {Promise<Object>} 결과 객체
     */
    async incrementViewCount(id) {
        throw new Error('incrementViewCount 메서드를 구현해야 합니다');
    }
}

/**
 * Supabase 데이터 서비스 구현체
 */
export class SupabaseDataService extends DataServiceInterface {
    constructor(supabaseClient) {
        super();
        this.client = supabaseClient;
        
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 필요합니다');
        }
    }

    /**
     * 카테고리별 콘텐츠 조회
     */
    async getContentByCategory(category, options = {}) {
        const {
            limit = 10,
            showComingSoon = true,
            status = null
        } = options;

        try {
            let query = this.client
                .from('blogs')
                .select('*')
                .eq('category', category)
                .order('created_at', { ascending: false });

            // 상태 필터링
            if (status) {
                if (Array.isArray(status)) {
                    query = query.in('status', status);
                } else {
                    query = query.eq('status', status);
                }
            } else if (showComingSoon) {
                query = query.in('status', ['published', 'coming-soon']);
            } else {
                query = query.eq('status', 'published');
            }

            // 제한
            if (limit > 0) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            return {
                success: true,
                data: data || [],
                count: data?.length || 0
            };

        } catch (error) {
            console.error('Supabase 데이터 조회 오류:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    /**
     * ID로 콘텐츠 조회
     */
    async getContentById(id) {
        try {
            const { data, error } = await this.client
                .from('blogs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('Supabase 콘텐츠 조회 오류:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    /**
     * 콘텐츠 검색
     */
    async searchContent(query, options = {}) {
        const {
            category = null,
            limit = 10,
            offset = 0
        } = options;

        try {
            let supabaseQuery = this.client
                .from('blogs')
                .select('*')
                .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (category) {
                supabaseQuery = supabaseQuery.eq('category', category);
            }

            if (limit > 0) {
                supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);
            }

            const { data, error } = await supabaseQuery;

            if (error) throw error;

            return {
                success: true,
                data: data || [],
                count: data?.length || 0,
                query
            };

        } catch (error) {
            console.error('Supabase 검색 오류:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    /**
     * 조회수 증가
     */
    async incrementViewCount(id) {
        try {
            const { data, error } = await this.client
                .rpc('increment_blog_view_count', { blog_id: id });

            if (error) throw error;

            return {
                success: true,
                data
            };

        } catch (error) {
            console.error('조회수 증가 오류:', error);
            return {
                success: false,
                error: error.message
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
                    title: '테스트 웹사이트 1',
                    description: '첫 번째 테스트 웹사이트입니다.',
                    status: 'published',
                    url: 'https://example.com/1',
                    category: 'website',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: '테스트 웹사이트 2',
                    description: '두 번째 테스트 웹사이트입니다.',
                    status: 'coming-soon',
                    url: null,
                    category: 'website',
                    created_at: new Date().toISOString()
                }
            ],
            blog: [
                {
                    id: 3,
                    title: '테스트 블로그 1',
                    description: '첫 번째 테스트 블로그 포스트입니다.',
                    status: 'published',
                    url: 'https://example.com/blog/1',
                    category: 'blog',
                    created_at: new Date().toISOString()
                },
                {
                    id: 4,
                    title: '테스트 블로그 2',
                    description: '두 번째 테스트 블로그 포스트입니다.',
                    status: 'published',
                    url: 'https://example.com/blog/2',
                    category: 'blog',
                    created_at: new Date().toISOString()
                }
            ]
        };
    }

    async getContentByCategory(category, options = {}) {
        const {
            limit = 10,
            showComingSoon = true
        } = options;

        // 시뮬레이션 지연
        await new Promise(resolve => setTimeout(resolve, 500));

        const data = this.mockData[category] || [];
        let filteredData = data;

        if (!showComingSoon) {
            filteredData = data.filter(item => item.status === 'published');
        }

        const limitedData = limit > 0 ? filteredData.slice(0, limit) : filteredData;

        return {
            success: true,
            data: limitedData,
            count: limitedData.length
        };
    }

    async getContentById(id) {
        await new Promise(resolve => setTimeout(resolve, 300));

        const allData = [...this.mockData.website, ...this.mockData.blog];
        const item = allData.find(item => item.id === id);

        if (item) {
            return {
                success: true,
                data: item
            };
        } else {
            return {
                success: false,
                error: '콘텐츠를 찾을 수 없습니다',
                data: null
            };
        }
    }

    async searchContent(query, options = {}) {
        await new Promise(resolve => setTimeout(resolve, 400));

        const allData = [...this.mockData.website, ...this.mockData.blog];
        const filteredData = allData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        return {
            success: true,
            data: filteredData,
            count: filteredData.length,
            query
        };
    }

    async incrementViewCount(id) {
        await new Promise(resolve => setTimeout(resolve, 200));

        return {
            success: true,
            data: { id, view_count: Math.floor(Math.random() * 100) + 1 }
        };
    }
}