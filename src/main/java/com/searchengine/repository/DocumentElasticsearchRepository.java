package com.searchengine.repository;

import com.searchengine.model.Document;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentElasticsearchRepository extends ElasticsearchRepository<Document, String> {
    
    List<Document> findByTitleContaining(String title);
    
    List<Document> findByContentContaining(String content);
    
    List<Document> findByCategory(String category);
    
    List<Document> findByTagsContaining(String tag);
    
    List<Document> findByAuthor(String author);
} 