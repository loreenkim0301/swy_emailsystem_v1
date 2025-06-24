const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '..', 'database', 'subscribers.db');

// 데이터베이스 디렉토리 생성
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ 데이터베이스 디렉토리 생성 완료');
}

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ 데이터베이스 연결 실패:', err.message);
        process.exit(1);
    } else {
        console.log('✅ SQLite 데이터베이스 연결 성공');
        initializeDatabase();
    }
});

function initializeDatabase() {
    console.log('🔄 데이터베이스 초기화 시작...');
    
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS subscribers (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            source TEXT DEFAULT 'emailjs-learning-tool',
            ip_address TEXT,
            user_agent TEXT,
            status TEXT DEFAULT 'active',
            unsubscribe_token TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('❌ 테이블 생성 실패:', err.message);
            process.exit(1);
        } else {
            console.log('✅ subscribers 테이블 생성 완료');
            
            // 인덱스 생성
            const indexes = [
                'CREATE INDEX IF NOT EXISTS idx_email ON subscribers(email)',
                'CREATE INDEX IF NOT EXISTS idx_subscribed_at ON subscribers(subscribed_at)',
                'CREATE INDEX IF NOT EXISTS idx_status ON subscribers(status)',
                'CREATE INDEX IF NOT EXISTS idx_unsubscribe_token ON subscribers(unsubscribe_token)'
            ];
            
            let indexCount = 0;
            indexes.forEach((indexQuery, i) => {
                db.run(indexQuery, (err) => {
                    if (err) {
                        console.error(`❌ 인덱스 ${i + 1} 생성 실패:`, err.message);
                    } else {
                        console.log(`✅ 인덱스 ${i + 1} 생성 완료`);
                    }
                    
                    indexCount++;
                    if (indexCount === indexes.length) {
                        console.log('🎉 데이터베이스 초기화 완료!');
                        
                        // 기존 JSON 파일에서 데이터 마이그레이션
                        migrateFromJSON();
                    }
                });
            });
        }
    });
}

function migrateFromJSON() {
    const jsonPath = path.join(__dirname, '..', 'subscribers.json');
    
    if (fs.existsSync(jsonPath)) {
        console.log('🔄 기존 JSON 데이터 마이그레이션 시작...');
        
        try {
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            if (jsonData.length > 0) {
                const { v4: uuidv4 } = require('uuid');
                
                const insertQuery = `
                    INSERT OR IGNORE INTO subscribers (
                        id, email, subscribed_at, source, unsubscribe_token
                    ) VALUES (?, ?, ?, ?, ?)
                `;
                
                let migratedCount = 0;
                jsonData.forEach((subscriber, index) => {
                    const id = uuidv4();
                    const unsubscribeToken = uuidv4();
                    
                    db.run(insertQuery, [
                        id,
                        subscriber.email,
                        subscriber.subscribedAt,
                        subscriber.source || 'emailjs-learning-tool',
                        unsubscribeToken
                    ], function(err) {
                        if (err) {
                            console.error(`❌ 마이그레이션 실패 (${subscriber.email}):`, err.message);
                        } else if (this.changes > 0) {
                            migratedCount++;
                            console.log(`✅ 마이그레이션 완료: ${subscriber.email}`);
                        }
                        
                        // 마지막 항목 처리 완료 시
                        if (index === jsonData.length - 1) {
                            console.log(`🎉 마이그레이션 완료! ${migratedCount}개 레코드 이전됨`);
                            
                            // JSON 파일 백업 후 삭제
                            const backupPath = jsonPath.replace('.json', '_backup.json');
                            fs.renameSync(jsonPath, backupPath);
                            console.log(`📦 기존 JSON 파일을 ${backupPath}로 백업했습니다.`);
                            
                            closeDatabase();
                        }
                    });
                });
            } else {
                console.log('📝 마이그레이션할 데이터가 없습니다.');
                closeDatabase();
            }
        } catch (error) {
            console.error('❌ JSON 파일 읽기 실패:', error.message);
            closeDatabase();
        }
    } else {
        console.log('📝 기존 JSON 파일이 없습니다. 새로운 데이터베이스로 시작합니다.');
        closeDatabase();
    }
}

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('❌ 데이터베이스 연결 종료 실패:', err.message);
        } else {
            console.log('✅ 데이터베이스 연결 종료');
        }
        process.exit(0);
    });
}