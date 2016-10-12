package us.crumptio.scrumptious.createticket;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.widget.EditText;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import us.crumptio.scrumptious.BaseActivity;
import us.crumptio.scrumptious.R;
import us.crumptio.scrumptious.model.Ticket;
import us.crumptio.scrumptious.repositories.FirebaseTicketsRepository;
import us.crumptio.scrumptious.repositories.TicketsRepository;

/**
 * Created by josh on 12/10/2016.
 */
public class CreateTicketActivity extends BaseActivity {

    private static final String ARG_PROJECT_ID = "arg_project_id";

    @BindView(R.id.title)
    EditText mTitle;

    @BindView(R.id.description)
    EditText mDescription;

    @BindView(R.id.assignee)
    EditText mAssignee;

    @BindView(R.id.points)
    EditText mPoints;

    private TicketsRepository mTicketsRepo = new FirebaseTicketsRepository();

    private String mProjectId = null;

    public static void openActivity(AppCompatActivity activity, String projectId) {
        Intent intent = new Intent(activity, CreateTicketActivity.class);
        intent.putExtra(ARG_PROJECT_ID, projectId);
        activity.startActivity(intent);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_ticket);
        ButterKnife.bind(this);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("New Ticket");

        if (getIntent().hasExtra(ARG_PROJECT_ID)) {
            mProjectId = getIntent().getStringExtra(ARG_PROJECT_ID);
        }
    }

    @OnClick(R.id.btn_create_ticket)
    protected void onCreateTicketClicked() {
        Ticket ticket = new Ticket();
        ticket.setTitle(mTitle.getText().toString());
        ticket.setDescription(mDescription.getText().toString());
        ticket.setAssignee(mAssignee.getText().toString());
        ticket.setPoints(Float.parseFloat(mPoints.getText().toString()));
        ticket.setStatus(Ticket.Status.TO_DO.toString());
        mTicketsRepo.createTicket(mProjectId, ticket, new TicketsRepository.OnTicketCreatedCallback() {
            @Override
            public void onTicketCreated(String ticketId) {
                finish();
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
