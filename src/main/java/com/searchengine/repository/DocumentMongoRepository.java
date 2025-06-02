package com.searchengine.repository;

import com.searchengine.model.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentMongoRepository extends MongoRepository<Document, String> {
    
    List<Document> findByTitleContainingIgnoreCase(String title);
    
    List<Document> findByContentContainingIgnoreCase(String content);
    
    List<Document> findByCategory(String category);
    
    List<Document> findByTagsContaining(String tag);
    
    List<Document> findByAuthor(String author);
    
    @Query("{ '$or': [ { 'title': { '$regex': ?0, '$options': 'i' } }, { 'content': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Document> findByTitleOrContentContaining(String searchTerm);
} 