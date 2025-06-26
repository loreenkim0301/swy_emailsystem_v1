// 디자인 시스템 버전 관리자
class DesignVersionManager {
    constructor() {
        this.versions = {
            'v1.0.0': {
                name: '기본 HTML 스타일',
                date: '2024-12-26',
                description: '브라우저 기본 스타일 기반',
                file: 'design-system/v1.0.0/styles.css',
                features: ['기본 HTML 스타일', '단순한 레이아웃', '시스템 폰트']
            },
            'v2.0.0': {
                name: '모던 그라데이션',
                date: '2024-12-26', 
                description: '보라-파랑 그라데이션, 카드 디자인',
                file: 'design-system/v2.0.0/styles.css',
                features: ['그라데이션 헤더', 'Pretendard 폰트', '카드 레이아웃']
            },
            'v2.1.0': {
                name: '향상된 카드 시스템',
                date: '2024-12-26',
                description: '호버 효과, 그림자 시스템',
                file: 'design-system/v2.1.0/styles.css',
                features: ['호버 애니메이션', 'JetBrains Mono', '그림자 시스템']
            },
            'v2.2.0': {
                name: '완전한 디자인 시스템',
                date: '2024-12-26',
                description: '체계적인 컬러 팔레트, 모바일 퍼스트',
                file: 'design-system/v2.2.0/styles.css',
                features: ['CSS 변수 시스템', '반응형 그리드', '최적화된 폰트']
            }
        };
        
        this.currentVersion = 'v2.2.0';
    }

    // 버전 목록 조회
    getVersions() {
        return this.versions;
    }

    // 현재 버전 조회
    getCurrentVersion() {
        return this.currentVersion;
    }

    // 버전 정보 조회
    getVersionInfo(version) {
        return this.versions[version] || null;
    }

    // 버전 전환
    async switchToVersion(version) {
        if (!this.versions[version]) {
            throw new Error(`버전 ${version}을 찾을 수 없습니다.`);
        }

        try {
            // CSS 파일 로드
            const response = await fetch(this.versions[version].file);
            const cssContent = await response.text();
            
            // 기존 스타일 제거
            const existingStyle = document.getElementById('design-system-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            // 새 스타일 적용
            const styleElement = document.createElement('style');
            styleElement.id = 'design-system-styles';
            styleElement.textContent = cssContent;
            document.head.appendChild(styleElement);

            this.currentVersion = version;
            
            console.log(`✅ 디자인 시스템이 ${version}으로 전환되었습니다.`);
            return true;

        } catch (error) {
            console.error(`❌ 버전 전환 실패:`, error);
            throw error;
        }
    }

    // 버전 비교
    compareVersions(version1, version2) {
        const v1Info = this.versions[version1];
        const v2Info = this.versions[version2];
        
        if (!v1Info || !v2Info) {
            throw new Error('비교할 버전을 찾을 수 없습니다.');
        }

        return {
            version1: { version: version1, ...v1Info },
            version2: { version: version2, ...v2Info },
            differences: this.findDifferences(v1Info.features, v2Info.features)
        };
    }

    // 기능 차이점 찾기
    findDifferences(features1, features2) {
        const added = features2.filter(f => !features1.includes(f));
        const removed = features1.filter(f => !features2.includes(f));
        const common = features1.filter(f => features2.includes(f));

        return { added, removed, common };
    }

    // 버전 히스토리 생성
    generateHistory() {
        const sortedVersions = Object.keys(this.versions).sort();
        
        return sortedVersions.map(version => ({
            version,
            ...this.versions[version],
            isCurrent: version === this.currentVersion
        }));
    }
}

// 전역 인스턴스 생성
window.designVersionManager = new DesignVersionManager();

// 사용 예시 함수들
window.switchDesignVersion = async (version) => {
    try {
        await window.designVersionManager.switchToVersion(version);
        alert(`디자인이 ${version}으로 변경되었습니다!`);
    } catch (error) {
        alert(`버전 전환 실패: ${error.message}`);
    }
};

window.showVersionHistory = () => {
    const history = window.designVersionManager.generateHistory();
    console.table(history);
    return history;
};

window.compareDesignVersions = (v1, v2) => {
    try {
        const comparison = window.designVersionManager.compareVersions(v1, v2);
        console.log('버전 비교 결과:', comparison);
        return comparison;
    } catch (error) {
        console.error('버전 비교 실패:', error);
    }
};

export { DesignVersionManager };