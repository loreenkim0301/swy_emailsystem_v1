/**
 * ContentCard 컴포넌트 메인 진입점
 */

export { ContentCard, createContentCard } from './ContentCard.js';

// CSS 자동 로드 (선택사항)
if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './components/ContentCard/ContentCard.css';
    document.head.appendChild(link);
}