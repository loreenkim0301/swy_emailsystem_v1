// 푸터 컴포넌트 클래스
// 재사용 가능한 푸터 컴포넌트

export class FooterComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.config = options.config || {};
        this.subscriptionHandler = options.subscriptionHandler || null;
        
        // 기본 설정
        this.defaultConfig = {
            title: "웹사이트",
            copyright: "© 2025 웹사이트. All rights reserved.",
            sections: []
        };
        
        // 설정 병합
        this.config = { ...this.defaultConfig, ...this.config };
    }

    // 컴포넌트 초기화
    init() {
        this.render();
        this.bindEvents();
    }

    // 메인 렌더링 함수
    render() {
        if (!this.element) {
            console.error('Footer element not found');
            return;
        }

        const footerHTML = `
            <div class="footer-container">
                <div class="footer-content">
                    ${this.renderSections()}
                </div>
                <div class="footer-bottom">
                    <p>${this.config.copyright}</p>
                </div>
            </div>
        `;

        this.element.innerHTML = footerHTML;
    }

    // 섹션들 렌더링
    renderSections() {
        return this.config.sections.map(section => {
            switch (section.type) {
                case 'list':
                    return this.renderListSection(section);
                case 'tech':
                    return this.renderTechSection(section);
                case 'contact':
                    return this.renderContactSection(section);
                case 'subscription':
                    return this.renderSubscriptionSection(section);
                default:
                    return '';
            }
        }).join('');
    }

    // 리스트 섹션 렌더링
    renderListSection(section) {
        const itemsHTML = section.items.map(item => `<li>• ${item}</li>`).join('');
        
        return `
            <div class="footer-section">
                <h3>${section.title}</h3>
                <ul class="footer-links">
                    ${itemsHTML}
                </ul>
            </div>
        `;
    }

    // 기술 스택 섹션 렌더링
    renderTechSection(section) {
        const itemsHTML = section.items.map(item => 
            `<div class="tech-item">${item.icon} ${item.name}</div>`
        ).join('');
        
        return `
            <div class="footer-section">
                <h3>${section.title}</h3>
                <p>${section.description}</p>
                <div class="tech-list">
                    ${itemsHTML}
                </div>
            </div>
        `;
    }

    // 연락처 섹션 렌더링
    renderContactSection(section) {
        const contactsHTML = section.contacts.map(contact => {
            if (contact.type === 'email') {
                return `
                    <div class="contact-item">
                        <span class="label">${contact.label}:</span>
                        <a href="mailto:${contact.value}">${contact.value}</a>
                    </div>
                `;
            } else if (contact.type === 'link') {
                return `
                    <div class="contact-item">
                        <span class="label">${contact.label}:</span>
                        <a href="${contact.url}" target="_blank">${contact.value}</a>
                    </div>
                `;
            }
            return '';
        }).join('');

        return `
            <div class="footer-section">
                <h3>${section.title}</h3>
                <p><strong>${section.author}</strong></p>
                <p style="font-size: 0.75rem; color: #999;">${section.tagline}</p>
                <div class="contact-info">
                    ${contactsHTML}
                </div>
            </div>
        `;
    }

    // 구독 섹션 렌더링
    renderSubscriptionSection(section) {
        const benefitsHTML = section.subscription.benefits
            .map(benefit => `• ${benefit}`)
            .join('<br>\n                           ');

        return `
            <div class="footer-section">
                <h3>${section.title}</h3>
                <p>${section.description}</p>
                
                <div class="subscription-form">
                    <h4>${section.subscription.title}</h4>
                    <p>${benefitsHTML}</p>
                    
                    <div class="subscription-input-group">
                        <input type="email" 
                               id="subscriptionEmail" 
                               class="subscription-input" 
                               placeholder="${section.subscription.placeholder}">
                        <button class="subscription-btn" 
                                id="subscribeBtn"
                                data-section-id="${section.id}">
                            <span id="subscribeBtnText">${section.subscription.button}</span>
                        </button>
                    </div>
                    
                    <div id="subscriptionStatus" class="subscription-status"></div>
                </div>
            </div>
        `;
    }

    // 이벤트 바인딩
    bindEvents() {
        // 구독 버튼 이벤트
        const subscribeBtn = this.element.querySelector('#subscribeBtn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', (e) => {
                this.handleSubscription(e);
            });
        }

        // 엔터키 이벤트
        const emailInput = this.element.querySelector('#subscriptionEmail');
        if (emailInput) {
            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubscription(e);
                }
            });
        }
    }

    // 구독 처리
    async handleSubscription(event) {
        event.preventDefault();
        
        const email = this.element.querySelector('#subscriptionEmail').value.trim();
        const submitBtn = this.element.querySelector('#subscribeBtn');
        
        if (!email) {
            this.showSubscriptionStatus('error', '이메일 주소를 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showSubscriptionStatus('error', '올바른 이메일 주소를 입력해주세요.');
            return;
        }
        
        // 버튼 상태 변경
        const originalText = submitBtn.querySelector('#subscribeBtnText').textContent;
        submitBtn.querySelector('#subscribeBtnText').textContent = '구독 중...';
        submitBtn.disabled = true;
        
        try {
            // 외부 구독 핸들러 호출
            if (this.subscriptionHandler) {
                const result = await this.subscriptionHandler(email);
                
                if (result.success) {
                    this.showSubscriptionStatus('success', result.message);
                    this.element.querySelector('#subscriptionEmail').value = '';
                } else {
                    this.showSubscriptionStatus('error', result.message);
                }
            } else {
                this.showSubscriptionStatus('error', '구독 기능이 설정되지 않았습니다.');
            }
            
        } catch (error) {
            console.error('구독 처리 중 오류:', error);
            this.showSubscriptionStatus('error', error.message || '구독 처리 중 오류가 발생했습니다.');
        } finally {
            // 버튼 상태 복원
            submitBtn.querySelector('#subscribeBtnText').textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // 구독 상태 메시지 표시
    showSubscriptionStatus(type, message) {
        const statusDiv = this.element.querySelector('#subscriptionStatus');
        if (!statusDiv) return;
        
        statusDiv.className = `subscription-status ${type}`;
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        // 자동 숨김 (성공 메시지의 경우)
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }

    // 설정 업데이트
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.render();
        this.bindEvents();
    }

    // 컴포넌트 정리
    destroy() {
        if (this.element) {
            this.element.innerHTML = '';
        }
    }
}