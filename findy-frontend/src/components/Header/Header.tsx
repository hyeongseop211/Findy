import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

interface SearchSuggestion {
  query: string;
  count?: number;
}

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    '전체', '경제', '오피니언', '사회', '건강', 
    '연예/문화', '스포츠'
  ];

  // 자동완성 데이터 로드
  const loadSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('자동완성 로드 오류:', error);
      // 더미 자동완성 데이터
      const dummySuggestions = [
        { query: `${query} 뉴스` },
        { query: `${query} 정치` },
        { query: `${query} 경제` },
      ];
      setSuggestions(dummySuggestions);
    }
  };

  // 인기 검색어 로드
  const loadPopularSearches = async () => {
    try {
      const response = await fetch('/api/search/popular');
      if (response.ok) {
        const data = await response.json();
        setPopularSearches(data.slice(0, 5));
      }
    } catch (error) {
      console.error('인기 검색어 로드 오류:', error);
      setPopularSearches(['경제', '정치', '사회', 'AI', '스포츠']);
    }
  };

  useEffect(() => {
    loadPopularSearches();
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const categoryParam = selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      navigate(`/search?q=${encodeURIComponent(query.trim())}${categoryParam}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedSuggestionIndex(-1);
    
    if (value.trim().length >= 2) {
      loadSuggestions(value.trim());
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        handleSearch(suggestions[selectedSuggestionIndex].query);
      } else {
        handleSearch(searchQuery);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : -1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev > -1 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (category === '전체') {
      navigate('/');
    } else {
      navigate(`/search?category=${encodeURIComponent(category)}`);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handlePopularSearchClick = (query: string) => {
    handleSearch(query);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="fixed-header">
      <div className="header-container">
        {/* 상단 영역: 로고 + 검색창 + 오른쪽 영역 */}
        <div className="header-top">
          {/* 왼쪽 로고 영역 */}
          <div className="header-left">
            <div className="logo-container" onClick={handleLogoClick}>
              <img src="/images/Findy_logo.png" alt="Findy Logo" className="header-logo" />
            </div>
          </div>
          
          {/* 중앙 검색창 영역 */}
          <div className="header-center">
            <div className="header-search">
              <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                <div className="search-input-container">
                  <select 
                    id="categorySelect" 
                    className="category-select-inner"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">전체</option>
                    <option value="경제">경제</option>
                    <option value="오피니언">오피니언</option>
                    <option value="사회">사회</option>
                    <option value="건강">건강</option>
                    <option value="연예/문화">연예/문화</option>
                    <option value="스포츠">스포츠</option>
                  </select>
                  <div className="search-divider"></div>
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    id="searchInput" 
                    className="search-input-inner" 
                    placeholder="뉴스, 키워드, 주제를 검색해보세요..." 
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    autoComplete="off"
                  />
                  <button type="submit" className="search-btn">
                    🔍
                  </button>
                </div>
                
                {/* 자동완성 드롭다운 */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`suggestion-item ${
                          index === selectedSuggestionIndex ? 'selected' : ''
                        }`}
                        onClick={() => handleSearch(suggestion.query)}
                      >
                        <span className="suggestion-text">{suggestion.query}</span>
                        {suggestion.count && (
                          <span className="suggestion-count">{suggestion.count}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* 오른쪽 영역 */}
          <div className="header-right">
            <div className="user-actions">
              <button className="action-btn" title="알림">
                🔔
              </button>
              <button className="action-btn" title="북마크">
                📚
              </button>
              <button className="action-btn" title="설정">
                ⚙️
              </button>
            </div>
          </div>
        </div>
        
        {/* 하단 영역: 카테고리 네비게이션 */}
        <nav className="header-nav">
          <div className="category-list">
            {categories.map((category) => (
              <a 
                href="#" 
                key={category} 
                className={`category-item ${
                  (location.pathname === '/' && category === '전체') ||
                  location.search.includes(`category=${encodeURIComponent(category)}`)
                    ? 'active' : ''
                }`}
                data-category={category}
                onClick={(e) => { e.preventDefault(); handleCategoryClick(category); }}
              >
                {category}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 