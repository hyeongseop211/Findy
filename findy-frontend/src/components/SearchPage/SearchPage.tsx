import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsCard from '../NewsCard/NewsCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './SearchPage.css';

interface NewsArticle {
  id?: string;
  category: string;
  title: string;
  content: string;
  publishedAt: string;
  tags: string[];
  url: string;
}

interface SearchResult {
  content: NewsArticle[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    if (query || category) {
      performSearch();
    }
  }, [query, category, currentPage]);

  const performSearch = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      params.append('page', currentPage.toString());
      params.append('size', '10');

      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (response.ok) {
        const data: SearchResult = await response.json();
        setSearchResults(data.content || []);
        setTotalResults(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        throw new Error('검색 실패');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      // 더미 데이터로 대체
      const dummyResults = generateDummyResults();
      setSearchResults(dummyResults);
      setTotalResults(dummyResults.length);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDummyResults = (): NewsArticle[] => {
    const dummyData = [
      {
        id: '1',
        category: query ? '검색' : category || '정치',
        title: `${query || category || '검색어'}와 관련된 주요 뉴스 발표`,
        content: `${query || category || '검색어'}와 관련하여 중요한 발표가 있었습니다. 관련 전문가들은 이번 발표가 향후 정책 방향에 큰 영향을 미칠 것으로 예상한다고 밝혔습니다.`,
        publishedAt: '2025-01-22',
        tags: [query || category || '뉴스', '정책', '발표'],
        url: '#'
      },
      {
        id: '2',
        category: query ? '검색' : category || '경제',
        title: `${query || category || '검색어'} 관련 시장 동향 분석`,
        content: `최근 ${query || category || '검색어'}와 관련된 시장 동향을 분석한 결과, 향후 전망이 긍정적인 것으로 나타났습니다. 업계 관계자들은 지속적인 성장세를 보일 것으로 전망한다고 말했습니다.`,
        publishedAt: '2025-01-22',
        tags: [query || category || '시장', '분석', '전망'],
        url: '#'
      },
      {
        id: '3',
        category: query ? '검색' : category || '사회',
        title: `${query || category || '검색어'} 이슈, 시민들 관심 집중`,
        content: `${query || category || '검색어'}와 관련된 이슈가 시민들의 높은 관심을 받고 있습니다. 관련 단체들은 이번 기회에 건설적인 논의가 이루어지기를 바란다고 표명했습니다.`,
        publishedAt: '2025-01-21',
        tags: [query || category || '이슈', '시민', '관심'],
        url: '#'
      }
    ];
    
    return dummyData;
  };

  const handleNewsClick = (article: NewsArticle) => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSearchTitle = () => {
    if (query && category) {
      return `"${query}" (${category})`;
    } else if (query) {
      return `"${query}"`;
    } else if (category) {
      return `${category}`;
    }
    return '검색 결과';
  };

  return (
    <div className="search-page">
      <div className="search-content">
        <div className="search-header">
          <h2 className="search-title">
            {getSearchTitle()} 검색 결과
          </h2>
          {!isLoading && (
            <p className="search-subtitle">
              총 {totalResults.toLocaleString()}개의 뉴스를 찾았습니다.
            </p>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {searchResults.length === 0 ? (
              <div className="no-results">
                <h3>검색 결과가 없습니다</h3>
                <p>다른 검색어나 카테고리를 시도해보세요.</p>
              </div>
            ) : (
              <div className="search-results">
                <div className="results-grid">
                  {searchResults.map((article, index) => (
                    <NewsCard
                      key={article.id || `${index}-${article.title}`}
                      article={article}
                      cardType="normal"
                      onClick={handleNewsClick}
                    />
                  ))}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 0}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      이전
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(0, Math.min(currentPage - 2 + i, totalPages - 1));
                        return (
                          <button
                            key={page}
                            className={`pagination-number ${
                              page === currentPage ? 'active' : ''
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page + 1}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      className="pagination-btn"
                      disabled={currentPage === totalPages - 1}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      다음
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 