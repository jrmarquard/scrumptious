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

    // projectId -> sprint -> status -> ticketId -> Ticket
    private Map<String, Map<Ticket.Sprint, Map<Ticket.Status, Map<String, Ticket>>>> mTickets;

    public FirebaseTicketsRepository() {
        mTickets = new HashMap<>();
    }

    @Override
    public void getTickets(final String projectId, final Ticket.Sprint sprint,
                           final OnTicketsRetrievedListener listener) {

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
    public void getTickets(final String projectId, final Ticket.Status status,
                           final Ticket.Sprint sprint, final OnTicketsRetrievedListener listener) {

        Query query = DB.getReference("projects").child(projectId).child("tickets")
                .orderByChild("sprint").equalTo(sprint.toString());
        query.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                Ticket ticket = snapshotToTicket(dataSnapshot);
                addTicket(projectId, ticket);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint, status));
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                Ticket updatedTicket = snapshotToTicket(dataSnapshot);
                updateTicket(projectId, updatedTicket);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint, status));
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {
                String ticketId = dataSnapshot.getRef().getKey();
                removeTicket(projectId, ticketId);
                if (listener != null) listener.onTicketsRetrieved(getTickets(projectId, sprint, status));
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

    private void addTicket(String projectId, Ticket ticket) {
        Ticket.Sprint sprint = ticket.getSprint() != null ?
                Ticket.Sprint.valueOf(ticket.getSprint().toUpperCase()) : null;
        Ticket.Status status = ticket.getStatus() != null ?
                Ticket.Status.valueOf(ticket.getStatus().toUpperCase()) : null;
        if (!mTickets.containsKey(projectId)) {
            mTickets.put(projectId, new HashMap<Ticket.Sprint, Map<Ticket.Status, Map<String, Ticket>>>());
        }
        if (!mTickets.get(projectId).containsKey(sprint)) {
            mTickets.get(projectId).put(sprint, new HashMap<Ticket.Status, Map<String, Ticket>>());
        }
        if (!mTickets.get(projectId).get(sprint).containsKey(status)) {
            mTickets.get(projectId).get(sprint).put(status, new HashMap<String, Ticket>());
        }
        mTickets.get(projectId).get(sprint).get(status).put(ticket.getRefId(), ticket);
    }

    private void updateTicket(String projectId, Ticket ticket) {
        if (mTickets.containsKey(projectId)) {
            for (Ticket.Sprint sprint : mTickets.get(projectId).keySet()) {
                for (Ticket.Status status : mTickets.get(projectId).get(sprint).keySet()) {
                    if (mTickets.get(projectId).get(sprint).get(status).containsKey(ticket.getRefId())) {
                        mTickets.get(projectId).get(sprint).get(status).get(ticket.getRefId()).update(ticket);
                    }
                }
            }
        }
    }

    private void removeTicket(String projectId, String ticketId) {
        if (mTickets.containsKey(projectId)) {
            for (Ticket.Sprint sprint : mTickets.get(projectId).keySet()) {
                for (Ticket.Status status : mTickets.get(projectId).get(sprint).keySet()) {
                    mTickets.get(projectId).get(sprint).get(status).remove(ticketId);
                }
            }
        }
    }

    private List<Ticket> getTickets(String projectId, Ticket.Sprint sprint) {
        List<Ticket> tickets = null;
        if (mTickets.containsKey(projectId)) {
            for (Ticket.Status status : mTickets.get(projectId).get(sprint).keySet()) {
                if (mTickets.get(projectId).get(sprint).containsKey(status)) {
                    tickets = new ArrayList<>(mTickets.get(projectId).get(sprint).get(status).values());
                }
            }

        }
        return tickets;
    }

    private List<Ticket> getTickets(String projectId, Ticket.Sprint sprint, Ticket.Status status) {
        List<Ticket> tickets = null;
        if (mTickets.containsKey(projectId)) {
            if (mTickets.get(projectId).get(sprint).containsKey(status)) {
                tickets = new ArrayList<>(mTickets.get(projectId).get(sprint).get(status).values());
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
