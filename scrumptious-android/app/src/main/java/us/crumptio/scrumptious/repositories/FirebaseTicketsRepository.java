package us.crumptio.scrumptious.repositories;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import us.crumptio.scrumptious.model.Ticket;

/**
 * Created by josh on 12/10/2016.
 */
public class FirebaseTicketsRepository extends BaseRepository implements TicketsRepository {

    private final FirebaseDatabase DB = FirebaseDatabase.getInstance();

    // projectId -> sprint -> statusId -> ticketId -> Ticket
    private Map<String, Map<Ticket.Sprint, Map<String, Map<String, Ticket>>>> mTickets;

    // projectId -> statusId -> status
    private Map<String, Map<String, String>> mStatuses;

    public FirebaseTicketsRepository() {
        mTickets = new HashMap<>();
        mStatuses = new HashMap<>();
    }

    @Override
    public void getTickets(final String projectId, final Ticket.Sprint sprint,
                           final OnTicketsRetrievedListener listener) {
        getStatuses(projectId);
        Query query = DB.getReference("projects").child(projectId).child("tickets")
                .orderByChild("sprint").equalTo(sprint.toString());
        query.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                Ticket ticket = snapshotToTicket(dataSnapshot);
                addTicket(projectId, ticket);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint));
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                Ticket updatedTicket = snapshotToTicket(dataSnapshot);
                updateTicket(projectId, updatedTicket);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint));
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {
                String ticketId = dataSnapshot.getRef().getKey();
                removeTicket(projectId, ticketId);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint));
            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
            }
        });
    }

    @Override
    public void getTickets(final String projectId, final String statusId,
                           final Ticket.Sprint sprint, final OnTicketsRetrievedListener listener) {

        Query query = DB.getReference("projects").child(projectId).child("tickets")
                .orderByChild("sprint").equalTo(sprint.toString());
        query.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                Ticket ticket = snapshotToTicket(dataSnapshot);
                addTicket(projectId, ticket);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint, statusId));
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                Ticket updatedTicket = snapshotToTicket(dataSnapshot);
                updateTicket(projectId, updatedTicket);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint, statusId));
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {
                String ticketId = dataSnapshot.getRef().getKey();
                removeTicket(projectId, ticketId);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint, statusId));
            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
            }
        });
    }

    @Override
    public void getStatuses(final String projectId, final OnStatusesRetrievedListener listener) {
        DB.getReference("projects")
                .child(projectId)
                .child("statuses")
                .addChildEventListener(new ChildEventListener() {
                    @Override
                    public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                        String status = null;
                        for (DataSnapshot i : dataSnapshot.getChildren()) {
                            if (i.getKey().equals("status")) {
                                status = (String) i.getValue();
                                break;
                            }
                        }
                        addStatus(projectId, dataSnapshot.getKey(), status);
                        listener.onStatusesRetrieved(getStatuses(projectId));
                    }

                    @Override
                    public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                        String status = null;
                        for (DataSnapshot i : dataSnapshot.getChildren()) {
                            if (i.getKey().equals("status")) {
                                status = (String) i.getValue();
                                break;
                            }
                        }
                        addStatus(projectId, dataSnapshot.getKey(), status);
                        listener.onStatusesRetrieved(getStatuses(projectId));
                    }

                    @Override
                    public void onChildRemoved(DataSnapshot dataSnapshot) {
                        String status = null;
                        for (DataSnapshot i : dataSnapshot.getChildren()) {
                            if (i.getKey().equals("status")) {
                                status = (String) i.getValue();
                                break;
                            }
                        }
                        removeStatus(projectId, status);
                        listener.onStatusesRetrieved(getStatuses(projectId));
                    }

                    @Override
                    public void onChildMoved(DataSnapshot dataSnapshot, String s) {

                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {

                    }
                });
    }

    @Override
    public String getStatus(String projectId, String statusId) {
        if (mStatuses.containsKey(projectId) && mStatuses.get(projectId).containsKey(statusId)) {
            return mStatuses.get(projectId).get(statusId);
        }
        return "Unknown";
    }

    @Override
    public void createTicket(String projectId, Ticket ticket, final OnTicketCreatedCallback callback) {
        DB.getReference("projects")
                .child(projectId)
                .child("tickets")
                .push()
                .setValue(ticket)
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        if (callback != null) callback.onTicketCreated(null);
                    }
                });

    }

    @Override
    public void updateTicket(String projectId, final Ticket ticket, final OnTicketCreatedCallback callback) {
        DB.getReference("projects")
                .child(projectId)
                .child("tickets")
                .child(ticket.getRefId())
                .setValue(ticket)
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        if (callback != null) callback.onTicketCreated(ticket.getRefId());
                    }
                });
    }

    private List<String> getStatuses(String projectId) {
        List<String> statuses = null;
        if (mStatuses.containsKey(projectId)) {
            statuses = new ArrayList<>(mStatuses.get(projectId).keySet());
        }
        return statuses;
    }

    private void addStatus(String projectId, String statusId, String status) {
        if (!mStatuses.containsKey(projectId)) mStatuses.put(projectId, new HashMap<String, String>());
        mStatuses.get(projectId).put(statusId, status);
    }

    private void removeStatus(String projectId, String statusId) {
        if (!mStatuses.containsKey(projectId)) mStatuses.get(projectId).remove(statusId);
    }

    private void addTicket(String projectId, Ticket ticket) {
        Ticket.Sprint sprint = ticket.getSprint() != null ?
                Ticket.Sprint.valueOf(ticket.getSprint().toUpperCase()) : null;
        if (!mTickets.containsKey(projectId)) {
            mTickets.put(projectId, new HashMap<Ticket.Sprint, Map<String, Map<String, Ticket>>>());
        }
        if (!mTickets.get(projectId).containsKey(sprint)) {
            mTickets.get(projectId).put(sprint, new HashMap<String, Map<String, Ticket>>());
        }
        if (!mTickets.get(projectId).get(sprint).containsKey(ticket.getStatus())) {
            mTickets.get(projectId).get(sprint).put(ticket.getStatus(), new HashMap<String, Ticket>());
        }
        mTickets.get(projectId).get(sprint).get(ticket.getStatus()).put(ticket.getRefId(), ticket);
    }

    private void updateTicket(String projectId, Ticket ticket) {
        if (mTickets.containsKey(projectId)) {
            for (Ticket.Sprint sprint : mTickets.get(projectId).keySet()) {
                for (String statusId : mTickets.get(projectId).get(sprint).keySet()) {
                    if (mTickets.get(projectId).get(sprint).get(statusId).containsKey(ticket.getRefId())) {
                        mTickets.get(projectId).get(sprint).get(statusId).get(ticket.getRefId()).update(ticket);
                    }
                }
            }
        }
    }

    private void removeTicket(String projectId, String ticketId) {
        if (mTickets.containsKey(projectId)) {
            for (Ticket.Sprint sprint : mTickets.get(projectId).keySet()) {
                for (String statusId : mTickets.get(projectId).get(sprint).keySet()) {
                    mTickets.get(projectId).get(sprint).get(statusId).remove(ticketId);
                }
            }
        }
    }

    private List<Ticket> getTickets(String projectId, Ticket.Sprint sprint) {
        List<Ticket> tickets = null;
        if (mTickets.containsKey(projectId)) {
            for (String statusId : mTickets.get(projectId).get(sprint).keySet()) {
                if (mTickets.get(projectId).get(sprint).containsKey(statusId)) {
                    tickets = new ArrayList<>(mTickets.get(projectId).get(sprint).get(statusId).values());
                }
            }

        }
        return tickets;
    }

    private List<Ticket> getTickets(String projectId, Ticket.Sprint sprint, String statusId) {
        List<Ticket> tickets = null;
        if (mTickets.containsKey(projectId)) {
            if (mTickets.get(projectId).get(sprint).containsKey(statusId)) {
                tickets = new ArrayList<>(mTickets.get(projectId).get(sprint).get(statusId).values());
            }
        }
        return tickets;
    }

    private static Ticket snapshotToTicket(DataSnapshot dataSnapshot) {
        Ticket ticket = dataSnapshot.getValue(Ticket.class);
        ticket.setRefId(dataSnapshot.getRef().getKey());
        return ticket;
    }
}
