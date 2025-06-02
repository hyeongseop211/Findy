package com.searchengine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SearchRequest {
    
    @NotBlank(message = "검색어를 입력해주세요")
    @Size(min = 1, max = 100, message = "검색어는 1자 이상 100자 이하로 입력해주세요")
    private String query;
    
    private String category;
    
    private String author;
    
    private int page = 0;
    
    private int size = 10;
    
    // 기본 생성자
    public SearchRequest() {}
    
    // 생성자
    public SearchRequest(String query) {
        this.query = query;
    }
    
    // Getters and Setters
    public String getQuery() {
        return query;
    }
    
    public void setQuery(String query) {
        this.query = query;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public int getPage() {
        return page;
    }
    
    public void setPage(int page) {
        this.page = page;
    }
    
    public int getSize() {
        return size;
    }
    
    public void setSize(int size) {
        this.size = size;
    }
} 