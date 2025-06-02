// 검색 자동완성 기능
class SearchAutocomplete {
    constructor(inputId, dropdownId) {
        this.input = document.getElementById(inputId);
        this.dropdown = document.getElementById(dropdownId);
        this.currentFocus = -1;
        this.suggestions = [];
        
        if (this.input && this.dropdown) {
            this.init();
        }
    }
    
    init() {
        // 입력 이벤트 리스너
        this.input.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        // 키보드 이벤트 리스너
        this.input.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // 포커스 아웃 이벤트
        this.input.addEventListener('blur', () => {
            setTimeout(() => this.hideDropdown(), 150);
        });
        
        // 포커스 인 이벤트
        this.input.addEventListener('focus', () => {
            if (this.input.value.length >= 2) {
                this.handleInput(this.input.value);
            }
        });
    }
    
    async handleInput(query) {
        if (query.length < 2) {
            this.hideDropdown();
            return;
        }
        
        try {
            const response = await fetch(`/api/autocomplete?query=${encodeURIComponent(query)}`);
            const suggestions = await response.json();
            this.showSuggestions(suggestions, query);
        } catch (error) {
            console.error('자동완성 요청 실패:', error);
            this.hideDropdown();
        }
    }
    
    showSuggestions(suggestions, query) {
        this.suggestions = suggestions;
        this.currentFocus = -1;
        
        if (suggestions.length === 0) {
            this.hideDropdown();
            return;
        }
        
        const html = suggestions.map((suggestion, index) => {
            const highlighted = this.highlightMatch(suggestion, query);
            return `<div class="autocomplete-item" data-index="${index}">${highlighted}</div>`;
        }).join('');
        
        this.dropdown.innerHTML = html;
        this.dropdown.style.display = 'block';
        
        // 클릭 이벤트 추가
        this.dropdown.querySelectorAll('.autocomplete-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectSuggestion(index);
            });
        });
    }
    
    hideDropdown() {
        this.dropdown.style.display = 'none';
        this.currentFocus = -1;
    }
    
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    handleKeydown(e) {
        const items = this.dropdown.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.currentFocus++;
            if (this.currentFocus >= items.length) this.currentFocus = 0;
            this.setActive(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.currentFocus--;
            if (this.currentFocus < 0) this.currentFocus = items.length - 1;
            this.setActive(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.currentFocus > -1 && items[this.currentFocus]) {
                this.selectSuggestion(this.currentFocus);
            } else {
                // 폼 제출
                this.input.closest('form').submit();
            }
        } else if (e.key === 'Escape') {
            this.hideDropdown();
        }
    }
    
    setActive(items) {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentFocus);
        });
    }
    
    selectSuggestion(index) {
        if (this.suggestions[index]) {
            this.input.value = this.suggestions[index];
            this.hideDropdown();
            this.input.focus();
        }
    }
}

// 검색 히스토리 관리
class SearchHistory {
    constructor() {
        this.storageKey = 'searchHistory';
        this.maxItems = 10;
    }
    
    add(query) {
        if (!query || query.trim().length === 0) return;
        
        let history = this.get();
        
        // 중복 제거
        history = history.filter(item => item !== query);
        
        // 맨 앞에 추가
        history.unshift(query);
        
        // 최대 개수 제한
        if (history.length > this.maxItems) {
            history = history.slice(0, this.maxItems);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }
    
    get() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch {
            return [];
        }
    }
    
    clear() {
        localStorage.removeItem(this.storageKey);
    }
}

// 검색 통계
class SearchStats {
    constructor() {
        this.updateStats();
    }
    
    async updateStats() {
        try {
            // 실제 구현에서는 서버에서 통계 데이터를 가져옴
            // 여기서는 예시 데이터 사용
            this.animateCounter('.stat-card h4', [1234, 5678, 890]);
        } catch (error) {
            console.error('통계 업데이트 실패:', error);
        }
    }
    
    animateCounter(selector, values) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            if (values[index]) {
                this.countUp(element, 0, values[index], 2000);
            }
        });
    }
    
    countUp(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 자동완성 초기화
    new SearchAutocomplete('searchInput', 'autocompleteDropdown');
    
    // 검색 결과 페이지의 상단 검색바
    if (document.getElementById('topSearchInput')) {
        new SearchAutocomplete('topSearchInput', 'topAutocompleteDropdown');
    }
    
    // 검색 히스토리 초기화
    const searchHistory = new SearchHistory();
    
    // 검색 폼 제출 시 히스토리에 추가
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const queryInput = this.querySelector('input[name="query"]');
            if (queryInput && queryInput.value.trim()) {
                searchHistory.add(queryInput.value.trim());
            }
        });
    });
    
    // 인기 검색어 클릭 이벤트
    document.querySelectorAll('.popular-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const query = this.textContent.trim();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query;
                searchInput.closest('form').submit();
            }
        });
    });
    
    // 통계 애니메이션
    new SearchStats();
    
    // 스크롤 시 헤더 고정
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 아래로 스크롤
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 위로 스크롤
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 검색 결과 애니메이션
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
    
    // 로딩 상태 관리
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading"></span> 검색 중...';
                submitBtn.disabled = true;
                
                // 타임아웃으로 버튼 복원 (실제로는 페이지가 새로고침됨)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    });
    
    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        // Ctrl + K 또는 Cmd + K로 검색창 포커스
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput') || 
                              document.getElementById('topSearchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });
    
    // 툴팁 초기화 (Bootstrap 5)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // 다크 모드 토글 (선택사항)
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        
        // 저장된 다크 모드 설정 복원
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
});

// 유틸리티 함수들
const SearchUtils = {
    // 검색어 하이라이트
    highlightSearchTerms: function(text, searchTerms) {
        if (!searchTerms || searchTerms.length === 0) return text;
        
        const terms = Array.isArray(searchTerms) ? searchTerms : [searchTerms];
        let highlightedText = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
        });
        
        return highlightedText;
    },
    
    // 검색 URL 생성
    buildSearchUrl: function(query, filters = {}) {
        const params = new URLSearchParams();
        params.append('query', query);
        
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });
        
        return `/search?${params.toString()}`;
    },
    
    // 디바운스 함수
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}; 