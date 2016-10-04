package us.crumptio.scrumptious;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.devspark.robototextview.widget.RobotoTextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.nlopez.smartadapters.SmartAdapter;
import us.crumptio.scrumptious.model.Ticket;
import us.crumptio.scrumptious.view.TicketView;

/**
 * Created by josh on 2/10/2016.
 */
public class TicketsFragment extends Fragment {

    private static final String ARG_STATUS = "arg_status";

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

    private Status mStatus;

    public static TicketsFragment newInstance(Status status) {
        TicketsFragment frag = new TicketsFragment();
        Bundle args = new Bundle();

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
        SmartAdapter.items(tickets)
                .map(Ticket.class, TicketView.class)
                .into(mList);
    }
}
