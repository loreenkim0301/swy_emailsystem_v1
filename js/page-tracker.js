// 페이지 전환 감지 및 추적 시스템
class PageTracker {
    constructor() {
        this.currentSection = 'home';
        this.sectionTitles = {
            'home': '홈페이지 - EmailJS 학습 도구',
            'step1': '1단계 - EmailJS 설정',
            'step2': '2단계 - 연결 테스트',
            'step3': '3단계 - 이메일 발송',
            'related-content': '관련 콘텐츠 섹션',
            'newsletter': '뉴스레터 구독'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupClickTracking();
        this.setupScrollTracking();
    }

    // 🎯 Intersection Observer로 섹션 진입 감지
    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section[id], .step, .related-content');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionId = entry.target.id || this.getSectionId(entry.target);
                    if (sectionId && sectionId !== this.currentSection) {
                        this.trackSectionChange(sectionId);
                    }
                }
            });
        }, {
            threshold: 0.5, // 50% 이상 보일 때 트리거
            rootMargin: '-50px 0px' // 약간의 여백
        });

        sections.forEach(section => observer.observe(section));
    }

    // 🎯 클릭 이벤트 추적
    setupClickTracking() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // 단계 버튼 클릭
            if (target.matches('.step-button, .next-step, .prev-step')) {
                const stepId = target.getAttribute('data-step') || this.getStepFromButton(target);
                if (stepId) {
                    this.trackSectionChange(stepId, 'button_click');
                }
            }
            
            // 네비게이션 클릭
            if (target.matches('.nav-item, .menu-item')) {
                const sectionId = target.getAttribute('href')?.replace('#', '') || 
                                target.getAttribute('data-section');
                if (sectionId) {
                    this.trackSectionChange(sectionId, 'navigation_click');
                }
            }
            
            // 관련 콘텐츠 클릭
            if (target.matches('.related-content a, .blog-card, .website-card')) {
                window.trackClick('related_content_link', {
                    link_text: target.textContent?.trim(),
                    link_url: target.href,
                    content_type: target.getAttribute('data-type') || 'unknown'
                });
            }
            
            // 이메일 관련 버튼
            if (target.matches('.email-button, .send-button, .test-button')) {
                window.trackClick('email_action_button', {
                    button_type: target.className,
                    button_text: target.textContent?.trim()
                });
            }
        });
    }

    // 🎯 스크롤 기반 진행률 추적
    setupScrollTracking() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                // 25%, 50%, 75%, 100% 지점에서 추적
                if ([25, 50, 75, 100].includes(scrollPercent)) {
                    window.trackClick('scroll_milestone', {
                        scroll_percent: scrollPercent,
                        page_section: this.currentSection
                    });
                }
            }, 100);
        });
    }

    // 섹션 변경 추적
    trackSectionChange(sectionId, triggerType = 'scroll') {
        const sectionTitle = this.sectionTitles[sectionId] || `${sectionId} 섹션`;
        
        // GA4에 페이지뷰 전송
        window.trackPage(sectionId, sectionTitle, {
            trigger_type: triggerType,
            previous_section: this.currentSection,
            section_change_time: new Date().toISOString()
        });
        
        // 단계별 진행 추적
        if (sectionId.startsWith('step')) {
            const stepNumber = parseInt(sectionId.replace('step', ''));
            window.trackStep(stepNumber, sectionTitle, false);
        }
        
        this.currentSection = sectionId;
        
        // URL 해시 업데이트 (선택사항)
        if (history.pushState) {
            history.pushState(null, null, `#${sectionId}`);
        }
    }

    // 유틸리티 함수들
    getSectionId(element) {
        if (element.classList.contains('step')) {
            return element.getAttribute('data-step') || 'step1';
        }
        if (element.classList.contains('related-content')) {
            return 'related-content';
        }
        return element.closest('[id]')?.id || 'unknown';
    }

    getStepFromButton(button) {
        const stepText = button.textContent?.toLowerCase();
        if (stepText?.includes('1') || stepText?.includes('설정')) return 'step1';
        if (stepText?.includes('2') || stepText?.includes('테스트')) return 'step2';
        if (stepText?.includes('3') || stepText?.includes('발송')) return 'step3';
        return null;
    }
}

// 페이지 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    new PageTracker();
});

export { PageTracker };