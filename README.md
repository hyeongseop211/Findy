# 🔍 스프링부트 검색 엔진 Findy

스프링부트, 엘라스틱서치, 몽고디비를 활용한 현대적인 검색 엔진 프로젝트입니다.

## ✨ 주요 기능

- **🎯 실시간 검색**: 엘라스틱서치를 활용한 빠르고 정확한 검색
- **🔄 자동완성**: 타이핑과 동시에 제공되는 검색어 추천
- **📱 반응형 UI**: 모든 디바이스에서 최적화된 사용자 경험
- **🎨 현대적 디자인**: Bootstrap 5와 커스텀 CSS로 구현된 아름다운 UI
- **⚡ 빠른 성능**: 엘라스틱서치와 몽고디비의 이중 저장으로 안정성 확보
- **🔍 고급 검색**: 카테고리, 작성자별 필터링 지원
- **📊 검색 통계**: 실시간 검색 통계 및 인기 검색어

## 🛠️ 기술 스택

### Backend
- **Spring Boot 3.2.0** - 메인 프레임워크
- **Spring Data Elasticsearch** - 엘라스틱서치 연동
- **Spring Data MongoDB** - 몽고디비 연동
- **Thymeleaf** - 서버사이드 템플릿 엔진
- **Gradle** - 빌드 도구

### Frontend
- **Bootstrap 5** - UI 프레임워크
- **Font Awesome** - 아이콘
- **Vanilla JavaScript** - 자동완성 및 인터랙션
- **CSS3** - 커스텀 스타일링

### Database
- **Elasticsearch 7.17.x** - 검색 엔진
- **MongoDB 4.4+** - 문서 저장소

## 🚀 시작하기

### 필수 요구사항

1. **Java 17** 이상
2. **Gradle 8.4+** (또는 Gradle Wrapper 사용)
3. **MongoDB 4.4+**
4. **Elasticsearch 7.17.x**

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd search-engine
   ```

2. **MongoDB 실행**
   ```bash
   # Windows
   mongod --dbpath C:\data\db
   
   # macOS/Linux
   mongod --dbpath /usr/local/var/mongodb
   ```

3. **Elasticsearch 실행**
   ```bash
   # Elasticsearch 다운로드 및 실행
   # https://www.elastic.co/downloads/elasticsearch
   
   # Windows
   bin\elasticsearch.bat
   
   # macOS/Linux
   bin/elasticsearch
   ```

4. **애플리케이션 실행**
   ```bash
   # Gradle Wrapper 사용 (권장)
   ./gradlew bootRun
   
   # 또는 Gradle이 설치된 경우
   gradle bootRun
   ```

5. **브라우저에서 접속**
   ```
   http://localhost:8080
   ```

### Docker로 실행 (선택사항)

```bash
# MongoDB 실행
docker run -d --name mongodb -p 27017:27017 mongo:4.4

# Elasticsearch 실행
docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" elasticsearch:7.17.15

# 애플리케이션 실행
./gradlew bootRun
```

## 📁 프로젝트 구조

```
src/
├── main/
│   ├── java/com/searchengine/
│   │   ├── SearchEngineApplication.java     # 메인 애플리케이션
│   │   ├── controller/
│   │   │   └── SearchController.java        # 검색 컨트롤러
│   │   ├── service/
│   │   │   └── SearchService.java           # 검색 서비스
│   │   ├── repository/
│   │   │   ├── DocumentElasticsearchRepository.java
│   │   │   └── DocumentMongoRepository.java
│   │   ├── model/
│   │   │   └── Document.java                # 문서 모델
│   │   ├── dto/
│   │   │   ├── SearchRequest.java           # 검색 요청 DTO
│   │   │   └── SearchResponse.java          # 검색 응답 DTO
│   │   └── config/
│   │       └── DataInitializer.java         # 샘플 데이터 초기화
│   └── resources/
│       ├── templates/
│       │   ├── index.html                   # 메인 페이지
│       │   └── search-results.html          # 검색 결과 페이지
│       ├── static/
│       │   ├── css/style.css                # 커스텀 스타일
│       │   └── js/search.js                 # 검색 JavaScript
│       └── application.properties           # 설정 파일
├── build.gradle                             # Gradle 빌드 파일
├── settings.gradle                          # Gradle 설정
├── gradlew                                  # Gradle Wrapper (Unix)
└── gradlew.bat                              # Gradle Wrapper (Windows)
```

## 🎯 주요 기능 설명

### 1. 실시간 자동완성
- 2글자 이상 입력 시 자동완성 제안
- 키보드 네비게이션 지원 (↑↓ 화살표, Enter, Esc)
- 검색어 하이라이팅

### 2. 고급 검색
- 제목, 내용에서의 전문 검색
- 카테고리별 필터링
- 작성자별 필터링
- 페이지네이션

### 3. 검색 결과 표시
- 관련도 순 정렬
- 검색어 하이라이팅
- 검색 시간 표시
- 반응형 카드 레이아웃

### 4. 사용자 경험
- 로딩 애니메이션
- 검색 히스토리 저장
- 인기 검색어 표시
- 키보드 단축키 (Ctrl+K)

## 🔧 설정

### application.properties 주요 설정

```properties
# Application Name
spring.application.name=search-engine

# Server Configuration
server.port=8080

# MongoDB Configuration
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=searchengine

# Elasticsearch Configuration
spring.elasticsearch.uris=http://localhost:9200
spring.elasticsearch.connection-timeout=10s
spring.elasticsearch.socket-timeout=30s
```

## 📊 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/` | 메인 검색 페이지 |
| POST | `/search` | 검색 실행 |
| GET | `/api/autocomplete` | 자동완성 제안 |
| POST | `/api/documents` | 문서 추가 |
| GET | `/api/categories` | 카테고리 목록 |
| GET | `/api/authors` | 작성자 목록 |

## 🎨 UI/UX 특징

- **그라디언트 배경**: 현대적인 시각적 효과
- **글래스모피즘**: 반투명 효과로 세련된 디자인
- **마이크로 인터랙션**: 호버, 클릭 시 부드러운 애니메이션
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **다크 모드 지원**: 사용자 선호도에 따른 테마 변경

## 🔍 검색 알고리즘

1. **Elasticsearch 우선**: 고성능 전문 검색
2. **MongoDB 폴백**: Elasticsearch 장애 시 대체
3. **부스팅**: 제목 검색 결과에 높은 가중치
4. **와일드카드 검색**: 부분 일치 검색 지원

## 🚀 성능 최적화

- **인덱스 최적화**: Elasticsearch 인덱스 설정
- **캐싱**: 자주 검색되는 결과 캐싱
- **페이지네이션**: 대용량 결과 처리
- **비동기 처리**: 논블로킹 검색 요청

## 🛠️ Gradle 명령어

```bash
# 프로젝트 빌드
./gradlew build

# 애플리케이션 실행
./gradlew bootRun

# 테스트 실행
./gradlew test

# JAR 파일 생성
./gradlew bootJar

# 의존성 확인
./gradlew dependencies

# 프로젝트 정리
./gradlew clean
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👥 팀원

- **개발자 1** - 백엔드 개발
- **개발자 2** - 프론트엔드 개발
- **개발자 3** - 데이터베이스 설계

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! 