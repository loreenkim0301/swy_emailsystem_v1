// SPA용 GA4 분석 추적 시스템
class AnalyticsTracker {
    constructor() {
        this.isGALoaded = false;
        this.currentPage = 'home';
        this.sessionStartTime = Date.now();
        this.init();
    }

    init() {
        // GA4가 로드되었는지 확인
        this.checkGALoaded();
        
        // 초기 페이지 로드 추적
        this.trackPageView('home', '홈페이지 - EmailJS 학습 도구');
    }

    checkGALoaded() {
        if (typeof gtag !== 'undefined') {
            this.isGALoaded = true;
            console.log('✅ GA4 추적 시스템 초기화 완료');
        } else {
            console.log('⚠️ GA4가 로드되지 않았습니다. 추적이 비활성화됩니다.');
        }
    }

    // 🎯 핵심: 가상 페이지뷰 추적 (Virtual Page Views)
    trackPageView(pageId, pageTitle, additionalParams = {}) {
        if (!this.isGALoaded) {
            console.log(`📊 [오프라인] 페이지 추적: ${pageTitle} (${pageId})`);
            return;
        }

        // 방법 1: gtag config로 페이지뷰 업데이트
        const pageData = {
            page_title: pageTitle,
            page_location: `${window.location.origin}/#${pageId}`, // 가상 URL 생성
            page_path: `/#${pageId}`, // 가상 경로
            content_group1: this.getContentGroup(pageId), // 콘텐츠 분류
            custom_parameter_1: pageId, // 커스텀 파라미터
            ...additionalParams
        };

        // GA4 설정 업데이트 (이게 실제 페이지뷰를 생성함)
        gtag('config', 'GA_MEASUREMENT_ID', pageData);
        
        // 방법 2: 커스텀 이벤트로 추가 데이터 전송
        gtag('event', 'virtual_page_view', {
            page_id: pageId,
            page_title: pageTitle,
            previous_page: this.currentPage,
            session_duration: Date.now() - this.sessionStartTime,
            timestamp: new Date().toISOString(),
            user_journey: this.getUserJourney(pageId)
        });

        // 방법 3: 표준 page_view 이벤트 (권장)
        gtag('event', 'page_view', {
            page_title: pageTitle,
            page_location: `${window.location.origin}/#${pageId}`,
            page_path: `/#${pageId}`,
            content_group1: this.getContentGroup(pageId)
        });

        this.currentPage = pageId;
        
        console.log(`📊 페이지 추적 완료: ${pageTitle} (${pageId})`);
    }

    // 섹션별 콘텐츠 그룹 분류 (GA4에서 그룹별로 분석 가능)
    getContentGroup(pageId) {
        const contentGroups = {
            'home': '메인페이지',
            'step1': 'EmailJS 설정',
            'step2': '연결 테스트', 
            'step3': '이메일 발송',
            'related-content': '관련 콘텐츠',
            'newsletter': '뉴스레터 구독'
        };
        return contentGroups[pageId] || '기타';
    }

    // 사용자 여정 추적
    getUserJourney(currentPageId) {
        const journeyMap = {
            'home': '진입',
            'step1': '설정 시작',
            'step2': '테스트 진행',
            'step3': '실제 사용',
            'related-content': '추가 탐색',
            'newsletter': '구독 관심'
        };
        return journeyMap[currentPageId] || '기타 행동';
    }

    // 🎯 단계별 진행 상황 추적
    trackStepProgress(stepNumber, stepName, isCompleted = false) {
        if (!this.isGALoaded) return;

        gtag('event', 'step_progress', {
            step_number: stepNumber,
            step_name: stepName,
            is_completed: isCompleted,
            completion_rate: this.calculateCompletionRate(stepNumber),
            time_spent: Date.now() - this.sessionStartTime
        });

        console.log(`📈 단계 진행: ${stepName} (${isCompleted ? '완료' : '진행중'})`);
    }

    // 🎯 사용자 상호작용 추적
    trackUserInteraction(action, element, additionalData = {}) {
        if (!this.isGALoaded) return;

        gtag('event', action, {
            event_category: 'user_interaction',
            event_label: element,
            current_page: this.currentPage,
            ...additionalData
        });

        console.log(`🖱️ 사용자 상호작용: ${action} - ${element}`);
    }

    // 완료율 계산
    calculateCompletionRate(currentStep) {
        const totalSteps = 3;
        return Math.round((currentStep / totalSteps) * 100);
    }

    // 🎯 이메일 발송 성공/실패 추적
    trackEmailEvent(eventType, success, errorMessage = null) {
        if (!this.isGALoaded) return;

        gtag('event', 'email_action', {
            event_category: 'email_functionality',
            event_label: eventType,
            success: success,
            error_message: errorMessage,
            current_step: this.currentPage
        });

        console.log(`📧 이메일 이벤트: ${eventType} - ${success ? '성공' : '실패'}`);
    }

    // 🎯 성능 지표 추적
    trackPerformance(metricName, value, unit = 'ms') {
        if (!this.isGALoaded) return;

        gtag('event', 'performance_metric', {
            event_category: 'performance',
            metric_name: metricName,
            metric_value: value,
            metric_unit: unit,
            page_id: this.currentPage
        });
    }
}

// 전역 분석 추적기 인스턴스
const analytics = new AnalyticsTracker();

// 🎯 사용하기 쉬운 헬퍼 함수들
window.trackPage = (pageId, pageTitle, additionalParams) => {
    analytics.trackPageView(pageId, pageTitle, additionalParams);
};

window.trackStep = (stepNumber, stepName, isCompleted) => {
    analytics.trackStepProgress(stepNumber, stepName, isCompleted);
};

window.trackClick = (element, additionalData) => {
    analytics.trackUserInteraction('click', element, additionalData);
};

window.trackEmailEvent = (eventType, success, errorMessage) => {
    analytics.trackEmailEvent(eventType, success, errorMessage);
};

// 내보내기
export { analytics };