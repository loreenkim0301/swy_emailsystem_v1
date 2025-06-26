// Supabase 데이터 서비스
import { getWebsitesWithComingSoon, getBlogPosts, incrementViewCount } from '../js/blogs-client.js';

export class SupabaseDataService {
    async getContentByCategory(category, options = {}) {
        try {
            let result;
            
            if (category === 'website') {
                result = await getWebsitesWithComingSoon(options.limit);
            } else if (category === 'blog') {
                result = await getBlogPosts(options.limit);
            } else {
                throw new Error(`지원하지 않는 카테고리: ${category}`);
            }

            return {
                success: result.success,
                data: result.blogs || [],
                count: result.count || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    async incrementViewCount(blogId) {
        try {
            return await incrementViewCount(blogId);
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}