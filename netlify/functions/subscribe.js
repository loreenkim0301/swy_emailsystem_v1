const fs = require('fs');
const path = require('path');

// 구독자 데이터를 저장할 파일 경로
const subscribersFile = path.join('/tmp', 'subscribers.json');

// 구독자 데이터 읽기
function readSubscribers() {
  try {
    if (fs.existsSync(subscribersFile)) {
      const data = fs.readFileSync(subscribersFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('구독자 데이터 읽기 실패:', error);
    return [];
  }
}

// 구독자 데이터 저장
function saveSubscribers(subscribers) {
  try {
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('구독자 데이터 저장 실패:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'POST 요청만 허용됩니다.'
      })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: '올바른 이메일 주소를 입력해주세요.'
        })
      };
    }

    // 기존 구독자 데이터 읽기
    const subscribers = readSubscribers();

    // 중복 이메일 확인
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({
            success: false,
            message: '이미 구독 중인 이메일 주소입니다.'
          })
        };
      } else {
        // 구독 취소된 사용자 재활성화
        existingSubscriber.status = 'active';
        existingSubscriber.resubscribedAt = new Date().toISOString();
        
        if (saveSubscribers(subscribers)) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: '다시 구독해주셔서 감사합니다! 바이브코드제로 클럽의 최신 소식을 받아보세요.'
            })
          };
        } else {
          throw new Error('데이터 저장 실패');
        }
      }
    }

    // 새 구독자 추가
    const newSubscriber = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      email: email,
      subscribedAt: new Date().toISOString(),
      source: 'emailjs-learning-tool',
      status: 'active',
      ipAddress: event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
      userAgent: event.headers['user-agent'] || 'unknown'
    };

    subscribers.push(newSubscriber);

    if (saveSubscribers(subscribers)) {
      console.log(`✅ 새 구독자 추가: ${email}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: '구독이 완료되었습니다! 바이브코드제로 클럽의 최신 소식을 받아보세요.',
          subscriber_id: newSubscriber.id
        })
      };
    } else {
      throw new Error('데이터 저장 실패');
    }

  } catch (error) {
    console.error('구독 처리 중 오류:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: '구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      })
    };
  }
};