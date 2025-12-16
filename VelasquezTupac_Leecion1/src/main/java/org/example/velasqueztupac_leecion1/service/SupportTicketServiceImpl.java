package org.example.velasqueztupac_leecion1.service;

import org.example.velasqueztupac_leecion1.model.Currency;
import org.example.velasqueztupac_leecion1.model.SupportTicket;
import org.example.velasqueztupac_leecion1.model.TicketStatus;
import org.example.velasqueztupac_leecion1.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class SupportTicketServiceImpl implements SupportTicketService {

    @Autowired
    private SupportTicketRepository repository;

    // ----------------------------------------------------
    // C - CREATE (Crear)
    // ----------------------------------------------------
    @Override
    public SupportTicket create(SupportTicket ticket) {
        return repository.save(ticket);
    }

    // ----------------------------------------------------
    // R - READ (Leer) - Listar y Filtrar
    // ----------------------------------------------------
    @Override
    public Page<SupportTicket> getAll(String q, TicketStatus status, Currency currency, BigDecimal minCost, BigDecimal maxCost, LocalDateTime from, LocalDateTime to, Pageable pageable) {

        // REGLA DE NEGOCIO: Validación de fechas
        if (from != null && to != null && from.isAfter(to)) {
            // Usamos ResponseStatusException para manejar errores HTTP
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha 'from' no puede ser posterior a la fecha 'to'");
        }

        // Llamamos a nuestra Specification (la clase que hicimos antes)
        Specification<SupportTicket> spec = SupportTicketSpecification.filterBy(q, status, currency, minCost, maxCost, from, to);

        return repository.findAll(spec, pageable);
    }

    // ----------------------------------------------------
    // R - READ (Leer) - Obtener por ID
    // ----------------------------------------------------
    @Override
    public SupportTicket getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket de soporte no encontrado con ID: " + id));
    }

    // ----------------------------------------------------
    // U - UPDATE (Actualizar) - CORREGIDO
    // ----------------------------------------------------
    @Override
    public SupportTicket update(Long id, SupportTicket updatedTicket) {
        // 1. Buscamos el ticket existente
        SupportTicket existingTicket = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket de soporte no encontrado con ID: " + id));

        // 2. Actualizamos los campos RELEVANTES y EDITABLES del ticket existente
        // Campos que NO se actualizan: id, ticketNumber (generado), createdAt

        // 2.1 Campos de String/Textos
        existingTicket.setRequesterName(updatedTicket.getRequesterName());
        existingTicket.setCategory(updatedTicket.getCategory());

        // 2.2 Campos Enum
        existingTicket.setStatus(updatedTicket.getStatus());
        existingTicket.setPriority(updatedTicket.getPriority());
        existingTicket.setCurrency(updatedTicket.getCurrency());

        // 2.3 Campos Numéricos/Fechas
        // **IMPORTANTE**: Usamos setEstimatedCost, no setCost.
        existingTicket.setEstimatedCost(updatedTicket.getEstimatedCost());
        existingTicket.setDueDate(updatedTicket.getDueDate());

        // 3. Guardamos y retornamos el ticket actualizado
        return repository.save(existingTicket);
    }

    // ----------------------------------------------------
    // D - DELETE (Eliminar)
    // ----------------------------------------------------
    @Override
    public void delete(Long id) {
        // Opcional: Verificar si el ticket existe antes de intentar borrar
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket de soporte no encontrado con ID: " + id);
        }
        repository.deleteById(id);
    }
}