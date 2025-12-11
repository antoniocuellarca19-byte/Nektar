package com.cafeteria.sistema.controller;

import com.cafeteria.sistema.entity.Insumo;
import com.cafeteria.sistema.repository.InsumoRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/insumos")
@CrossOrigin(origins = "http://localhost:5173")
public class InsumoController {

    private final InsumoRepository insumoRepository;

    public InsumoController(InsumoRepository insumoRepository) {
        this.insumoRepository = insumoRepository;
    }

    @GetMapping
    public List<Insumo> listarInsumos() {
        return insumoRepository.findAll();
    }
}