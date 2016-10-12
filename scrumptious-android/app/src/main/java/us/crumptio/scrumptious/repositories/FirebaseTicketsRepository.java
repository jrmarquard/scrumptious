package us.crumptio.scrumptious.repositories;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import us.crumptio.scrumptious.model.Ticket;

/**
 * Created by josh on 12/10/2016.
 */
public class FirebaseTicketsRepository extends BaseRepository implements TicketsRepository {

    private List<Ticket> mTickets;
    private Map<String, Ticket> mTicketRefs;

    public FirebaseTicketsRepository() {
        mTickets = new ArrayList<>();
        mTicketRefs = new HashMap<>();
    }

    @Override
    public void getTickets(String projectId, OnTicketsRetrievedListener listener) {
        throw new RuntimeException("Not implemented yet!");
    }

    @Override
    public void getTickets(String projectId, Ticket.Status status, final OnTicketsRetrievedListener listener) {

        final FirebaseDatabase database = FirebaseDatabase.getInstance();
        Query query = database.getReference("projects").child(projectId).child("tickets")
                .orderByChild("status").equalTo(status.toString().toLowerCase());
        query.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                Ticket ticket = snapshotToTicket(dataSnapshot);
                mTickets.add(ticket);
                mTicketRefs.put(ticket.getRefId(), ticket);
                listener.onTicketsRetrieved(mTickets);
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                Ticket updatedTicket = snapshotToTicket(dataSnapshot);
                if (mTicketRefs.containsKey(updatedTicket.getRefId())) {
                    mTicketRefs.get(updatedTicket.getRefId()).update(updatedTicket);
                }
                listener.onTicketsRetrieved(mTickets);
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {
                String refId = dataSnapshot.getRef().getKey();
                if (mTicketRefs.containsKey(refId)) {
                    for (Iterator<Ticket> it = mTickets.iterator(); it.hasNext();) {
                        Ticket ticket = it.next();
                        if (ticket.getRefId().equals(refId)) {
                            it.remove();
                            mTicketRefs.remove(refId);
                            break;
                        }
                    }
                }
                listener.onTicketsRetrieved(mTickets);
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
    public void createTicket(String projectId, OnTicketCreatedCallback callback) {

    }

    private static Ticket snapshotToTicket(DataSnapshot dataSnapshot) {
        Ticket ticket = dataSnapshot.getValue(Ticket.class);
        ticket.setRefId(dataSnapshot.getRef().getKey());
        return ticket;
    }
}
