/**
 * Related Content Component
 * 연관 콘텐츠 섹션을 위한 재사용 가능한 컴포넌트
 */

export class RelatedContentComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      // 기본 설정
      sections: [],
      dataService: null,
      onCardClick: null,
      loadingText: '로딩 중...',
      errorText: '콘텐츠를 불러오는데 실패했습니다.',
      emptyText: '표시할 콘텐츠가 없습니다.',
      ...options
    };
    
    this.state = {
      loading: false,
      error: null,
      data: {}
    };
  }

  /**
   * 컴포넌트 초기화
   */
  async init() {
    try {
      this.render();
      await this.loadData();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 데이터 로드
   */
  async loadData() {
    if (!this.options.dataService) {
      throw new Error('데이터 서비스가 설정되지 않았습니다.');
    }

    this.setState({ loading: true, error: null });

    try {
      const data = {};
      
      for (const section of this.options.sections) {
        const result = await this.options.dataService.getContentByCategory(
          section.category,
          { limit: section.limit || 6 }
        );
        
        if (result.success) {
          data[section.id] = {
            ...section,
            items: result.data || []
          };
        }
      }

      this.setState({ loading: false, data });
      this.render();

    } catch (error) {
      this.setState({ loading: false, error: error.message });
      this.render();
    }
  }

  /**
   * 상태 업데이트
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  /**
   * 렌더링
   */
  render() {
    if (!this.container) return;

    if (this.state.loading) {
      this.container.innerHTML = this.renderLoading();
      return;
    }

    if (this.state.error) {
      this.container.innerHTML = this.renderError();
      return;
    }

    this.container.innerHTML = this.renderContent();
    this.bindEvents();
  }

  /**
   * 로딩 상태 렌더링
   */
  renderLoading() {
    return `
      <div class="related-content">
        <div class="related-content__loading">
          ${this.options.loadingText}
        </div>
      </div>
    `;
  }

  /**
   * 에러 상태 렌더링
   */
  renderError() {
    return `
      <div class="related-content">
        <div class="related-content__error">
          ${this.state.error || this.options.errorText}
        </div>
      </div>
    `;
  }

  /**
   * 메인 콘텐츠 렌더링
   */
  renderContent() {
    const sections = Object.values(this.state.data);
    
    if (sections.length === 0) {
      return `
        <div class="related-content">
          <div class="related-content__empty">
            ${this.options.emptyText}
          </div>
        </div>
      `;
    }

    return `
      <div class="related-content">
        <h2 class="related-content__title">🔗 연관 콘텐츠</h2>
        <div class="related-content__sections">
          ${sections.map(section => this.renderSection(section)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 섹션 렌더링
   */
  renderSection(section) {
    return `
      <div class="related-content__section" data-section="${section.id}">
        <h3 class="related-content__section-title">
          ${section.icon || ''} ${section.title}
        </h3>
        <div class="related-content__grid">
          ${section.items.map(item => this.renderCard(item, section.category)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 카드 렌더링
   */
  renderCard(item, category) {
    const status = this.determineStatus(item);
    const hasLink = status === 'published';
    
    return `
      <article class="related-content__card" 
               data-item-id="${item.id}" 
               data-category="${category}"
               tabindex="0"
               role="button"
               aria-label="${item.title}">
        <h4 class="related-content__card-title">
          ${item.title || '제목 없음'}
        </h4>
        <p class="related-content__card-description">
          ${item.description || '설명이 없습니다.'}
        </p>
        <div class="related-content__card-footer">
          <span class="related-content__status related-content__status--${status}">
            ${this.getStatusText(status)}
          </span>
          ${hasLink ? `
            <a href="${item.url}" 
               class="related-content__link" 
               target="_blank" 
               rel="noopener noreferrer"
               onclick="event.stopPropagation()">
              자세히 보기
            </a>
          ` : ''}
        </div>
      </article>
    `;
  }

  /**
   * 상태 결정 로직
   */
  determineStatus(item) {
    // 비즈니스 로직: status='published' + url 존재 → published
    // 그 외 모든 경우 → coming-soon
    if (item.status === 'published' && item.url && item.url.trim() !== '') {
      return 'published';
    }
    return 'coming-soon';
  }

  /**
   * 상태 텍스트 반환
   */
  getStatusText(status) {
    const statusMap = {
      'published': '공개됨',
      'coming-soon': '출시 예정'
    };
    return statusMap[status] || status;
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    const cards = this.container.querySelectorAll('.related-content__card');
    
    cards.forEach(card => {
      // 클릭 이벤트
      card.addEventListener('click', (e) => this.handleCardClick(e));
      
      // 키보드 이벤트 (접근성)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(e);
        }
      });
    });
  }

  /**
   * 카드 클릭 핸들러
   */
  handleCardClick(event) {
    const card = event.currentTarget;
    const itemId = card.dataset.itemId;
    const category = card.dataset.category;
    
    // 데이터에서 아이템 찾기
    const item = this.findItemById(itemId);
    if (!item) return;

    // 콘솔 로그
    console.log(`🔗 연관 게시글 클릭됨:`, {
      id: item.id,
      title: item.title,
      type: category,
      status: item.status,
      hasUrl: !!(item.url && item.url.trim() !== ''),
      url: item.url || null
    });

    // 조회수 증가 (비동기)
    this.incrementViewCount(item.id);

    // 커스텀 클릭 핸들러 실행
    if (this.options.onCardClick) {
      this.options.onCardClick(item, category);
    }

    // 기본 동작: 링크가 있으면 새 탭에서 열기
    const status = this.determineStatus(item);
    if (status === 'published') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      this.showTemporaryMessage('🚀 이 콘텐츠는 곧 출시될 예정입니다!');
    }
  }

  /**
   * ID로 아이템 찾기
   */
  findItemById(itemId) {
    for (const section of Object.values(this.state.data)) {
      const item = section.items.find(item => item.id.toString() === itemId);
      if (item) return item;
    }
    return null;
  }

  /**
   * 조회수 증가
   */
  async incrementViewCount(itemId) {
    try {
      if (this.options.dataService && this.options.dataService.incrementViewCount) {
        const result = await this.options.dataService.incrementViewCount(itemId);
        if (result.success) {
          console.log(`📈 조회수 증가: 게시글 ID ${itemId}`);
        }
      }
    } catch (error) {
      console.warn(`조회수 증가 실패: 게시글 ID ${itemId}`, error);
    }
  }

  /**
   * 임시 메시지 표시
   */
  showTemporaryMessage(message) {
    const tempMessage = document.createElement('div');
    tempMessage.className = 'status-message status-info';
    tempMessage.innerHTML = `<span>💡</span><span>${message}</span>`;
    tempMessage.style.position = 'fixed';
    tempMessage.style.top = '20px';
    tempMessage.style.left = '50%';
    tempMessage.style.transform = 'translateX(-50%)';
    tempMessage.style.zIndex = '9999';
    tempMessage.style.maxWidth = '90%';
    
    document.body.appendChild(tempMessage);
    
    setTimeout(() => {
      tempMessage.remove();
    }, 3000);
  }

  /**
   * 에러 핸들러
   */
  handleError(error) {
    console.error('RelatedContent 컴포넌트 오류:', error);
    this.setState({ error: error.message, loading: false });
    this.render();
  }

  /**
   * 컴포넌트 정리
   */
  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * 데이터 새로고침
   */
  async refresh() {
    await this.loadData();
  }

  /**
   * 설정 업데이트
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }
}