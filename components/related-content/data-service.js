/**
 * Related Content Data Service Interface
 * 데이터 서비스 인터페이스 정의
 */

export class RelatedContentDataService {
  /**
   * 카테고리별 콘텐츠 조회
   * @param {string} category - 카테고리 ('website', 'blog', etc.)
   * @param {Object} options - 옵션 (limit, offset, etc.)
   * @returns {Promise<{success: boolean, data: Array, count: number}>}
   */
  async getContentByCategory(category, options = {}) {
    throw new Error('getContentByCategory 메서드를 구현해야 합니다');
  }

  /**
   * 조회수 증가
   * @param {number} itemId - 아이템 ID
   * @returns {Promise<{success: boolean}>}
   */
  async incrementViewCount(itemId) {
    throw new Error('incrementViewCount 메서드를 구현해야 합니다');
  }
}

/**
 * Supabase 기반 데이터 서비스 구현
 */
export class SupabaseRelatedContentDataService extends RelatedContentDataService {
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
        data: data || [],
        count: data?.length || 0
      };

    } catch (error) {
      console.error(`${category} 콘텐츠 조회 중 오류:`, error);
      return {
        success: false,
        data: [],
        count: 0,
        error: error.message
      };
    }
  }

  async incrementViewCount(itemId) {
    try {
      const { data, error } = await this.supabaseClient
        .rpc('increment_blog_view_count', { blog_id: itemId });

      if (error) throw error;

      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('조회수 증가 중 오류:', error);
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
export class MockRelatedContentDataService extends RelatedContentDataService {
  constructor() {
    super();
    this.mockData = {
      website: [
        {
          id: 1,
          title: '테스트 웹사이트 1',
          description: '테스트용 웹사이트 설명입니다.',
          status: 'published',
          url: 'https://example.com/1',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: '테스트 웹사이트 2',
          description: '출시 예정인 웹사이트입니다.',
          status: 'coming-soon',
          url: null,
          created_at: new Date().toISOString()
        }
      ],
      blog: [
        {
          id: 3,
          title: '테스트 블로그 1',
          description: '테스트용 블로그 포스트입니다.',
          status: 'published',
          url: 'https://example.com/blog/1',
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          title: '테스트 블로그 2',
          description: '출시 예정인 블로그 포스트입니다.',
          status: 'coming-soon',
          url: null,
          created_at: new Date().toISOString()
        }
      ]
    };
  }

  async getContentByCategory(category, options = {}) {
    const { limit = 6 } = options;
    
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 100));

    const data = this.mockData[category] || [];
    const limited = limit > 0 ? data.slice(0, limit) : data;
    
    return {
      success: true,
      data: limited,
      count: limited.length
    };
  }

  async incrementViewCount(itemId) {
    // 목업에서는 성공만 반환
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      success: true,
      data: { view_count: Math.floor(Math.random() * 100) + 1 }
    };
  }
}