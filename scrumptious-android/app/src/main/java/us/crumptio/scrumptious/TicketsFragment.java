package us.crumptio.scrumptious;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.devspark.robototextview.widget.RobotoTextView;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.nlopez.smartadapters.SmartAdapter;
import io.nlopez.smartadapters.adapters.RecyclerMultiAdapter;
import us.crumptio.scrumptious.model.Ticket;
import us.crumptio.scrumptious.view.TicketView;

/**
 * Created by josh on 2/10/2016.
 */
public class TicketsFragment extends Fragment {

    private static final String ARG_PROJECT_ID = "arg_project_id";
    private static final String ARG_STATUS = "arg_status";

    private static final String SIS_TICKETS = "sis_tickets";

    private static final String TAG = TicketsFragment.class.getSimpleName();

    public enum Status {
        TO_DO,
        IN_PROGRESS,
        CODE_REVIEW,
        DONE;


        @Override
        public String toString() {
            return super.toString().replace('_', ' ');
        }
    }

    @BindView(R.id.status_title)
    RobotoTextView mTitle;

    @BindView(R.id.list)
    RecyclerView mList;

    private String mProjectId;
    private Status mStatus;

    private RecyclerMultiAdapter mAdapter;
    private List<Ticket> mTickets;

    public static TicketsFragment newInstance(String projectId, Status status) {
        TicketsFragment frag = new TicketsFragment();
        Bundle args = new Bundle();

        args.putString(ARG_PROJECT_ID, projectId);
        args.putInt(ARG_STATUS, status.ordinal());

        frag.setArguments(args);
        return frag;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null && getArguments().containsKey(ARG_STATUS)) {
            mStatus = Status.values()[getArguments().getInt(ARG_STATUS)];
        }
        if (getArguments() != null && getArguments().containsKey(ARG_PROJECT_ID)) {
            mProjectId = getArguments().getString(ARG_PROJECT_ID);
        }

        mTickets = new ArrayList<>();
        final FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference ref = database.getReference("projects").child(mProjectId).child("tickets");
        ref.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                Log.d(TAG, "onChildAdded");
                mTickets.add(dataSnapshot.getValue(Ticket.class));
                mAdapter.setItems(mTickets);
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                Log.d(TAG, "onChildChanged");
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {
                Log.d(TAG, "onChildRemoved");
            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {
                Log.d(TAG, "onChildMoved");
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.d(TAG, "onChildCancelled");
            }
        });
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.frag_tickets, null);
        return v;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        ButterKnife.bind(this, view);

        mTitle.setText(mStatus.toString());
        switch (mStatus) {
            case TO_DO:
                mTitle.setBackgroundResource(R.drawable.blue_rounded_rectangle);
                break;
            case IN_PROGRESS:
                mTitle.setBackgroundResource(R.drawable.yellow_rounded_rectangle);
                break;
            case CODE_REVIEW:
                mTitle.setBackgroundResource(R.drawable.orange_rounded_rectangle);
                break;
            case DONE:
                mTitle.setBackgroundResource(R.drawable.green_rounded_rectangle);
                break;
        }

        List<Ticket> tickets = new ArrayList<>();
        tickets.add(Ticket.newInstance());
        tickets.add(Ticket.newInstance());
        tickets.add(Ticket.newInstance());
        tickets.add(Ticket.newInstance());
        mList.setLayoutManager(new LinearLayoutManager(getContext()));
        mAdapter = SmartAdapter.empty()
                .map(Ticket.class, TicketView.class)
                .into(mList);
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putParcelableArrayList(SIS_TICKETS, (ArrayList<Ticket>) mTickets);
    }

    @Override
    public void onViewStateRestored(@Nullable Bundle savedInstanceState) {
        super.onViewStateRestored(savedInstanceState);
        if (savedInstanceState != null && savedInstanceState.containsKey(SIS_TICKETS)) {
            mTickets = savedInstanceState.getParcelableArrayList(SIS_TICKETS);
        }
        mAdapter.setItems(mTickets);
    }
}
