<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Findy - 뉴스 검색 엔진</title>
    <meta name="description" content="Findy는 AI 기반 뉴스 검색 엔진입니다. 빠르고 정확한 뉴스 검색을 경험해보세요.">
    
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
        }
        
        .welcome-container {
            max-width: 600px;
            padding: 3rem;
            animation: fadeInUp 1s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .logo {
            font-size: 5rem;
            margin-bottom: 1rem;
        }
        
        .title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .feature {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1.5rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .feature-title {
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .feature-desc {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .start-btn {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            color: white;
            text-decoration: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: bold;
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            margin-top: 2rem;
        }
        
        .start-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            text-decoration: none;
            color: white;
        }
        
        .tech-stack {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .tech-title {
            font-size: 1.1rem;
            font-weight: bold;
            margin-bottom: 1rem;
            opacity: 0.9;
        }
        
        .tech-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
        }
        
        .tech-badge {
            background: rgba(255, 255, 255, 0.15);
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
            .welcome-container {
                padding: 2rem 1rem;
            }
            
            .title {
                font-size: 2.5rem;
            }
            
            .logo {
                font-size: 4rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="welcome-container">
        <div class="logo"><img src="/images/Findy.png" alt="Findy Logo"></div>
        <h1 class="title">Findy</h1>
        <p class="subtitle">
            AI 기반 뉴스 검색 엔진으로<br>
            빠르고 정확한 뉴스 검색을 경험해보세요
        </p>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🚀</div>
                <div class="feature-title">빠른 검색</div>
                <div class="feature-desc">Elasticsearch 기반 고속 검색</div>
            </div>
            
            <div class="feature">
                <div class="feature-icon">🧠</div>
                <div class="feature-title">형태소 분석</div>
                <div class="feature-desc">정확한 키워드 매칭</div>
            </div>
            
            <div class="feature">
                <div class="feature-icon">📊</div>
                <div class="feature-title">랭킹 정렬</div>
                <div class="feature-desc">TF-IDF 기반 연관성 순위</div>
            </div>
        </div>
        
        <a href="/search" class="start-btn">
            🔍 검색 시작하기
        </a>
        
        <div class="tech-stack">
            <div class="tech-title">🛠 기술 스택</div>
            <div class="tech-badges">
                <span class="tech-badge">Spring Boot</span>
                <span class="tech-badge">Elasticsearch</span>
                <span class="tech-badge">MongoDB</span>
                <span class="tech-badge">Java 17</span>
                <span class="tech-badge">HTML5/CSS3</span>
                <span class="tech-badge">JavaScript</span>
            </div>
        </div>
    </div>
</body>
</html> 