import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Findy</h4>
            <p className="footer-description">
              AI 기반 뉴스 검색 엔진으로 정확하고 빠른 뉴스를 제공합니다.
            </p>
          </div>
          
          <div className="footer-section">
            <h5 className="footer-subtitle">서비스</h5>
            <ul className="footer-links">
              <li><a href="/" className="footer-link">홈</a></li>
              <li><a href="/search" className="footer-link">검색</a></li>
              <li><a href="#" className="footer-link">카테고리</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5 className="footer-subtitle">정보</h5>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">회사 소개</a></li>
              <li><a href="#" className="footer-link">이용약관</a></li>
              <li><a href="#" className="footer-link">개인정보처리방침</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5 className="footer-subtitle">문의</h5>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">고객센터</a></li>
              <li><a href="#" className="footer-link">제휴 문의</a></li>
              <li><a href="#" className="footer-link">광고 문의</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © 2025 Findy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 