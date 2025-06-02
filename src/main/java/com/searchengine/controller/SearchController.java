package com.searchengine.controller;

import com.searchengine.dto.SearchRequest;
import com.searchengine.dto.SearchResponse;
import com.searchengine.model.Document;
import com.searchengine.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Controller
public class SearchController {
    
    @Autowired
    private SearchService searchService;
    
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("searchRequest", new SearchRequest());
        model.addAttribute("categories", searchService.getAllCategories());
        model.addAttribute("authors", searchService.getAllAuthors());
        return "index";
    }
    
    @PostMapping("/search")
    public String search(@Valid @ModelAttribute SearchRequest searchRequest, 
                        BindingResult bindingResult, Model model) {
        
        if (bindingResult.hasErrors()) {
            model.addAttribute("categories", searchService.getAllCategories());
            model.addAttribute("authors", searchService.getAllAuthors());
            return "index";
        }
        
        SearchResponse response = searchService.search(searchRequest);
        
        model.addAttribute("searchRequest", searchRequest);
        model.addAttribute("searchResponse", response);
        model.addAttribute("categories", searchService.getAllCategories());
        model.addAttribute("authors", searchService.getAllAuthors());
        
        return "search-results";
    }
    
    @GetMapping("/api/autocomplete")
    @ResponseBody
    public ResponseEntity<List<String>> autocomplete(@RequestParam String query) {
        List<String> suggestions = searchService.getAutocompleteSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
    
    @PostMapping("/api/documents")
    @ResponseBody
    public ResponseEntity<Document> addDocument(@RequestBody Document document) {
        Document savedDocument = searchService.saveDocument(document);
        return ResponseEntity.ok(savedDocument);
    }
    
    @GetMapping("/api/categories")
    @ResponseBody
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(searchService.getAllCategories());
    }
    
    @GetMapping("/api/authors")
    @ResponseBody
    public ResponseEntity<List<String>> getAuthors() {
        return ResponseEntity.ok(searchService.getAllAuthors());
    }
} 