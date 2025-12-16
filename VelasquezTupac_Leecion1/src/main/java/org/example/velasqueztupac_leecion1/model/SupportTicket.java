package org.example.velasqueztupac_leecion1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "support_tickets", uniqueConstraints = {
        @UniqueConstraint(columnNames = "ticket_number")
})
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Se generará automáticamente si no viene, pero debe ser único
    @Column(name = "ticket_number", nullable = false, unique = true)
    private String ticketNumber;

    @NotBlank(message = "El nombre del solicitante es obligatorio")
    private String requesterName;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El estado es obligatorio")
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "La prioridad es obligatoria")
    private Priority priority;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;

    @NotNull(message = "El costo estimado es obligatorio")
    @PositiveOrZero(message = "El costo no puede ser negativo")
    private BigDecimal estimatedCost;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "La moneda es obligatoria")
    private Currency currency;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @NotNull(message = "La fecha máxima de atención es obligatoria")
    private LocalDate dueDate;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TicketStatus.OPEN;
        }
        // Generador simple de ticket si viene vacío: ST-UUID
        if (this.ticketNumber == null || this.ticketNumber.isEmpty()) {
            this.ticketNumber = "ST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    // ==========================================
    // GETTERS Y SETTERS MANUALES
    // ==========================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}