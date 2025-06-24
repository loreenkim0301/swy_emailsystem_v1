const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// 구독자 데이터를 저장할 파일 경로
const subscribersFile = path.join(__dirname, 'subscribers.json');

// 구독자 데이터 초기화
if (!fs.existsSync(subscribersFile)) {
    fs.writeFileSync(subscribersFile, JSON.stringify([]));
}

// 구독자 목록 조회 (관리자용)
app.get('/api/subscribers', (req, res) => {
    try {
        const subscribers = JSON.parse(fs.readFileSync(subscribersFile, 'utf8'));
        res.json({
            success: true,
            count: subscribers.length,
            subscribers: subscribers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '구독자 목록을 불러오는데 실패했습니다.'
        });
    }
});

// 이메일 구독 등록
app.post('/api/subscribe', (req, res) => {
    try {
        const { email } = req.body;
        
        // 이메일 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: '올바른 이메일 주소를 입력해주세요.'
            });
        }

        // 기존 구독자 목록 읽기
        const subscribers = JSON.parse(fs.readFileSync(subscribersFile, 'utf8'));
        
        // 중복 이메일 확인
        const existingSubscriber = subscribers.find(sub => sub.email === email);
        if (existingSubscriber) {
            return res.status(409).json({
                success: false,
                message: '이미 구독 중인 이메일 주소입니다.'
            });
        }

        // 새 구독자 추가
        const newSubscriber = {
            email: email,
            subscribedAt: new Date().toISOString(),
            source: 'emailjs-learning-tool'
        };
        
        subscribers.push(newSubscriber);
        
        // 파일에 저장
        fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
        
        res.json({
            success: true,
            message: '구독이 완료되었습니다! 바이브코드제로 클럽의 최신 소식을 받아보세요.',
            subscriber: newSubscriber
        });
        
    } catch (error) {
        console.error('구독 처리 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📧 구독 API: http://localhost:${PORT}/api/subscribe`);
    console.log(`📊 구독자 목록: http://localhost:${PORT}/api/subscribers`);
});