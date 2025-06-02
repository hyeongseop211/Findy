package com.searchengine.dto;

import com.searchengine.model.Document;

import java.util.List;

public class SearchResponse {
    
    private List<Document> documents;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private long searchTime;
    
    // 기본 생성자
    public SearchResponse() {}
    
    // 생성자
    public SearchResponse(List<Document> documents, long totalElements, int totalPages, int currentPage, int pageSize, long searchTime) {
        this.documents = documents;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.searchTime = searchTime;
    }
    
    // Getters and Setters
    public List<Document> getDocuments() {
        return documents;
    }
    
    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }
    
    public long getTotalElements() {
        return totalElements;
    }
    
    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }
    
    public int getTotalPages() {
        return totalPages;
    }
    
    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
    
    public int getCurrentPage() {
        return currentPage;
    }
    
    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }
    
    public int getPageSize() {
        return pageSize;
    }
    
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
    
    public long getSearchTime() {
        return searchTime;
    }
    
    public void setSearchTime(long searchTime) {
        this.searchTime = searchTime;
    }
} 