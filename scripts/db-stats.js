const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '..', 'database', 'subscribers.db');

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ 데이터베이스 연결 실패:', err.message);
        process.exit(1);
    } else {
        console.log('✅ 데이터베이스 연결 성공');
        showStats();
    }
});

function showStats() {
    console.log('\n📊 구독자 데이터베이스 통계\n' + '='.repeat(50));
    
    const statsQuery = `
        SELECT 
            COUNT(*) as total_subscribers,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscribers,
            COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed_count,
            COUNT(CASE WHEN DATE(subscribed_at) = DATE('now') THEN 1 END) as today_subscribers,
            COUNT(CASE WHEN DATE(subscribed_at) >= DATE('now', '-7 days') THEN 1 END) as week_subscribers,
            COUNT(CASE WHEN DATE(subscribed_at) >= DATE('now', '-30 days') THEN 1 END) as month_subscribers,
            MIN(subscribed_at) as first_subscriber,
            MAX(subscribed_at) as latest_subscriber
        FROM subscribers
    `;
    
    db.get(statsQuery, (err, stats) => {
        if (err) {
            console.error('❌ 통계 조회 실패:', err.message);
        } else {
            console.log(`📈 전체 구독자: ${stats.total_subscribers}명`);
            console.log(`✅ 활성 구독자: ${stats.active_subscribers}명`);
            console.log(`❌ 구독 취소: ${stats.unsubscribed_count}명`);
            console.log(`📅 오늘 신규: ${stats.today_subscribers}명`);
            console.log(`📅 이번 주: ${stats.week_subscribers}명`);
            console.log(`📅 이번 달: ${stats.month_subscribers}명`);
            
            if (stats.first_subscriber) {
                console.log(`🥇 첫 구독자: ${new Date(stats.first_subscriber).toLocaleString('ko-KR')}`);
            }
            if (stats.latest_subscriber) {
                console.log(`🆕 최근 구독자: ${new Date(stats.latest_subscriber).toLocaleString('ko-KR')}`);
            }
        }
        
        // 소스별 통계
        showSourceStats();
    });
}

function showSourceStats() {
    console.log('\n📊 소스별 구독자 통계\n' + '-'.repeat(30));
    
    const sourceQuery = `
        SELECT 
            source,
            COUNT(*) as count,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count
        FROM subscribers 
        GROUP BY source 
        ORDER BY count DESC
    `;
    
    db.all(sourceQuery, (err, sources) => {
        if (err) {
            console.error('❌ 소스별 통계 조회 실패:', err.message);
        } else {
            sources.forEach(source => {
                console.log(`📍 ${source.source}: ${source.count}명 (활성: ${source.active_count}명)`);
            });
        }
        
        // 최근 구독자 목록
        showRecentSubscribers();
    });
}

function showRecentSubscribers() {
    console.log('\n📋 최근 구독자 (최근 10명)\n' + '-'.repeat(40));
    
    const recentQuery = `
        SELECT email, subscribed_at, status
        FROM subscribers 
        ORDER BY subscribed_at DESC 
        LIMIT 10
    `;
    
    db.all(recentQuery, (err, subscribers) => {
        if (err) {
            console.error('❌ 최근 구독자 조회 실패:', err.message);
        } else {
            if (subscribers.length === 0) {
                console.log('📝 구독자가 없습니다.');
            } else {
                subscribers.forEach((sub, index) => {
                    const date = new Date(sub.subscribed_at).toLocaleString('ko-KR');
                    const status = sub.status === 'active' ? '✅' : '❌';
                    console.log(`${index + 1}. ${status} ${sub.email} (${date})`);
                });
            }
        }
        
        closeDatabase();
    });
}

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('❌ 데이터베이스 연결 종료 실패:', err.message);
        } else {
            console.log('\n✅ 통계 조회 완료');
        }
        process.exit(0);
    });
}