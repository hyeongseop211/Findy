package com.searchengine.config;

import com.searchengine.model.Document;
import com.searchengine.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private SearchService searchService;
    
    @Override
    public void run(String... args) throws Exception {
        // 샘플 데이터 추가
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        List<Document> sampleDocuments = Arrays.asList(
            new Document(
                "스프링부트 시작하기",
                "스프링부트는 자바 기반의 웹 애플리케이션을 빠르게 개발할 수 있게 해주는 프레임워크입니다. " +
                "자동 설정, 내장 서버, 스타터 의존성 등의 기능을 제공하여 개발자가 비즈니스 로직에 집중할 수 있도록 도와줍니다.",
                "프로그래밍",
                Arrays.asList("스프링부트", "자바", "웹개발", "프레임워크"),
                "김개발",
                "https://example.com/spring-boot-guide"
            ),
            new Document(
                "엘라스틱서치 검색 엔진 구축",
                "엘라스틱서치는 분산형 검색 및 분석 엔진입니다. 실시간으로 대용량 데이터를 검색하고 분석할 수 있으며, " +
                "RESTful API를 통해 쉽게 사용할 수 있습니다. 로그 분석, 전문 검색, 실시간 분석 등에 활용됩니다.",
                "데이터베이스",
                Arrays.asList("엘라스틱서치", "검색엔진", "빅데이터", "분석"),
                "박검색",
                "https://example.com/elasticsearch-guide"
            ),
            new Document(
                "몽고디비 NoSQL 데이터베이스",
                "몽고디비는 문서 지향 NoSQL 데이터베이스입니다. JSON과 유사한 BSON 형태로 데이터를 저장하며, " +
                "스키마가 유연하고 수평적 확장이 용이합니다. 웹 애플리케이션, 콘텐츠 관리, 실시간 분석 등에 적합합니다.",
                "데이터베이스",
                Arrays.asList("몽고디비", "NoSQL", "데이터베이스", "BSON"),
                "이디비",
                "https://example.com/mongodb-guide"
            ),
            new Document(
                "자바 프로그래밍 기초",
                "자바는 객체지향 프로그래밍 언어로, 플랫폼 독립적이고 안전한 특징을 가지고 있습니다. " +
                "JVM 위에서 실행되며, 웹 개발, 모바일 앱 개발, 엔터프라이즈 애플리케이션 개발 등에 널리 사용됩니다.",
                "프로그래밍",
                Arrays.asList("자바", "객체지향", "JVM", "프로그래밍"),
                "최자바",
                "https://example.com/java-basics"
            ),
            new Document(
                "웹 개발 트렌드 2024",
                "2024년 웹 개발 트렌드를 살펴보면 React, Vue.js, Angular 등의 프론트엔드 프레임워크가 계속 인기를 끌고 있으며, " +
                "서버리스 아키텍처, 마이크로서비스, JAMstack 등이 주목받고 있습니다.",
                "웹개발",
                Arrays.asList("웹개발", "프론트엔드", "트렌드", "React"),
                "정웹개발",
                "https://example.com/web-trends-2024"
            ),
            new Document(
                "REST API 설계 가이드",
                "REST API는 웹 서비스 간의 통신을 위한 아키텍처 스타일입니다. " +
                "HTTP 메서드를 활용하여 자원을 조작하며, 무상태성, 캐시 가능성, 계층화 시스템 등의 특징을 가집니다.",
                "API",
                Arrays.asList("REST", "API", "HTTP", "웹서비스"),
                "김API",
                "https://example.com/rest-api-guide"
            ),
            new Document(
                "도커 컨테이너 기술",
                "도커는 애플리케이션을 컨테이너로 패키징하여 배포하는 기술입니다. " +
                "가상화보다 가볍고 빠르며, 개발 환경과 운영 환경의 일관성을 보장합니다.",
                "DevOps",
                Arrays.asList("도커", "컨테이너", "가상화", "배포"),
                "박도커",
                "https://example.com/docker-guide"
            ),
            new Document(
                "쿠버네티스 오케스트레이션",
                "쿠버네티스는 컨테이너 오케스트레이션 플랫폼으로, 컨테이너화된 애플리케이션의 배포, 확장, 관리를 자동화합니다. " +
                "마이크로서비스 아키텍처에서 필수적인 기술입니다.",
                "DevOps",
                Arrays.asList("쿠버네티스", "오케스트레이션", "마이크로서비스", "자동화"),
                "이쿠버",
                "https://example.com/kubernetes-guide"
            ),
            new Document(
                "머신러닝 입문",
                "머신러닝은 데이터로부터 패턴을 학습하여 예측이나 분류를 수행하는 인공지능 기술입니다. " +
                "지도학습, 비지도학습, 강화학습 등의 방법론이 있으며, 다양한 분야에서 활용되고 있습니다.",
                "AI/ML",
                Arrays.asList("머신러닝", "인공지능", "데이터", "예측"),
                "최ML",
                "https://example.com/machine-learning-intro"
            ),
            new Document(
                "파이썬 데이터 분석",
                "파이썬은 데이터 분석에 널리 사용되는 프로그래밍 언어입니다. " +
                "pandas, numpy, matplotlib 등의 라이브러리를 활용하여 효율적인 데이터 처리와 시각화가 가능합니다.",
                "데이터분석",
                Arrays.asList("파이썬", "데이터분석", "pandas", "numpy"),
                "정파이썬",
                "https://example.com/python-data-analysis"
            )
        );
        
        // 각 문서를 저장
        for (Document doc : sampleDocuments) {
            try {
                searchService.saveDocument(doc);
                System.out.println("샘플 문서 저장됨: " + doc.getTitle());
            } catch (Exception e) {
                System.err.println("문서 저장 실패: " + doc.getTitle() + " - " + e.getMessage());
            }
        }
        
        System.out.println("샘플 데이터 초기화 완료!");
    }
} 