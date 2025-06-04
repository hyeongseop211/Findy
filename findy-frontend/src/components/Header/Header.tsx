import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

interface SearchSuggestion {
  query: string;
  count?: number;
}

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    '전체', '정치', '경제', '사회', '오피니언', 
    '건강', '연예/문화', '스포츠'
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
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
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

  const handlePopularSearchClick = (query: string) => {
    handleSearch(query);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* 로고 섹션 */}
        <div className="logo-section" onClick={handleLogoClick}>
          <img src="/images/Findy_logo.png" alt="Findy Logo" className="logo" />
          <div className="logo-text">
            <h1 className="site-title">Findy</h1>
            <p className="subtitle">AI 기반 뉴스 검색 엔진</p>
          </div>
        </div>

        {/* 검색 섹션 */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              />
              <button 
                className="search-button"
                onClick={() => handleSearch(searchQuery)}
              >
                🔍
              </button>
              
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
            </div>
          </div>

          {/* 인기 검색어 */}
          {popularSearches.length > 0 && (
            <div className="popular-searches">
              <span className="popular-label">🔥 인기:</span>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="popular-tag"
                  onClick={() => handlePopularSearchClick(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* 카테고리 네비게이션 */}
          <nav className="category-nav">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-item ${
                  (location.pathname === '/' && category === '전체') ||
                  location.search.includes(`category=${encodeURIComponent(category)}`)
                    ? 'active' : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 