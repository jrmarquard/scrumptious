package us.crumptio.scrumptious.repositories;

import java.util.List;

import us.crumptio.scrumptious.model.Ticket;

/**
 * Created by josh on 12/10/2016.
 */
public interface TicketsRepository {

    void getTickets(String projectId, OnTicketsRetrievedListener listener);
    void getTickets(String projectId, Ticket.Status status, Ticket.Sprint sprint, OnTicketsRetrievedListener listener);
    void createTicket(String projectId, Ticket ticket, OnTicketCreatedCallback callback);

    interface OnTicketsRetrievedListener {
        void onTicketsRetrieved(List<Ticket> tickets);
    }

    interface OnTicketCreatedCallback {
        void onTicketCreated(String ticketId);
    }
}
