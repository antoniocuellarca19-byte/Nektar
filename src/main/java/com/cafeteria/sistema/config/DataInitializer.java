package com.cafeteria.sistema.config;

import com.cafeteria.sistema.entity.*;
import com.cafeteria.sistema.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private ProductoRepository productoRepository;
    @Autowired private InsumoRepository insumoRepository;
    @Autowired private ProveedorRepository proveedorRepository;
    @Autowired private RecetaRepository recetaRepository;
    @Autowired private PedidoRepository pedidoRepository; 
    @Autowired private DetallePedidoRepository detallePedidoRepository;
    @Autowired private UsuarioRepository usuarioRepository; // <--- NUEVO REPOSITORIO

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. LIMPIEZA DE DATOS (Orden inverso para respetar FKs)
        System.out.println("--- Limpiando base de datos ---");
        // Limpiamos usuarios también
        usuarioRepository.deleteAll(); 
        
        recetaRepository.deleteAll();
        detallePedidoRepository.deleteAll();
        pedidoRepository.deleteAll();
        productoRepository.deleteAll();
        insumoRepository.deleteAll();
        proveedorRepository.deleteAll();

        // 2. CREAR PROVEEDORES
        System.out.println("--- Creando Proveedores ---");
        Map<String, Proveedor> provs = new HashMap<>();
        provs.put("cafe", crearProveedor("Distribuidora de Café", "Café e Infusiones", "555-0101"));
        provs.put("lacteos", crearProveedor("Lácteos del Sur", "Lácteos", "555-0102"));
        provs.put("frutas", crearProveedor("Frutas Frescas S.A.", "Frutas y Verduras", "555-0103"));
        provs.put("pan", crearProveedor("Panificadora Central", "Panadería", "555-0104"));
        provs.put("varios", crearProveedor("Saborizantes y Jarabes", "Insumos Varios", "555-0105"));
        provs.put("carnes", crearProveedor("Embutidos y Fiambres", "Carnicería", "555-0106"));

        // 3. CREAR INSUMOS
        System.out.println("--- Creando Insumos ---");
        Map<String, Insumo> ins = new HashMap<>();
        // Cafetería
        ins.put("cafe_grano", crearInsumo("Grano de Café", 50.0, "kg", provs.get("cafe")));
        ins.put("leche", crearInsumo("Leche Entera", 100.0, "lt", provs.get("lacteos")));
        ins.put("leche_almendra", crearInsumo("Leche de Almendras", 20.0, "lt", provs.get("lacteos")));
        ins.put("choco_polvo", crearInsumo("Chocolate en Polvo", 10.0, "kg", provs.get("varios")));
        ins.put("te", crearInsumo("Té Variado", 500.0, "unidades", provs.get("cafe")));
        ins.put("matcha", crearInsumo("Matcha", 5.0, "kg", provs.get("cafe")));
        // Jarabes
        ins.put("jarabe_vainilla", crearInsumo("Jarabe Vainilla", 5.0, "lt", provs.get("varios")));
        ins.put("jarabe_caramelo", crearInsumo("Jarabe Caramelo", 5.0, "lt", provs.get("varios")));
        ins.put("dulce_leche", crearInsumo("Dulce de Leche", 10.0, "kg", provs.get("lacteos")));
        ins.put("jarabe_lavanda", crearInsumo("Jarabe Lavanda", 3.0, "lt", provs.get("varios")));
        // Frutas
        ins.put("frutos_rojos", crearInsumo("Frutos Rojos (Mix)", 20.0, "kg", provs.get("frutas")));
        ins.put("durazno", crearInsumo("Durazno", 15.0, "kg", provs.get("frutas")));
        ins.put("frutilla", crearInsumo("Frutilla", 20.0, "kg", provs.get("frutas")));
        ins.put("pina", crearInsumo("Piña", 15.0, "kg", provs.get("frutas")));
        ins.put("papaya", crearInsumo("Papaya", 15.0, "kg", provs.get("frutas")));
        ins.put("limon", crearInsumo("Limón", 10.0, "kg", provs.get("frutas")));
        ins.put("menta", crearInsumo("Menta", 2.0, "kg", provs.get("frutas")));
        ins.put("acai", crearInsumo("Pulpa de Acai", 5.0, "kg", provs.get("frutas")));
        // Comida
        ins.put("base_croissant", crearInsumo("Croissant Base", 50.0, "unidades", provs.get("pan")));
        ins.put("base_focaccia", crearInsumo("Focaccia Base", 30.0, "unidades", provs.get("pan")));
        ins.put("base_cinnamon", crearInsumo("Cinnamon Roll Base", 40.0, "unidades", provs.get("pan")));
        ins.put("brownie", crearInsumo("Brownie", 20.0, "unidades", provs.get("pan")));
        ins.put("torta", crearInsumo("Torta de Chocolate", 10.0, "unidades", provs.get("pan")));
        ins.put("helado", crearInsumo("Helado Vainilla", 10.0, "kg", provs.get("lacteos")));
        // Rellenos
        ins.put("jamon", crearInsumo("Jamón", 10.0, "kg", provs.get("carnes")));
        ins.put("queso", crearInsumo("Queso Muzzarella", 10.0, "kg", provs.get("lacteos")));
        ins.put("queso_crema", crearInsumo("Queso Crema", 5.0, "kg", provs.get("lacteos")));
        ins.put("pesto", crearInsumo("Pesto", 2.0, "kg", provs.get("varios")));
        ins.put("nutella", crearInsumo("Nutella", 5.0, "kg", provs.get("varios")));
        ins.put("oreo", crearInsumo("Galletas Oreo", 20.0, "paquetes", provs.get("varios")));

        // 4. CREAR PRODUCTOS Y RECETAS
        System.out.println("--- Creando Productos y Recetas ---");

        // --- LATTES FRÍOS ---
        crearProductoConReceta("Latte Clásico Frío", 20.0, "Lattes Fríos", "latte_frio.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche")), List.of(0.015, 0.2));
        
        crearProductoConReceta("Latte de Vainilla Frío", 22.0, "Lattes Fríos", "latte_vainilla.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche"), ins.get("jarabe_vainilla")), List.of(0.015, 0.2, 0.03));

        crearProductoConReceta("Latte de Caramelo Frío", 22.0, "Lattes Fríos", "latte_caramelo.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche"), ins.get("jarabe_caramelo")), List.of(0.015, 0.2, 0.03));

        crearProductoConReceta("Latte de Dulce de Leche Frío", 22.0, "Lattes Fríos", "latte_ddl.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche"), ins.get("dulce_leche")), List.of(0.015, 0.2, 0.03));

        crearProductoConReceta("Latte de Chocolate Frío", 22.0, "Lattes Fríos", "latte_choco.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche"), ins.get("choco_polvo")), List.of(0.015, 0.2, 0.02));

        crearProductoConReceta("Latte de Lavanda Frío", 22.0, "Lattes Fríos", "latte_lavanda.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche"), ins.get("jarabe_lavanda")), List.of(0.015, 0.2, 0.02));

        crearProductoConReceta("Latte con Acai Frío", 22.0, "Lattes Fríos", "latte_acai.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche"), ins.get("acai")), List.of(0.015, 0.2, 0.05));

        crearProductoConReceta("Latte Frutos Rojos Frío", 22.0, "Lattes Fríos", "latte_frutos.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche"), ins.get("frutos_rojos")), List.of(0.015, 0.2, 0.05));

        // --- JUGOS ---
        crearProductoConReceta("Jugo de Frutos Rojos", 18.0, "Jugos", "jugo_rojos.jpg",
                List.of(ins.get("frutos_rojos")), List.of(0.25));
        
        crearProductoConReceta("Jugo de Durazno", 18.0, "Jugos", "jugo_durazno.jpg",
                List.of(ins.get("durazno")), List.of(0.25));
        
        crearProductoConReceta("Jugo de Frutilla", 18.0, "Jugos", "jugo_frutilla.jpg",
                List.of(ins.get("frutilla")), List.of(0.25));
        
        crearProductoConReceta("Jugo de Piña y Frutilla", 18.0, "Jugos", "jugo_mix.jpg",
                List.of(ins.get("pina"), ins.get("frutilla")), List.of(0.15, 0.1));

        // --- MATCHA ---
        crearProductoConReceta("Matcha Latte Frío", 22.0, "Matcha", "matcha.jpg",
                List.of(ins.get("matcha"), ins.get("leche")), List.of(0.005, 0.2));

        // --- BUBBA ---
        crearProductoConReceta("Bubba de Oreo", 25.0, "Bubba", "bubba_oreo.jpg",
                List.of(ins.get("leche"), ins.get("oreo"), ins.get("jarabe_vainilla")), List.of(0.25, 0.5, 0.02));

        // --- CAFÉS CALIENTES ---
        crearProductoConReceta("Espresso", 10.0, "Cafés Calientes", "espresso.jpg",
                List.of(ins.get("cafe_grano")), List.of(0.015));

        crearProductoConReceta("Capuccino", 16.0, "Cafés Calientes", "capuccino.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche")), List.of(0.015, 0.15));

        crearProductoConReceta("Latte Caliente", 18.0, "Cafés Calientes", "latte_caliente.jpg",
                List.of(ins.get("cafe_grano"), ins.get("leche")), List.of(0.015, 0.2));

        // --- COMIDA ---
        crearProductoConReceta("Croissant Jamón y Queso", 16.0, "Croissants", "croissant_jyq.jpg",
                List.of(ins.get("base_croissant"), ins.get("jamon"), ins.get("queso")), List.of(1.0, 0.05, 0.05));

        crearProductoConReceta("Croissant Nutella y Frutilla", 18.0, "Croissants", "croissant_dulce.jpg",
                List.of(ins.get("base_croissant"), ins.get("nutella"), ins.get("frutilla")), List.of(1.0, 0.03, 0.05));

        crearProductoConReceta("Torta de Chocolate", 20.0, "Postres", "torta.jpg",
                List.of(ins.get("torta")), List.of(1.0));

        crearProductoConReceta("Brownie con Helado", 20.0, "Postres", "brownie_helado.jpg",
                List.of(ins.get("brownie"), ins.get("helado")), List.of(1.0, 0.1));

        // 5. CREAR USUARIOS (ESTA ES LA PARTE NUEVA QUE PEDISTE)
        System.out.println("--- Creando Usuarios ---");
        
        Usuario admin = new Usuario();
        admin.setUsername("admin");
        admin.setPassword("admin123");
        admin.setRol("ADMIN");
        usuarioRepository.save(admin);

        Usuario cajero = new Usuario();
        cajero.setUsername("cajero");
        cajero.setPassword("cajero123");
        cajero.setRol("CAJERO");
        usuarioRepository.save(cajero);

        System.out.println("--- Carga de Datos Iniciales Completada ---");
    }

    // --- MÉTODOS AUXILIARES ---

    private Proveedor crearProveedor(String nombre, String categoria, String tel) {
        Proveedor p = new Proveedor();
        p.setNombre(nombre);
        p.setCategoria(categoria);
        p.setTelefono(tel);
        return proveedorRepository.save(p);
    }

    private Insumo crearInsumo(String nombre, Double stock, String unidad, Proveedor prov) {
        Insumo i = new Insumo();
        i.setNombre(nombre);
        i.setStockActual(stock);
        i.setUnidadMedida(unidad);
        i.setProveedor(prov);
        return insumoRepository.save(i);
    }

    private void crearProductoConReceta(String nombre, Double precio, String cat, String img, 
                                        List<Insumo> insumos, List<Double> cantidades) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setPrecio(precio);
        p.setCategoria(cat);
        p.setImagen(img);
        p.setStock(100); 
        Producto productoGuardado = productoRepository.save(p);

        for (int i = 0; i < insumos.size(); i++) {
            Receta r = new Receta();
            r.setProducto(productoGuardado);
            r.setInsumo(insumos.get(i));
            r.setCantidadRequerida(cantidades.get(i));
            recetaRepository.save(r);
        }
    }
}