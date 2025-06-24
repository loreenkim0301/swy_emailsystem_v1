const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '..', 'database', 'subscribers.db');

// 백업 디렉토리 생성
const backupDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ 데이터베이스 연결 실패:', err.message);
        process.exit(1);
    } else {
        console.log('✅ 데이터베이스 연결 성공');
        createBackup();
    }
});

function createBackup() {
    console.log('🔄 데이터베이스 백업 시작...');
    
    const backupQuery = 'SELECT * FROM subscribers ORDER BY subscribed_at DESC';
    
    db.all(backupQuery, (err, subscribers) => {
        if (err) {
            console.error('❌ 백업 데이터 조회 실패:', err.message);
            process.exit(1);
        } else {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `subscribers_backup_${timestamp}.json`;
            const backupFilePath = path.join(backupDir, backupFileName);
            
            const backupData = {
                backup_info: {
                    created_at: new Date().toISOString(),
                    total_records: subscribers.length,
                    database_path: dbPath,
                    backup_version: '1.0'
                },
                subscribers: subscribers
            };
            
            fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
            
            console.log(`✅ 백업 완료: ${backupFileName}`);
            console.log(`📁 백업 위치: ${backupFilePath}`);
            console.log(`📊 백업된 레코드 수: ${subscribers.length}개`);
            
            // 통계 정보 표시
            const activeCount = subscribers.filter(s => s.status === 'active').length;
            const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;
            
            console.log(`📈 활성 구독자: ${activeCount}명`);
            console.log(`❌ 구독 취소: ${unsubscribedCount}명`);
            
            closeDatabase();
        }
    });
}

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('❌ 데이터베이스 연결 종료 실패:', err.message);
        } else {
            console.log('✅ 백업 작업 완료');
        }
        process.exit(0);
    });
}