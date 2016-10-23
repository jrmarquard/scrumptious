package us.crumptio.scrumptious.repositories;

import java.util.List;

import us.crumptio.scrumptious.model.Ticket;

/**
 * Created by josh on 12/10/2016.
 */
public interface TicketsRepository {

    void getTickets(String projectId, Ticket.Sprint sprint, OnTicketsRetrievedListener listener);
    void getTickets(String projectId, String statusId, Ticket.Sprint sprint, OnTicketsRetrievedListener listener);
    void getStatuses(String projectId, OnStatusesRetrievedListener listener);
    String getStatus(String projectId, String statusId);
    void createTicket(String projectId, Ticket ticket, OnTicketCreatedCallback callback);
    void updateTicket(String projectId, Ticket ticket, OnTicketCreatedCallback callback);

    interface OnTicketsRetrievedListener {
        void onTicketsRetrieved(List<Ticket> tickets);
    }

    interface OnStatusesRetrievedListener {
        void onStatusesRetrieved(List<String> statuses);
    }

    interface OnTicketCreatedCallback {
        void onTicketCreated(String ticketId);
    }
}
