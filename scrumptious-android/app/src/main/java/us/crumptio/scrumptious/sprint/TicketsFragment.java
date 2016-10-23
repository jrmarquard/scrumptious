package us.crumptio.scrumptious.sprint;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;

import com.devspark.robototextview.widget.RobotoTextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.nlopez.smartadapters.SmartAdapter;
import io.nlopez.smartadapters.adapters.RecyclerMultiAdapter;
import io.nlopez.smartadapters.utils.ViewEventListener;
import us.crumptio.scrumptious.R;
import us.crumptio.scrumptious.createticket.CreateTicketActivity;
import us.crumptio.scrumptious.model.Ticket;
import us.crumptio.scrumptious.repositories.FirebaseTicketsRepository;
import us.crumptio.scrumptious.repositories.TicketsRepository;
import us.crumptio.scrumptious.view.TicketView;

/**
 * Created by josh on 2/10/2016.
 */
public class TicketsFragment extends Fragment implements TicketsRepository.OnTicketsRetrievedListener {

    private static final String ARG_PROJECT_ID = "arg_project_id";
    private static final String ARG_STATUS = "arg_status";

    private static final String SIS_TICKETS = "sis_tickets";

    private static final String TAG = TicketsFragment.class.getSimpleName();

    private TicketsRepository mTicketsRepo = new FirebaseTicketsRepository();

    @BindView(R.id.status_title)
    RobotoTextView mTitle;

    @BindView(R.id.list)
    RecyclerView mList;

    @BindView(R.id.content)
    View mContent;

    @BindView(R.id.progress_bar)
    ProgressBar mProgressBar;

    private String mProjectId;
    private Ticket.Status mStatus;

    private RecyclerMultiAdapter mAdapter;
    private List<Ticket> mTickets;

    public static TicketsFragment newInstance(String projectId, Ticket.Status status) {
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
            mStatus = Ticket.Status.values()[getArguments().getInt(ARG_STATUS)];
        }
        if (getArguments() != null && getArguments().containsKey(ARG_PROJECT_ID)) {
            mProjectId = getArguments().getString(ARG_PROJECT_ID);
        }

        mTickets = new ArrayList<>();
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

        mTitle.setText(mStatus.toString().replace('_', ' ').toUpperCase());
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

        mList.setLayoutManager(new LinearLayoutManager(getContext()));
        mAdapter = SmartAdapter.empty()
                .map(Ticket.class, TicketView.class)
                .listener(new ViewEventListener<Ticket>() {
                    @Override
                    public void onViewEvent(int actionId, Ticket ticket, int position, View view) {
                        if (actionId == TicketView.CLICKED) {
                            CreateTicketActivity.openActivity(getActivity(), mProjectId);
                        }
                    }
                })
                .into(mList);
    }

    @Override
    public void onResume() {
        super.onResume();
        mTicketsRepo.getTickets(mProjectId, mStatus, Ticket.Sprint.CURRENT, this);
    }

    @Override
    public void onTicketsRetrieved(List<Ticket> tickets) {
        mTickets = tickets;
        mAdapter.setItems(mTickets);
        mContent.setVisibility(View.VISIBLE);
        mProgressBar.setVisibility(View.GONE);
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
