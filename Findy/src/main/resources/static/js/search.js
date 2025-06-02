class SearchEngine {
    constructor() {
        this.apiBase = '/api/search';
        this.searchInput = document.getElementById('searchInput');
        this.searchForm = document.getElementById('searchForm');
        this.autocompleteContainer = document.getElementById('autocompleteContainer');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.popularContainer = document.getElementById('popularContainer');
        
        this.currentPage = 0;
        this.currentQuery = '';
        this.currentCategory = '';
        
        this.init();
    }
    
    init() {
        this.loadPopularQueries();
        this.setupEventListeners();
        this.setupAutocomplete();
    }
    
    setupEventListeners() {
        // 검색 폼 제출
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });
        
        // 검색 버튼 클릭
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.performSearch();
        });
        
        // 엔터키 검색
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                this.handleAutocompleteNavigation(e);
            } else if (e.key === 'Escape') {
                this.hideAutocomplete();
            }
        });
        
        // 카테고리 변경
        document.getElementById('categorySelect').addEventListener('change', () => {
            if (this.currentQuery) {
                this.performSearch();
            }
        });
        
        // 클릭 외부 영역에서 자동완성 숨기기
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-form')) {
                this.hideAutocomplete();
            }
        });
    }
    
    setupAutocomplete() {
        let debounceTimer;
        
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(debounceTimer);
            
            if (query.length >= 2) {
                debounceTimer = setTimeout(() => {
                    this.loadAutocomplete(query);
                }, 300);
            } else {
                this.hideAutocomplete();
            }
        });
    }
    
    async loadAutocomplete(query) {
        try {
            const response = await fetch(`${this.apiBase}/autocomplete?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const suggestions = await response.json();
                this.showAutocomplete(suggestions);
            }
        } catch (error) {
            console.error('자동완성 로드 실패:', error);
        }
    }
    
    showAutocomplete(suggestions) {
        if (suggestions.length === 0) {
            this.hideAutocomplete();
            return;
        }
        
        const html = suggestions.map(suggestion => `
            <div class="autocomplete-item" data-value="${suggestion}">
                ${this.highlightQuery(suggestion, this.searchInput.value)}
            </div>
        `).join('');
        
        this.autocompleteContainer.innerHTML = html;
        this.autocompleteContainer.style.display = 'block';
        
        // 자동완성 항목 클릭 이벤트
        this.autocompleteContainer.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                this.searchInput.value = item.dataset.value;
                this.hideAutocomplete();
                this.performSearch();
            });
        });
    }
    
    hideAutocomplete() {
        this.autocompleteContainer.style.display = 'none';
    }
    
    highlightQuery(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }
    
    handleAutocompleteNavigation(e) {
        const items = this.autocompleteContainer.querySelectorAll('.autocomplete-item');
        const currentSelected = this.autocompleteContainer.querySelector('.autocomplete-item.selected');
        let nextSelected;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentSelected) {
                nextSelected = currentSelected.nextElementSibling || items[0];
                currentSelected.classList.remove('selected');
            } else {
                nextSelected = items[0];
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentSelected) {
                nextSelected = currentSelected.previousElementSibling || items[items.length - 1];
                currentSelected.classList.remove('selected');
            } else {
                nextSelected = items[items.length - 1];
            }
        }
        
        if (nextSelected) {
            nextSelected.classList.add('selected');
            this.searchInput.value = nextSelected.dataset.value;
        }
    }
    
    async loadPopularQueries() {
        try {
            const response = await fetch(`${this.apiBase}/popular`);
            if (response.ok) {
                const popularQueries = await response.json();
                this.showPopularQueries(popularQueries);
            }
        } catch (error) {
            console.error('인기 검색어 로드 실패:', error);
        }
    }
    
    showPopularQueries(queries) {
        if (queries.length === 0) return;
        
        const html = queries.map(query => `
            <button class="popular-tag" onclick="searchEngine.searchByTag('${query}')">
                ${query}
            </button>
        `).join('');
        
        this.popularContainer.innerHTML = html;
    }
    
    searchByTag(query) {
        this.searchInput.value = query;
        this.performSearch();
    }
    
    async performSearch(page = 0) {
        const query = this.searchInput.value.trim();
        const category = document.getElementById('categorySelect').value;
        
        if (!query) {
            this.showError('검색어를 입력해주세요.');
            return;
        }
        
        this.currentQuery = query;
        this.currentCategory = category;
        this.currentPage = page;
        
        this.showLoading();
        this.hideAutocomplete();
        
        try {
            const params = new URLSearchParams({
                q: query,
                page: page,
                size: 10
            });
            
            if (category) {
                params.append('category', category);
            }
            
            const startTime = Date.now();
            const response = await fetch(`${this.apiBase}?${params}`);
            const searchTime = Date.now() - startTime;
            
            if (response.ok) {
                const data = await response.json();
                this.showResults(data, query, searchTime);
            } else {
                throw new Error('검색 실패');
            }
        } catch (error) {
            console.error('검색 오류:', error);
            this.showError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }
    
    showLoading() {
        this.resultsContainer.innerHTML = '<div class="loading">검색 중...</div>';
        this.resultsContainer.style.display = 'block';
    }
    
    showResults(data, query, searchTime) {
        if (data.content.length === 0) {
            this.showNoResults(query);
            return;
        }
        
        const resultsHtml = `
            <div class="results-header">
                <div class="results-count">
                    총 ${data.totalElements.toLocaleString()}개의 결과 (${data.totalPages}페이지 중 ${data.number + 1}페이지)
                </div>
                <div class="search-time">
                    검색 시간: ${searchTime}ms
                </div>
            </div>
            
            <div class="results-list">
                ${data.content.map(item => this.renderResultItem(item, query)).join('')}
            </div>
            
            ${this.renderPagination(data)}
        `;
        
        this.resultsContainer.innerHTML = resultsHtml;
        this.resultsContainer.style.display = 'block';
        
        // 스크롤을 결과 영역으로 이동
        this.resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    renderResultItem(item, query) {
        const highlightedTitle = this.highlightQuery(item.title || '', query);
        const highlightedContent = this.highlightQuery(item.content || '', query);
        
        return `
            <div class="result-item">
                <div class="result-title">
                    <a href="${item.url || '#'}" target="_blank">
                        ${highlightedTitle}
                    </a>
                </div>
                
                <div class="result-meta">
                    ${item.category ? `<div class="result-category">${item.category}</div>` : ''}
                    ${item.author ? `<div class="result-author">${item.author}</div>` : ''}
                    ${item.publishedAt ? `<div class="result-date">${this.formatDate(item.publishedAt)}</div>` : ''}
                </div>
                
                <div class="result-content">
                    ${this.truncateContent(highlightedContent, 200)}
                </div>
                
                ${item.tags && item.tags.length > 0 ? `
                    <div class="result-tags">
                        ${item.tags.map(tag => `<span class="result-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderPagination(data) {
        if (data.totalPages <= 1) return '';
        
        const currentPage = data.number;
        const totalPages = data.totalPages;
        const startPage = Math.max(0, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);
        
        let paginationHtml = '<div class="pagination">';
        
        // 이전 페이지
        if (currentPage > 0) {
            paginationHtml += `
                <button class="page-btn" onclick="searchEngine.performSearch(${currentPage - 1})">
                    ‹ 이전
                </button>
            `;
        }
        
        // 첫 페이지
        if (startPage > 0) {
            paginationHtml += `
                <button class="page-btn" onclick="searchEngine.performSearch(0)">1</button>
            `;
            if (startPage > 1) {
                paginationHtml += '<span class="page-ellipsis">...</span>';
            }
        }
        
        // 페이지 번호들
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage ? 'active' : '';
            paginationHtml += `
                <button class="page-btn ${isActive}" onclick="searchEngine.performSearch(${i})">
                    ${i + 1}
                </button>
            `;
        }
        
        // 마지막 페이지
        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
                paginationHtml += '<span class="page-ellipsis">...</span>';
            }
            paginationHtml += `
                <button class="page-btn" onclick="searchEngine.performSearch(${totalPages - 1})">
                    ${totalPages}
                </button>
            `;
        }
        
        // 다음 페이지
        if (currentPage < totalPages - 1) {
            paginationHtml += `
                <button class="page-btn" onclick="searchEngine.performSearch(${currentPage + 1})">
                    다음 ›
                </button>
            `;
        }
        
        paginationHtml += '</div>';
        return paginationHtml;
    }
    
    showNoResults(query) {
        this.resultsContainer.innerHTML = `
            <div class="no-results">
                <strong>"${query}"</strong>에 대한 검색 결과가 없습니다.
                <br><br>
                다른 검색어를 시도해보세요.
            </div>
        `;
        this.resultsContainer.style.display = 'block';
    }
    
    showError(message) {
        this.resultsContainer.innerHTML = `
            <div class="error-message">
                ${message}
            </div>
        `;
        this.resultsContainer.style.display = 'block';
    }
    
    truncateContent(content, maxLength) {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// 페이지 로드 시 검색 엔진 초기화
let searchEngine;
document.addEventListener('DOMContentLoaded', () => {
    searchEngine = new SearchEngine();
    
    // URL 파라미터에서 검색어 확인
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        document.getElementById('searchInput').value = query;
        searchEngine.performSearch();
    }
}); 