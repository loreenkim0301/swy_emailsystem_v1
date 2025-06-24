// Blogs 관련 Supabase 클라이언트 함수들
import { supabaseClient } from './supabase-client.js';

// 모든 게시글 조회
export async function getAllBlogs(options = {}) {
    const {
        category = null,
        status = 'published',
        featured = null,
        limit = 10,
        offset = 0
    } = options;

    try {
        let query = supabaseClient
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        // 필터 적용
        if (category) {
            query = query.eq('category', category);
        }
        
        if (status !== 'all') {
            query = query.eq('status', status);
        }
        
        if (featured !== null) {
            query = query.eq('featured', featured);
        }

        // 페이지네이션
        if (limit > 0) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data, error } = await query;

        if (error) throw error;

        return {
            success: true,
            blogs: data || [],
            count: data?.length || 0
        };

    } catch (error) {
        console.error('게시글 조회 중 오류:', error);
        throw new Error('게시글을 불러오는데 실패했습니다.');
    }
}

// 추천 게시글 조회
export async function getFeaturedBlogs(limit = 4) {
    return await getAllBlogs({
        featured: true,
        status: 'published',
        limit
    });
}

// 카테고리별 게시글 조회
export async function getBlogsByCategory(category, limit = 6) {
    return await getAllBlogs({
        category,
        status: 'published',
        limit
    });
}

// 학습 도구 게시글 조회
export async function getLearningToolBlogs() {
    return await getBlogsByCategory('learning-tool');
}

// 튜토리얼 게시글 조회
export async function getTutorialBlogs() {
    return await getBlogsByCategory('tutorial');
}

// 게시글 조회수 증가
export async function incrementViewCount(blogId) {
    try {
        const { data, error } = await supabaseClient
            .rpc('increment_blog_view_count', { blog_id: blogId });

        if (error) throw error;

        return {
            success: true,
            data
        };

    } catch (error) {
        console.error('조회수 증가 중 오류:', error);
        // 조회수 증가 실패는 치명적이지 않으므로 에러를 던지지 않음
        return {
            success: false,
            error: error.message
        };
    }
}

// 게시글 검색
export async function searchBlogs(searchTerm, options = {}) {
    const {
        category = null,
        limit = 10,
        offset = 0
    } = options;

    try {
        let query = supabaseClient
            .from('blogs')
            .select('*')
            .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,keywords.cs.{${searchTerm}}`)
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        if (limit > 0) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data, error } = await query;

        if (error) throw error;

        return {
            success: true,
            blogs: data || [],
            count: data?.length || 0,
            searchTerm
        };

    } catch (error) {
        console.error('게시글 검색 중 오류:', error);
        throw new Error('게시글 검색에 실패했습니다.');
    }
}

// 관리자용: 게시글 생성
export async function createBlog(blogData) {
    try {
        const { data, error } = await supabaseClient
            .from('blogs')
            .insert([blogData])
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            blog: data,
            message: '게시글이 성공적으로 생성되었습니다.'
        };

    } catch (error) {
        console.error('게시글 생성 중 오류:', error);
        throw new Error('게시글 생성에 실패했습니다.');
    }
}

// 관리자용: 게시글 수정
export async function updateBlog(blogId, updateData) {
    try {
        const { data, error } = await supabaseClient
            .from('blogs')
            .update(updateData)
            .eq('id', blogId)
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            blog: data,
            message: '게시글이 성공적으로 수정되었습니다.'
        };

    } catch (error) {
        console.error('게시글 수정 중 오류:', error);
        throw new Error('게시글 수정에 실패했습니다.');
    }
}

// 관리자용: 게시글 삭제
export async function deleteBlog(blogId) {
    try {
        const { error } = await supabaseClient
            .from('blogs')
            .delete()
            .eq('id', blogId);

        if (error) throw error;

        return {
            success: true,
            message: '게시글이 성공적으로 삭제되었습니다.'
        };

    } catch (error) {
        console.error('게시글 삭제 중 오류:', error);
        throw new Error('게시글 삭제에 실패했습니다.');
    }
}

// 게시글 통계 조회 (관리자용)
export async function getBlogStats() {
    try {
        // 전체 게시글 수
        const { count: totalCount, error: totalError } = await supabaseClient
            .from('blogs')
            .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        // 발행된 게시글 수
        const { count: publishedCount, error: publishedError } = await supabaseClient
            .from('blogs')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published');

        if (publishedError) throw publishedError;

        // 예정된 게시글 수
        const { count: comingSoonCount, error: comingSoonError } = await supabaseClient
            .from('blogs')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'coming-soon');

        if (comingSoonError) throw comingSoonError;

        // 추천 게시글 수
        const { count: featuredCount, error: featuredError } = await supabaseClient
            .from('blogs')
            .select('*', { count: 'exact', head: true })
            .eq('featured', true);

        if (featuredError) throw featuredError;

        return {
            total_blogs: totalCount || 0,
            published_blogs: publishedCount || 0,
            coming_soon_blogs: comingSoonCount || 0,
            featured_blogs: featuredCount || 0
        };

    } catch (error) {
        console.error('게시글 통계 조회 중 오류:', error);
        throw new Error('게시글 통계를 불러오는데 실패했습니다.');
    }
}