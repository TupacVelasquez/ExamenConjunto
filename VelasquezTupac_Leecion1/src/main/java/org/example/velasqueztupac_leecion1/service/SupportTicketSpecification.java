package org.example.velasqueztupac_leecion1.service;


import org.example.velasqueztupac_leecion1.model.Currency;
import org.example.velasqueztupac_leecion1.model.SupportTicket;
import org.example.velasqueztupac_leecion1.model.TicketStatus;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SupportTicketSpecification {

    public static Specification<SupportTicket> filterBy(
            String q,
            TicketStatus status,
            Currency currency,
            BigDecimal minCost,
            BigDecimal maxCost,
            LocalDateTime from,
            LocalDateTime to
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Búsqueda de texto (ticketNumber O requesterName)
            // SQL equivalente: AND (LOWER(ticketNumber) LIKE %q% OR LOWER(requesterName) LIKE %q%)
            if (q != null && !q.isEmpty()) {
                String searchPattern = "%" + q.toLowerCase() + "%";
                Predicate ticketNumberLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("ticketNumber")), searchPattern);
                Predicate requesterNameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("requesterName")), searchPattern);
                predicates.add(criteriaBuilder.or(ticketNumberLike, requesterNameLike));
            }

            // 2. Filtro por Estado (Status)
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            // 3. Filtro por Moneda (Currency)
            if (currency != null) {
                predicates.add(criteriaBuilder.equal(root.get("currency"), currency));
            }

            // 4. Monto mínimo (estimatedCost >= minCost)
            if (minCost != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("estimatedCost"), minCost));
            }

            // 5. Monto máximo (estimatedCost <= maxCost)
            if (maxCost != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("estimatedCost"), maxCost));
            }

            // 6. Rango de Fechas (createdAt entre from y to)
            if (from != null && to != null) {
                predicates.add(criteriaBuilder.between(root.get("createdAt"), from, to));
            } else if (from != null) {
                // Si solo envía 'from', busca desde esa fecha en adelante
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), from));
            } else if (to != null) {
                // Si solo envía 'to', busca hasta esa fecha
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), to));
            }

            // Combina todos los predicados con AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}