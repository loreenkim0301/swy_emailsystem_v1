const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, 'database', 'subscribers.db');

// 데이터베이스 디렉토리 생성
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ 데이터베이스 연결 실패:', err.message);
    } else {
        console.log('✅ SQLite 데이터베이스 연결 성공');
        initializeDatabase();
    }
});

// 데이터베이스 초기화
function initializeDatabase() {
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
        } else {
            console.log('✅ subscribers 테이블 준비 완료');
            
            // 인덱스 생성
            db.run('CREATE INDEX IF NOT EXISTS idx_email ON subscribers(email)');
            db.run('CREATE INDEX IF NOT EXISTS idx_subscribed_at ON subscribers(subscribed_at)');
            db.run('CREATE INDEX IF NOT EXISTS idx_status ON subscribers(status)');
        }
    });
}

// 구독자 통계 조회
app.get('/api/subscribers/stats', (req, res) => {
    const statsQuery = `
        SELECT 
            COUNT(*) as total_subscribers,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscribers,
            COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed_count,
            COUNT(CASE WHEN DATE(subscribed_at) = DATE('now') THEN 1 END) as today_subscribers,
            COUNT(CASE WHEN DATE(subscribed_at) >= DATE('now', '-7 days') THEN 1 END) as week_subscribers,
            COUNT(CASE WHEN DATE(subscribed_at) >= DATE('now', '-30 days') THEN 1 END) as month_subscribers
        FROM subscribers
    `;
    
    db.get(statsQuery, (err, stats) => {
        if (err) {
            console.error('통계 조회 실패:', err.message);
            res.status(500).json({
                success: false,
                message: '통계를 불러오는데 실패했습니다.'
            });
        } else {
            res.json({
                success: true,
                stats: stats
            });
        }
    });
});

// 구독자 목록 조회 (관리자용)
app.get('/api/subscribers', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const status = req.query.status || 'active';
    
    const query = `
        SELECT id, email, subscribed_at, source, status, created_at
        FROM subscribers 
        WHERE status = ?
        ORDER BY subscribed_at DESC 
        LIMIT ? OFFSET ?
    `;
    
    const countQuery = `SELECT COUNT(*) as total FROM subscribers WHERE status = ?`;
    
    // 총 개수 조회
    db.get(countQuery, [status], (err, countResult) => {
        if (err) {
            console.error('구독자 수 조회 실패:', err.message);
            return res.status(500).json({
                success: false,
                message: '구독자 목록을 불러오는데 실패했습니다.'
            });
        }
        
        // 구독자 목록 조회
        db.all(query, [status, limit, offset], (err, subscribers) => {
            if (err) {
                console.error('구독자 목록 조회 실패:', err.message);
                res.status(500).json({
                    success: false,
                    message: '구독자 목록을 불러오는데 실패했습니다.'
                });
            } else {
                res.json({
                    success: true,
                    data: {
                        subscribers: subscribers,
                        pagination: {
                            current_page: page,
                            total_count: countResult.total,
                            total_pages: Math.ceil(countResult.total / limit),
                            per_page: limit
                        }
                    }
                });
            }
        });
    });
});

