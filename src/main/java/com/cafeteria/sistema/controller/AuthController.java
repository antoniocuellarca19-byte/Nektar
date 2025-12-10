package com.cafeteria.sistema.controller;

import com.cafeteria.sistema.entity.Usuario;
import com.cafeteria.sistema.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Optional<Usuario> usuario = usuarioRepository.findByUsernameAndPassword(username, password);

        if (usuario.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Login exitoso");
            response.put("rol", usuario.get().getRol());
            response.put("usuario", usuario.get().getUsername());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }
}