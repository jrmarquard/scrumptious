package us.crumptio.scrumptious;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

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

    @BindView(R.id.list)
    RecyclerView mList;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.frag_tickets, container);
        return v;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        ButterKnife.bind(this, view);

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