// 이메일 구독 등록
app.post('/api/subscribe', (req, res) => {
    try {
        const { email } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || '';
        
        // 이메일 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: '올바른 이메일 주소를 입력해주세요.'
            });
        }

        // 중복 이메일 확인
        const checkQuery = 'SELECT id, status FROM subscribers WHERE email = ?';
        db.get(checkQuery, [email], (err, existingSubscriber) => {
            if (err) {
                console.error('중복 확인 실패:', err.message);
                return res.status(500).json({
                    success: false,
                    message: '구독 처리 중 오류가 발생했습니다.'
                });
            }
            
            if (existingSubscriber) {
                if (existingSubscriber.status === 'active') {
                    return res.status(409).json({
                        success: false,
                        message: '이미 구독 중인 이메일 주소입니다.'
                    });
                } else {
                    // 구독 취소된 사용자 재활성화
                    const reactivateQuery = `
                        UPDATE subscribers 
                        SET status = 'active', updated_at = CURRENT_TIMESTAMP 
                        WHERE email = ?
                    `;
                    db.run(reactivateQuery, [email], function(err) {
                        if (err) {
                            console.error('재구독 처리 실패:', err.message);
                            return res.status(500).json({
                                success: false,
                                message: '구독 처리 중 오류가 발생했습니다.'
                            });
                        }
                        
                        res.json({
                            success: true,
                            message: '다시 구독해주셔서 감사합니다! 바이브코드제로 클럽의 최신 소식을 받아보세요.',
                            subscriber_id: existingSubscriber.id
                        });
                    });
                }
            } else {
                // 새 구독자 추가
                const subscriberId = uuidv4();
                const unsubscribeToken = uuidv4();
                
                const insertQuery = `
                    INSERT INTO subscribers (
                        id, email, source, ip_address, user_agent, unsubscribe_token
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `;
                
                db.run(insertQuery, [
                    subscriberId, 
                    email, 
                    'emailjs-learning-tool', 
                    ipAddress, 
                    userAgent, 
                    unsubscribeToken
                ], function(err) {
                    if (err) {
                        console.error('구독자 추가 실패:', err.message);
                        res.status(500).json({
                            success: false,
                            message: '구독 처리 중 오류가 발생했습니다.'
                        });
                    } else {
                        console.log(`✅ 새 구독자 추가: ${email} (ID: ${subscriberId})`);
                        
                        res.json({
                            success: true,
                            message: '구독이 완료되었습니다! 바이브코드제로 클럽의 최신 소식을 받아보세요.',
                            subscriber_id: subscriberId
                        });
                    }
                });
            }
        });
        
    } catch (error) {
        console.error('구독 처리 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
});

// 구독 취소
app.post('/api/unsubscribe', (req, res) => {
    const { token, email } = req.body;
    
    if (!token && !email) {
        return res.status(400).json({
            success: false,
            message: '구독 취소 토큰 또는 이메일이 필요합니다.'
        });
    }
    
    let query, params;
    if (token) {
        query = 'UPDATE subscribers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE unsubscribe_token = ?';
        params = ['unsubscribed', token];
    } else {
        query = 'UPDATE subscribers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?';
        params = ['unsubscribed', email];
    }
    
    db.run(query, params, function(err) {
        if (err) {
            console.error('구독 취소 실패:', err.message);
            res.status(500).json({
                success: false,
                message: '구독 취소 처리 중 오류가 발생했습니다.'
            });
        } else if (this.changes === 0) {
            res.status(404).json({
                success: false,
                message: '해당 구독 정보를 찾을 수 없습니다.'
            });
        } else {
            res.json({
                success: true,
                message: '구독이 성공적으로 취소되었습니다.'
            });
        }
    });
});

// 데이터베이스 백업 (관리자용)
app.get('/api/admin/backup', (req, res) => {
    const backupQuery = 'SELECT * FROM subscribers ORDER BY subscribed_at DESC';
    
    db.all(backupQuery, (err, subscribers) => {
        if (err) {
            console.error('백업 실패:', err.message);
            res.status(500).json({
                success: false,
                message: '백업 생성에 실패했습니다.'
            });
        } else {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `subscribers_backup_${timestamp}.json`;
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.json({
                backup_date: new Date().toISOString(),
                total_records: subscribers.length,
                data: subscribers
            });
        }
    });
});

// 서버 종료 시 데이터베이스 연결 정리
process.on('SIGINT', () => {
    console.log('\n🔄 서버 종료 중...');
    db.close((err) => {
        if (err) {
            console.error('데이터베이스 연결 종료 실패:', err.message);
        } else {
            console.log('✅ 데이터베이스 연결 정리 완료');
        }
        process.exit(0);
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📧 구독 API: http://localhost:${PORT}/api/subscribe`);
    console.log(`📊 구독자 목록: http://localhost:${PORT}/api/subscribers`);
    console.log(`📈 구독자 통계: http://localhost:${PORT}/api/subscribers/stats`);
    console.log(`💾 데이터베이스: ${dbPath}`);
});