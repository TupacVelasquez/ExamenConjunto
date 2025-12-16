package org.example.velasqueztupac_leecion1.service;

import org.example.velasqueztupac_leecion1.model.Currency;
import org.example.velasqueztupac_leecion1.model.SupportTicket;
import org.example.velasqueztupac_leecion1.model.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SupportTicketService {

    // ----------------------------------------------------
    // C - CREATE (Crear)
    // ----------------------------------------------------
    SupportTicket create(SupportTicket ticket);

    // ----------------------------------------------------
    // R - READ (Leer)
    // ----------------------------------------------------

    // Leer - Listar y Filtrar
    Page<SupportTicket> getAll(
            String q, TicketStatus status, Currency currency,
            BigDecimal minCost, BigDecimal maxCost,
            LocalDateTime from, LocalDateTime to,
            Pageable pageable
    );

    // Leer - Obtener por ID
    SupportTicket getById(Long id);

    // ----------------------------------------------------
    // U - UPDATE (Actualizar)
    // ----------------------------------------------------
    SupportTicket update(Long id, SupportTicket ticket);

    // ----------------------------------------------------
    // D - DELETE (Eliminar)
    // ----------------------------------------------------
    void delete(Long id);
}