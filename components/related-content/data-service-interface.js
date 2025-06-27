// 데이터 서비스 인터페이스
// 다른 데이터 소스를 사용할 때 이 인터페이스를 구현하면 됨

export class DataServiceInterface {
    /**
     * 카테고리별 콘텐츠 조회
     * @param {string} category - 카테고리 (website, blog, project 등)
     * @param {Object} options - 옵션
     * @param {number} options.limit - 최대 개수
     * @param {boolean} options.showComingSoon - 출시 예정 포함 여부
     * @param {string} options.sortBy - 정렬 기준 (id, created_at, title, view_count)
     * @param {string} options.sortOrder - 정렬 순서 (asc, desc)
     * @returns {Promise<{success: boolean, data: Array, error?: string}>}
     */
    async getContentByCategory(category, options = {}) {
        throw new Error('getContentByCategory 메서드를 구현해야 합니다');
    }

    /**
     * ID로 콘텐츠 조회
     * @param {string|number} id - 콘텐츠 ID
     * @returns {Promise<{success: boolean, data: Object, error?: string}>}
     */
    async getContentById(id) {
        throw new Error('getContentById 메서드를 구현해야 합니다');
    }

    /**
     * 콘텐츠 검색
     * @param {string} query - 검색어
     * @param {Object} options - 검색 옵션
     * @returns {Promise<{success: boolean, data: Array, error?: string}>}
     */
    async searchContent(query, options = {}) {
        throw new Error('searchContent 메서드를 구현해야 합니다');
    }
}

// Supabase 데이터 서비스 구현체
export class SupabaseDataService extends DataServiceInterface {
    constructor(supabaseClient) {
        super();
        this.client = supabaseClient;
    }

    async getContentByCategory(category, options = {}) {
        const {
            limit = 10,
            showComingSoon = true,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = options;

        try {
            let query = this.client
                .from('blogs')
                .select('*')
                .eq('category', category);

            // 상태 필터링
            if (showComingSoon) {
                query = query.in('status', ['published', 'coming-soon']);
            } else {
                query = query.eq('status', 'published');
            }

            // 정렬
            query = query.order(sortBy, { ascending: sortOrder === 'asc' });

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
            console.error(`Error fetching ${category} content:`, error);
            return {
                success: false,
                data: [],
                error: error.message
            };
        }
    }

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
            console.error(`Error fetching content ${id}:`, error);
            return {
                success: false,
                data: null,
                error: error.message
            };
        }
    }

    async searchContent(query, options = {}) {
        const { limit = 10, category = null } = options;

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
                supabaseQuery = supabaseQuery.limit(limit);
            }

            const { data, error } = await supabaseQuery;

            if (error) throw error;

            return {
                success: true,
                data: data || [],
                searchTerm: query
            };

        } catch (error) {
            console.error('Error searching content:', error);
            return {
                success: false,
                data: [],
                error: error.message
            };
        }
    }
}

// 목업 데이터 서비스 (테스트용)
export class MockDataService extends DataServiceInterface {
    constructor() {
        super();
        this.mockData = {
            website: [
                {
                    id: 1,
                    title: 'Bolt.new로 데이터베이스의 CRUD 연습하기',
                    description: '데이터베이스 기본 연산을 실습하며 백엔드 개발을 배워보세요.',
                    status: 'published',
                    category: 'website',
                    url: 'https://example.com/crud',
                    created_at: '2025-01-01T00:00:00Z'
                },
                {
                    id: 2,
                    title: 'Bolt.new로 관리자 대시보드 디자인하기',
                    description: '데이터 시각화와 관리 기능을 포함한 대시보드를 제작해보세요.',
                    status: 'coming-soon',
                    category: 'website',
                    url: null,
                    created_at: '2025-01-02T00:00:00Z'
                }
            ],
            blog: [
                {
                    id: 3,
                    title: '[기획] 기획자도 개발할 수 있나요?',
                    description: '기획자가 개발을 배우는 이유와 실제 경험을 공유합니다.',
                    status: 'published',
                    category: 'blog',
                    url: 'https://example.com/blog/planner-dev',
                    created_at: '2025-01-03T00:00:00Z'
                }
            ]
        };
    }

    async getContentByCategory(category, options = {}) {
        const { limit = 10, showComingSoon = true, sortBy = 'created_at', sortOrder = 'desc' } = options;
        
        // 시뮬레이션 지연
        await new Promise(resolve => setTimeout(resolve, 500));

        let data = this.mockData[category] || [];

        // 상태 필터링
        if (!showComingSoon) {
            data = data.filter(item => item.status === 'published');
        }

        // 정렬
        data.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            
            if (sortOrder === 'desc') {
                return bVal > aVal ? 1 : -1;
            } else {
                return aVal > bVal ? 1 : -1;
            }
        });

        // 제한
        if (limit > 0) {
            data = data.slice(0, limit);
        }

        return {
            success: true,
            data: data,
            count: data.length
        };
    }

    async getContentById(id) {
        await new Promise(resolve => setTimeout(resolve, 300));

        const allData = [...this.mockData.website, ...this.mockData.blog];
        const item = allData.find(item => item.id == id);

        if (item) {
            return {
                success: true,
                data: item
            };
        } else {
            return {
                success: false,
                data: null,
                error: 'Content not found'
            };
        }
    }

    async searchContent(query, options = {}) {
        await new Promise(resolve => setTimeout(resolve, 400));

        const allData = [...this.mockData.website, ...this.mockData.blog];
        const results = allData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        return {
            success: true,
            data: results,
            searchTerm: query
        };
    }
}