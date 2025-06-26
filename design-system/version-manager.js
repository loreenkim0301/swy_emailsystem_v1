// 디자인 시스템 버전 관리자 v2.0
class DesignSystemManager {
    constructor() {
        this.currentVersion = 'v2.1.5';
        this.versions = {
            'v1.0.0': {
                name: '기본 HTML 스타일',
                date: '2024-12-26',
                description: '브라우저 기본 스타일 기반의 단순한 디자인',
                file: 'design-system/v1.0.0/styles.css',
                features: [
                    '기본 HTML 스타일링',
                    '단순한 레이아웃',
                    '시스템 폰트 사용',
                    '기본 색상 팔레트'
                ],
                components: ['header', 'step', 'form', 'button'],
                status: 'deprecated'
            },
            'v2.0.0': {
                name: '모던 그라데이션',
                date: '2024-12-26',
                description: '보라-파랑 그라데이션과 카드 기반 디자인 도입',
                file: 'design-system/v2.0.0/styles.css',
                features: [
                    '그라데이션 헤더',
                    'Pretendard 웹폰트',
                    '카드 레이아웃',
                    'CSS 변수 시스템'
                ],
                components: ['header', 'step', 'form', 'button', 'card'],
                status: 'stable'
            },
            'v2.1.0': {
                name: '향상된 카드 시스템',
                date: '2024-12-26',
                description: '호버 효과와 그림자 시스템이 추가된 인터랙티브 디자인',
                file: 'design-system/v2.1.0/styles.css',
                features: [
                    '호버 애니메이션',
                    'JetBrains Mono 폰트',
                    '그림자 시스템',
                    '텍스처 오버레이'
                ],
                components: ['header', 'step', 'form', 'button', 'card', 'related-content'],
                status: 'stable'
            },
            'v2.1.5': {
                name: '뉴스레터 + 다크 푸터',
                date: '2024-12-26',
                description: '뉴스레터 구독 섹션과 다크 테마 푸터가 추가된 완성형',
                file: 'design-system/v2.1.5/styles.css',
                features: [
                    '뉴스레터 구독 폼',
                    '다크 테마 푸터',
                    '소셜 링크 버튼',
                    '반응형 푸터 그리드',
                    '완전한 디자인 토큰 시스템',
                    '접근성 개선',
                    '성능 최적화'
                ],
                components: [
                    'header', 'step', 'form', 'button', 'card', 
                    'related-content', 'newsletter', 'footer', 'status-message'
                ],
                status: 'current',
                deployed: true,
                url: 'https://vibecodezero-emailjs.netlify.app/'
            },
            'v2.2.0': {
                name: '완전한 디자인 시스템',
                date: '2024-12-26 (계획)',
                description: '다크 모드와 테마 시스템이 포함된 완전한 디자인 시스템',
                file: 'design-system/v2.2.0/styles.css',
                features: [
                    '다크 모드 지원',
                    '테마 시스템',
                    '더 많은 컴포넌트',
                    '애니메이션 라이브러리',
                    '고급 접근성'
                ],
                components: [
                    'header', 'step', 'form', 'button', 'card', 
                    'related-content', 'newsletter', 'footer', 'status-message',
                    'modal', 'dropdown', 'tooltip', 'tabs'
                ],
                status: 'planned'
            }
        };
        
        this.designTokens = {
            colors: {
                primary: '#667eea',
                secondary: '#764ba2',
                text: {
                    primary: '#333333',
                    secondary: '#666666',
                    muted: '#999999'
                },
                background: {
                    primary: '#ffffff',
                    secondary: '#f8fafc',
                    light: '#f1f5f9'
                },
                dark: {
                    bg: '#1a202c',
                    text: '#e2e8f0'
                }
            },
            spacing: {
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2rem',
                xl: '3rem'
            },
            typography: {
                fontFamily: {
                    primary: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                    mono: 'JetBrains Mono, Monaco, Consolas, monospace'
                },
                fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem',
                    '4xl': '2.25rem'
                }
            }
        };
    }

    // 현재 버전 정보 조회
    getCurrentVersion() {
        return {
            version: this.currentVersion,
            ...this.versions[this.currentVersion]
        };
    }

    // 모든 버전 목록 조회
    getAllVersions() {
        return Object.keys(this.versions).map(version => ({
            version,
            ...this.versions[version],
            isCurrent: version === this.currentVersion
        }));
    }

    // 특정 버전 정보 조회
    getVersionInfo(version) {
        return this.versions[version] || null;
    }

    // 버전 비교
    compareVersions(version1, version2) {
        const v1 = this.versions[version1];
        const v2 = this.versions[version2];
        
        if (!v1 || !v2) {
            throw new Error('비교할 버전을 찾을 수 없습니다.');
        }

        const addedFeatures = v2.features.filter(f => !v1.features.includes(f));
        const removedFeatures = v1.features.filter(f => !v2.features.includes(f));
        const addedComponents = v2.components.filter(c => !v1.components.includes(c));
        const removedComponents = v1.components.filter(c => !v2.components.includes(c));

        return {
            version1: { version: version1, ...v1 },
            version2: { version: version2, ...v2 },
            differences: {
                features: {
                    added: addedFeatures,
                    removed: removedFeatures,
                    common: v1.features.filter(f => v2.features.includes(f))
                },
                components: {
                    added: addedComponents,
                    removed: removedComponents,
                    common: v1.components.filter(c => v2.components.includes(c))
                }
            }
        };
    }

    // 버전 전환
    async switchToVersion(version) {
        if (!this.versions[version]) {
            throw new Error(`버전 ${version}을 찾을 수 없습니다.`);
        }

        try {
            // 기존 스타일 제거
            const existingStyle = document.getElementById('design-system-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            // 새 스타일 로드
            const link = document.createElement('link');
            link.id = 'design-system-styles';
            link.rel = 'stylesheet';
            link.href = this.versions[version].file;
            
            // 로드 완료 대기
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });

            this.currentVersion = version;
            
            // 이벤트 발송
            this.dispatchVersionChangeEvent(version);
            
            console.log(`✅ 디자인 시스템이 ${version}으로 전환되었습니다.`);
            return true;

        } catch (error) {
            console.error(`❌ 버전 전환 실패:`, error);
            throw error;
        }
    }

    // 버전 변경 이벤트 발송
    dispatchVersionChangeEvent(version) {
        const event = new CustomEvent('designSystemVersionChanged', {
            detail: {
                version,
                versionInfo: this.versions[version],
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }

    // 디자인 토큰 조회
    getDesignTokens() {
        return this.designTokens;
    }

    // 컴포넌트 목록 조회
    getComponents(version = null) {
        const targetVersion = version || this.currentVersion;
        return this.versions[targetVersion]?.components || [];
    }

    // 버전 히스토리 생성
    generateHistory() {
        return Object.keys(this.versions)
            .sort()
            .map(version => ({
                version,
                ...this.versions[version],
                isCurrent: version === this.currentVersion
            }));
    }

    // 통계 정보 생성
    getStatistics() {
        const versions = Object.values(this.versions);
        const totalFeatures = [...new Set(versions.flatMap(v => v.features))];
        const totalComponents = [...new Set(versions.flatMap(v => v.components))];
        
        return {
            totalVersions: versions.length,
            totalFeatures: totalFeatures.length,
            totalComponents: totalComponents.length,
            currentVersion: this.currentVersion,
            deployedVersions: versions.filter(v => v.deployed).length,
            stableVersions: versions.filter(v => v.status === 'stable').length
        };
    }

    // CSS 변수 추출
    extractCSSVariables() {
        const root = getComputedStyle(document.documentElement);
        const variables = {};
        
        // 주요 CSS 변수들 추출
        const variableNames = [
            '--primary-gradient', '--text-primary', '--background-primary',
            '--spacing-sm', '--spacing-md', '--spacing-lg',
            '--font-size-base', '--font-size-lg', '--font-size-xl',
            '--border-radius-md', '--shadow-md', '--transition-base'
        ];
        
        variableNames.forEach(name => {
            variables[name] = root.getPropertyValue(name).trim();
        });
        
        return variables;
    }

    // 성능 분석
    analyzePerformance() {
        const styleSheets = Array.from(document.styleSheets);
        const designSystemSheet = styleSheets.find(sheet => 
            sheet.href && sheet.href.includes('design-system')
        );
        
        if (!designSystemSheet) {
            return { error: '디자인 시스템 스타일시트를 찾을 수 없습니다.' };
        }
        
        try {
            const rules = Array.from(designSystemSheet.cssRules || []);
            return {
                totalRules: rules.length,
                mediaQueries: rules.filter(rule => rule.type === CSSRule.MEDIA_RULE).length,
                keyframes: rules.filter(rule => rule.type === CSSRule.KEYFRAMES_RULE).length,
                variables: rules.filter(rule => 
                    rule.selectorText === ':root' && 
                    rule.style.length > 0
                ).length
            };
        } catch (error) {
            return { error: '스타일시트 분석 중 오류가 발생했습니다.' };
        }
    }
}

// 전역 인스턴스 생성
window.designSystemManager = new DesignSystemManager();

// 편의 함수들
window.switchDesignVersion = async (version) => {
    try {
        await window.designSystemManager.switchToVersion(version);
        return `디자인이 ${version}으로 변경되었습니다!`;
    } catch (error) {
        return `버전 전환 실패: ${error.message}`;
    }
};

window.showVersionHistory = () => {
    const history = window.designSystemManager.generateHistory();
    console.table(history);
    return history;
};

window.compareDesignVersions = (v1, v2) => {
    try {
        const comparison = window.designSystemManager.compareVersions(v1, v2);
        console.log('버전 비교 결과:', comparison);
        return comparison;
    } catch (error) {
        console.error('버전 비교 실패:', error);
        return null;
    }
};

window.getDesignTokens = () => {
    return window.designSystemManager.getDesignTokens();
};

window.analyzeDesignSystem = () => {
    const stats = window.designSystemManager.getStatistics();
    const performance = window.designSystemManager.analyzePerformance();
    const variables = window.designSystemManager.extractCSSVariables();
    
    return {
        statistics: stats,
        performance: performance,
        cssVariables: variables,
        currentVersion: window.designSystemManager.getCurrentVersion()
    };
};

// 버전 변경 이벤트 리스너 예시
window.addEventListener('designSystemVersionChanged', (event) => {
    console.log('디자인 시스템 버전이 변경되었습니다:', event.detail);
});

export { DesignSystemManager };