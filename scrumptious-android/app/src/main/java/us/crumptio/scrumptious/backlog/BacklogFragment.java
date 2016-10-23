package us.crumptio.scrumptious.backlog;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.nlopez.smartadapters.SmartAdapter;
import io.nlopez.smartadapters.adapters.RecyclerMultiAdapter;
import io.nlopez.smartadapters.utils.ViewEventListener;
import us.crumptio.scrumptious.R;
import us.crumptio.scrumptious.createticket.CreateTicketActivity;
import us.crumptio.scrumptious.model.Project;
import us.crumptio.scrumptious.model.Ticket;
import us.crumptio.scrumptious.repositories.ProjectsRepository;
import us.crumptio.scrumptious.repositories.TicketsRepository;
import us.crumptio.scrumptious.util.FirebaseUtil;
import us.crumptio.scrumptious.view.TicketListItemView;

/**
 * Created by josh on 23/10/2016.
 */

public class BacklogFragment extends Fragment {

    @BindView(R.id.backlog)
    RecyclerView mBacklog;

    private String mProjectId;
    private RecyclerMultiAdapter mAdapter;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.frag_backlog, null);
        return v;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        ButterKnife.bind(this, view);

        mBacklog.setLayoutManager(new LinearLayoutManager(getContext()));
        mAdapter = SmartAdapter.empty()
                .map(Ticket.class, TicketListItemView.class)
                .listener(new ViewEventListener<Ticket>() {
                    @Override
                    public void onViewEvent(int actionId, Ticket ticket, int position, View view) {
                        if (actionId == TicketListItemView.CLICKED) {
                            CreateTicketActivity.openActivity(getActivity(), mProjectId, ticket);
                        }
                    }
                })
                .into(mBacklog);

        FirebaseUtil.projects.getDefaultProject(getContext(), new ProjectsRepository.OnProjectRetrievedCallback() {
            @Override
            public void onProjectRetrieved(Project project) {
                mProjectId = project.getRefId();
                FirebaseUtil.tickets.getTickets(project.getRefId(), Ticket.Sprint.BACKLOG,
                        new TicketsRepository.OnTicketsRetrievedListener() {
                            @Override
                            public void onTicketsRetrieved(List<Ticket> tickets) {
                                mAdapter.setItems(tickets);
                            }
                        });
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        ((AppCompatActivity) getActivity()).getSupportActionBar().setTitle("Backlog");
    }
}
