package com.searchengine.service;

import com.searchengine.dto.SearchRequest;
import com.searchengine.dto.SearchResponse;
import com.searchengine.model.Document;
import com.searchengine.repository.DocumentElasticsearchRepository;
import com.searchengine.repository.DocumentMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {
    
    @Autowired
    private DocumentElasticsearchRepository elasticsearchRepository;
    
    @Autowired
    private DocumentMongoRepository mongoRepository;
    
    public SearchResponse search(SearchRequest request) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Elasticsearch를 사용한 검색
            List<Document> documents;
            
            if (request.getCategory() != null && !request.getCategory().isEmpty()) {
                documents = elasticsearchRepository.findByCategory(request.getCategory());
            } else if (request.getAuthor() != null && !request.getAuthor().isEmpty()) {
                documents = elasticsearchRepository.findByAuthor(request.getAuthor());
            } else {
                // 제목 또는 내용에서 검색
                List<Document> titleResults = elasticsearchRepository.findByTitleContaining(request.getQuery());
                List<Document> contentResults = elasticsearchRepository.findByContentContaining(request.getQuery());
                
                documents = titleResults;
                contentResults.forEach(doc -> {
                    if (!documents.contains(doc)) {
                        documents.add(doc);
                    }
                });
            }
            
            // 페이징 처리
            int start = request.getPage() * request.getSize();
            int end = Math.min(start + request.getSize(), documents.size());
            List<Document> pagedDocuments = documents.subList(start, end);
            
            long totalElements = documents.size();
            int totalPages = (int) Math.ceil((double) totalElements / request.getSize());
            long searchTime = System.currentTimeMillis() - startTime;
            
            return new SearchResponse(pagedDocuments, totalElements, totalPages, request.getPage(), request.getSize(), searchTime);
            
        } catch (Exception e) {
            // Elasticsearch 실패 시 MongoDB로 폴백
            return searchWithMongoDB(request, startTime);
        }
    }
    
    private SearchResponse searchWithMongoDB(SearchRequest request, long startTime) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        
        List<Document> documents;
        if (request.getCategory() != null && !request.getCategory().isEmpty()) {
            documents = mongoRepository.findByCategory(request.getCategory());
        } else if (request.getAuthor() != null && !request.getAuthor().isEmpty()) {
            documents = mongoRepository.findByAuthor(request.getAuthor());
        } else {
            documents = mongoRepository.findByTitleOrContentContaining(request.getQuery());
        }
        
        // 페이징 처리
        int start = request.getPage() * request.getSize();
        int end = Math.min(start + request.getSize(), documents.size());
        List<Document> pagedDocuments = documents.subList(start, end);
        
        long searchTime = System.currentTimeMillis() - startTime;
        int totalPages = (int) Math.ceil((double) documents.size() / request.getSize());
        
        return new SearchResponse(pagedDocuments, documents.size(), totalPages, request.getPage(), request.getSize(), searchTime);
    }
    
    public List<String> getAutocompleteSuggestions(String query) {
        if (query == null || query.length() < 2) {
            return List.of();
        }
        
        try {
            // Elasticsearch를 사용한 자동완성
            return elasticsearchRepository.findByTitleContaining(query)
                    .stream()
                    .map(Document::getTitle)
                    .distinct()
                    .limit(10)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            // MongoDB 폴백
            return mongoRepository.findByTitleContainingIgnoreCase(query)
                    .stream()
                    .map(Document::getTitle)
                    .distinct()
                    .limit(10)
                    .collect(Collectors.toList());
        }
    }
    
    public Document saveDocument(Document document) {
        // MongoDB에 저장
        Document savedDoc = mongoRepository.save(document);
        
        try {
            // Elasticsearch에도 인덱싱
            elasticsearchRepository.save(savedDoc);
        } catch (Exception e) {
            // Elasticsearch 저장 실패는 로그만 남기고 계속 진행
            System.err.println("Elasticsearch 인덱싱 실패: " + e.getMessage());
        }
        
        return savedDoc;
    }
    
    public List<String> getAllCategories() {
        return mongoRepository.findAll()
                .stream()
                .map(Document::getCategory)
                .filter(category -> category != null && !category.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }
    
    public List<String> getAllAuthors() {
        return mongoRepository.findAll()
                .stream()
                .map(Document::getAuthor)
                .filter(author -> author != null && !author.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }
} 