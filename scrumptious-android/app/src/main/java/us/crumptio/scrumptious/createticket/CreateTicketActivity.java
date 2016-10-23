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

    private TicketsRepository mTicketsRepo = new FirebaseTicketsRepository();

    private String mProjectId = null;
    private Ticket mTicket;

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

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, R.layout.li_status, new String[]{
                "To Do",
                "In Progress",
                "Code Review",
                "Done"
        });
        mStatusDropdown.setAdapter(adapter);

        if (getIntent().hasExtra(ARG_PROJECT_ID)) {
            mProjectId = getIntent().getStringExtra(ARG_PROJECT_ID);
        }

        if (getIntent().hasExtra(ARG_TICKET)) {
            mTicket = getIntent().getParcelableExtra(ARG_TICKET);
            getSupportActionBar().setTitle("Edit Ticket");
            mCreateTicket.setText("UPDATE TICKET");
            mTitle.setText(mTicket.getTitle());
            mDescription.setText(mTicket.getDescription());
            mAssignee.setText(mTicket.getAssignee());
            mPoints.setText(mTicket.getPoints() == (int) mTicket.getPoints()
                    ? String.format("%d", (int) mTicket.getPoints()) : String.valueOf(mTicket.getPoints()));
            switch (Ticket.Status.valueOf(mTicket.getStatus().toUpperCase())) {
                case TO_DO:
                    mStatusDropdown.setSelection(0);
                    break;
                case IN_PROGRESS:
                    mStatusDropdown.setSelection(1);
                    break;
                case CODE_REVIEW:
                    mStatusDropdown.setSelection(2);
                    break;
                case DONE:
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
        mTicket.setStatus(Ticket.Status.TO_DO.toString());
        switch (mStatusDropdown.getSelectedItemPosition()) {
            case 0:
                mTicket.setStatus(Ticket.Status.TO_DO.toString());
                break;
            case 1:
                mTicket.setStatus(Ticket.Status.IN_PROGRESS.toString());
                break;
            case 2:
                mTicket.setStatus(Ticket.Status.CODE_REVIEW.toString());
                break;
            case 3:
                mTicket.setStatus(Ticket.Status.DONE.toString());
                break;
        }
        if (!TextUtils.isEmpty(mTicket.getRefId())) {
            mTicketsRepo.updateTicket(mProjectId, mTicket, new TicketsRepository.OnTicketCreatedCallback() {
                @Override
                public void onTicketCreated(String ticketId) {
                    finish();
                }
            });
        } else {
            mTicketsRepo.createTicket(mProjectId, mTicket, new TicketsRepository.OnTicketCreatedCallback() {
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
