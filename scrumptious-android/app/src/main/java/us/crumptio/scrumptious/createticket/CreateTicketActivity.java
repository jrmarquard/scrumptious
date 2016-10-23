package us.crumptio.scrumptious.createticket;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.AppCompatSpinner;
import android.text.TextUtils;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import us.crumptio.scrumptious.BaseActivity;
import us.crumptio.scrumptious.R;
import us.crumptio.scrumptious.model.Ticket;
import us.crumptio.scrumptious.repositories.TicketsRepository;
import us.crumptio.scrumptious.util.FirebaseUtil;

/**
 * Created by josh on 12/10/2016.
 */
public class CreateTicketActivity extends BaseActivity {

    private static final String ARG_PROJECT_ID = "arg_project_id";
    private static final String ARG_TICKET = "arg_ticket";

    @BindView(R.id.title)
    EditText mTitle;

    @BindView(R.id.description)
    EditText mDescription;

    @BindView(R.id.assignee)
    EditText mAssignee;

    @BindView(R.id.points)
    EditText mPoints;

    @BindView(R.id.status_dropdown)
    AppCompatSpinner mStatusDropdown;

    @BindView(R.id.btn_create_ticket)
    Button mCreateTicket;

    private String mProjectId = null;
    private Ticket mTicket;
    private List<String> mStatuses;

    public static void openActivity(FragmentActivity activity, String projectId) {
        Intent intent = new Intent(activity, CreateTicketActivity.class);
        intent.putExtra(ARG_PROJECT_ID, projectId);
        activity.startActivity(intent);
    }

    public static void openActivity(FragmentActivity activity, String projectId, Ticket ticket) {
        Intent intent = new Intent(activity, CreateTicketActivity.class);
        intent.putExtra(ARG_PROJECT_ID, projectId);
        intent.putExtra(ARG_TICKET, ticket);
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

        FirebaseUtil.tickets.getStatuses(mProjectId, new TicketsRepository.OnStatusesRetrievedListener() {
            @Override
            public void onStatusesRetrieved(List<String> statuses) {
                mStatuses = statuses;
                String[] strings = new String[statuses.size()];
                for (int i = 0; i < statuses.size(); ++i) {
                    strings[i] = FirebaseUtil.tickets.getStatus(mProjectId, statuses.get(i));
                }
                ArrayAdapter<String> adapter = new ArrayAdapter<>(CreateTicketActivity.this,
                        R.layout.li_status, strings);
                mStatusDropdown.setAdapter(adapter);
            }
        });

        if (getIntent().hasExtra(ARG_TICKET)) {
            mTicket = getIntent().getParcelableExtra(ARG_TICKET);
            getSupportActionBar().setTitle("Edit Ticket");
            mCreateTicket.setText("UPDATE TICKET");
            mTitle.setText(mTicket.getTitle());
            mDescription.setText(mTicket.getDescription());
            mAssignee.setText(mTicket.getAssignee());
            mPoints.setText(mTicket.getPoints() == (int) mTicket.getPoints()
                    ? String.format("%d", (int) mTicket.getPoints()) : String.valueOf(mTicket.getPoints()));
            String status = FirebaseUtil.tickets.getStatus(mProjectId, mTicket.getStatus());
            switch (status) {
                case "To Do":
                    mStatusDropdown.setSelection(0);
                    break;
                case "In Progress":
                    mStatusDropdown.setSelection(1);
                    break;
                case "Code Review":
                    mStatusDropdown.setSelection(2);
                    break;
                case "Done":
                    mStatusDropdown.setSelection(3);
                    break;
            }
        } else {
            mTicket = new Ticket();
        }
    }

    @OnClick(R.id.btn_create_ticket)
    protected void onCreateTicketClicked() {
        mTicket.setTitle(mTitle.getText().toString());
        mTicket.setDescription(mDescription.getText().toString());
        mTicket.setAssignee(mAssignee.getText().toString());
        mTicket.setPoints(!TextUtils.isEmpty(mPoints.getText().toString()) ?
                Float.parseFloat(mPoints.getText().toString()) : 0);
        mTicket.setStatus(mStatuses.get(mStatusDropdown.getSelectedItemPosition()));
        if (!TextUtils.isEmpty(mTicket.getRefId())) {
            FirebaseUtil.tickets.updateTicket(mProjectId, mTicket, new TicketsRepository.OnTicketCreatedCallback() {
                @Override
                public void onTicketCreated(String ticketId) {
                    finish();
                }
            });
        } else {
            FirebaseUtil.tickets.createTicket(mProjectId, mTicket, new TicketsRepository.OnTicketCreatedCallback() {
                @Override
                public void onTicketCreated(String ticketId) {
                    finish();
                }
            });
        }
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
