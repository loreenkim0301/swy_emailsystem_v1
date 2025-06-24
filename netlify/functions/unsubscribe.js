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

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: '이메일 주소가 필요합니다.'
        })
      };
    }

    // 기존 구독자 데이터 읽기
    const subscribers = readSubscribers();

    // 해당 이메일 찾기
    const subscriberIndex = subscribers.findIndex(sub => sub.email === email);
    
    if (subscriberIndex === -1) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: '해당 구독 정보를 찾을 수 없습니다.'
        })
      };
    }

    // 구독 취소 처리
    subscribers[subscriberIndex].status = 'unsubscribed';
    subscribers[subscriberIndex].unsubscribedAt = new Date().toISOString();

    if (saveSubscribers(subscribers)) {
      console.log(`✅ 구독 취소: ${email}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: '구독이 성공적으로 취소되었습니다.'
        })
      };
    } else {
      throw new Error('데이터 저장 실패');
    }

  } catch (error) {
    console.error('구독 취소 처리 중 오류:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: '구독 취소 처리 중 오류가 발생했습니다.'
      })
    };
  }
};