// Supabase 클라이언트 설정
let supabaseClient = null;

// Supabase 클라이언트 초기화
export function initializeSupabase() {
    // 환경 변수에서 Supabase 설정 가져오기
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
        console.error('VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 .env 파일에 설정해주세요.');
        return false;
    }
    
    try {
        // Supabase 클라이언트 생성
        supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Supabase 클라이언트 초기화 완료');
        return true;
    } catch (error) {
        console.error('❌ Supabase 클라이언트 초기화 실패:', error);
        return false;
    }
}

// Supabase 클라이언트 내보내기 (다른 모듈에서 사용)
export { supabaseClient };

// Supabase 클라이언트 getter 함수 (초기화 후 안전하게 접근)
export function getSupabaseClient() {
    if (!supabaseClient) {
        throw new Error('Supabase 클라이언트가 아직 초기화되지 않았습니다. initializeSupabase()를 먼저 호출해주세요.');
    }
    return supabaseClient;
}

// Brevo API에 구독자 추가 (메인 저장소)
async function addToBrevo(email) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/functions/v1/brevo-subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ email })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Brevo API 호출 실패');
    }

    console.log('✅ Brevo 컨택 추가 성공:', result);
    return result;
}

// Supabase에 구독자 백업 저장
async function backupToSupabase(email, brevoData) {
    const supabaseClient = getSupabaseClient();

    try {
        const { error } = await supabaseClient
            .from('subscribers')
            .upsert(
                {
                    email: email,
                    source: 'emailjs-learning-tool',
                    status: 'active',
                    subscribed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                { onConflict: 'email' }
            );

        if (error) throw error;
        console.log(`✅ Supabase 백업 완료: ${email}`);
    } catch (error) {
        console.warn('⚠️ Supabase 백업 실패 (Brevo에는 저장됨):', error);
    }
}

// 이메일 구독 등록
export async function subscribeToNewsletter(email) {
    try {
        // 1. Brevo에 먼저 추가 (메인 저장소) - 실패하면 즉시 에러 반환
        const brevoData = await addToBrevo(email);

        // 2. Supabase에 백업 저장 (비동기로 처리하되 실패해도 무시)
        backupToSupabase(email, brevoData);

        return {
            success: true,
            message: '구독이 완료되었습니다! 바이브코드제로 클럽의 최신 소식을 받아보세요.'
        };

    } catch (error) {
        console.error('구독 처리 중 오류:', error);
        return {
            success: false,
            message: error.message || '구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        };
    }
}

// 구독 취소
export async function unsubscribeFromNewsletter(email) {
    const supabaseClient = getSupabaseClient();
    
    try {
        const { data, error } = await supabaseClient
            .from('subscribers')
            .update({ 
                status: 'unsubscribed',
                updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select();
        
        if (error) throw error;
        
        if (data.length === 0) {
            return {
                success: false,
                message: '해당 구독 정보를 찾을 수 없습니다.'
            };
        }
        
        console.log(`✅ 구독 취소: ${email}`);
        
        return {
            success: true,
            message: '구독이 성공적으로 취소되었습니다.'
        };
        
    } catch (error) {
        console.error('구독 취소 처리 중 오류:', error);
        throw new Error('구독 취소 처리 중 오류가 발생했습니다.');
    }
}

// 구독자 통계 조회 (관리자용)
export async function getSubscriberStats() {
    const supabaseClient = getSupabaseClient();
    
    try {
        // 전체 구독자 수
        const { count: totalCount, error: totalError } = await supabaseClient
            .from('subscribers')
            .select('*', { count: 'exact', head: true });
        
        if (totalError) throw totalError;
        
        // 활성 구독자 수
        const { count: activeCount, error: activeError } = await supabaseClient
            .from('subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');
        
        if (activeError) throw activeError;
        
        // 오늘 신규 구독자 수
        const today = new Date().toISOString().split('T')[0];
        const { count: todayCount, error: todayError } = await supabaseClient
            .from('subscribers')
            .select('*', { count: 'exact', head: true })
            .gte('subscribed_at', today);
        
        if (todayError) throw todayError;
        
        // 이번 주 신규 구독자 수
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count: weekCount, error: weekError } = await supabaseClient
            .from('subscribers')
            .select('*', { count: 'exact', head: true })
            .gte('subscribed_at', weekAgo.toISOString());
        
        if (weekError) throw weekError;
        
        return {
            total_subscribers: totalCount || 0,
            active_subscribers: activeCount || 0,
            today_subscribers: todayCount || 0,
            week_subscribers: weekCount || 0
        };
        
    } catch (error) {
        console.error('통계 조회 중 오류:', error);
        throw new Error('통계를 불러오는데 실패했습니다.');
    }
}

// 구독자 목록 조회 (관리자용)
export async function getSubscribers(page = 1, limit = 50, status = 'active') {
    const supabaseClient = getSupabaseClient();
    
    try {
        const offset = (page - 1) * limit;
        
        let query = supabaseClient
            .from('subscribers')
            .select('*', { count: 'exact' })
            .order('subscribed_at', { ascending: false })
            .range(offset, offset + limit - 1);
        
        if (status !== 'all') {
            query = query.eq('status', status);
        }
        
        const { data, count, error } = await query;
        
        if (error) throw error;
        
        return {
            subscribers: data || [],
            pagination: {
                current_page: page,
                total_count: count || 0,
                total_pages: Math.ceil((count || 0) / limit),
                per_page: limit
            }
        };
        
    } catch (error) {
        console.error('구독자 목록 조회 중 오류:', error);
        throw new Error('구독자 목록을 불러오는데 실패했습니다.');
    }
}