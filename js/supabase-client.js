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

// 이메일 구독 등록
export async function subscribeToNewsletter(email) {
    if (!supabaseClient) {
        throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    }
    
    try {
        // 중복 이메일 확인 - maybeSingle() 사용으로 에러 방지
        const { data: existingSubscriber, error: checkError } = await supabaseClient
            .from('subscribers')
            .select('id, status')
            .eq('email', email)
            .maybeSingle();
        
        if (checkError) {
            throw checkError;
        }
        
        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return {
                    success: false,
                    message: '이미 구독 중인 이메일 주소입니다.'
                };
            } else {
                // 구독 취소된 사용자 재활성화
                const { error: updateError } = await supabaseClient
                    .from('subscribers')
                    .update({ 
                        status: 'active',
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', email);
                
                if (updateError) throw updateError;
                
                return {
                    success: true,
                    message: '다시 구독해주셔서 감사합니다! 바이브코드제로 클럽의 최신 소식을 받아보세요.'
                };
            }
        }
        
        // 새 구독자 추가
        const { data, error: insertError } = await supabaseClient
            .from('subscribers')
            .insert([{
                email: email,
                source: 'emailjs-learning-tool',
                status: 'active'
            }])
            .select()
            .single();
        
        if (insertError) throw insertError;
        
        console.log(`✅ 새 구독자 추가: ${email}`);
        
        return {
            success: true,
            message: '구독이 완료되었습니다! 바이브코드제로 클럽의 최신 소식을 받아보세요.',
            subscriber_id: data.id
        };
        
    } catch (error) {
        console.error('구독 처리 중 오류:', error);
        throw new Error('구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
}

// 구독 취소
export async function unsubscribeFromNewsletter(email) {
    if (!supabaseClient) {
        throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    }
    
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
    if (!supabaseClient) {
        throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    }
    
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
    if (!supabaseClient) {
        throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    }
    
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