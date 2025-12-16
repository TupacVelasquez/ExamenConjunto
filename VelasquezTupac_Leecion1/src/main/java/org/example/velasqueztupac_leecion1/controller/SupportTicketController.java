package org.example.velasqueztupac_leecion1.controller;

import jakarta.validation.Valid;
import org.example.velasqueztupac_leecion1.model.Currency;
import org.example.velasqueztupac_leecion1.model.SupportTicket;
import org.example.velasqueztupac_leecion1.model.TicketStatus;
import org.example.velasqueztupac_leecion1.service.SupportTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/support-tickets")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class SupportTicketController {

    @Autowired
    private SupportTicketService service;

    // ----------------------------------------------------
    // C - CREATE (Crear)
    // ----------------------------------------------------
    @PostMapping
    public ResponseEntity<SupportTicket> create(@Valid @RequestBody SupportTicket ticket) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(ticket));
    }

    // ----------------------------------------------------
    // R - READ (Leer) - Listar y Buscar
    // ----------------------------------------------------
    @GetMapping
    public ResponseEntity<Page<SupportTicket>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Currency currency,
            @RequestParam(required = false) BigDecimal minCost,
            @RequestParam(required = false) BigDecimal maxCost,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(service.getAll(q, status, currency, minCost, maxCost, from, to, pageable));
    }

    // R - READ (Leer) - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<SupportTicket> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // ----------------------------------------------------
    // U - UPDATE (Actualizar)
    // ----------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<SupportTicket> update(@PathVariable Long id, @Valid @RequestBody SupportTicket ticket) {
        return ResponseEntity.ok(service.update(id, ticket));
    }

    // ----------------------------------------------------
    // D - DELETE (Eliminar)
    // ----------------------------------------------------
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Retorna 204 (No Content) en caso de éxito
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}