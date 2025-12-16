package org.example.velasqueztupac_leecion1.repository;

import org.example.velasqueztupac_leecion1.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTicketRepository extends
        JpaRepository<SupportTicket, Long>,
        JpaSpecificationExecutor<SupportTicket> {
}