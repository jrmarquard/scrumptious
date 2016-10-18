package us.crumptio.scrumptious.view;

import android.content.Context;
import android.view.View;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.nlopez.smartadapters.views.BindableRelativeLayout;
import us.crumptio.scrumptious.R;
import us.crumptio.scrumptious.model.Ticket;

/**
 * Created by josh on 2/10/2016.
 */
public class TicketView extends BindableRelativeLayout<Ticket> implements View.OnClickListener {

    public static final int CLICKED = 1;

    @BindView(R.id.title)
    TextView mTitle;

    @BindView(R.id.assignee)
    TextView mAssignee;

    @BindView(R.id.points)
    TextView mPoints;

    @BindView(R.id.description)
    TextView mDescription;

    public TicketView(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.view_ticket;
    }

    @Override
    public void onViewInflated() {
        ButterKnife.bind(this);
        setOnClickListener(this);
    }

    @Override
    public void bind(Ticket ticket) {
        mTitle.setText(ticket.getTitle());
        mAssignee.setText(ticket.getAssignee());
        mPoints.setText(ticket.getPoints() == (int) ticket.getPoints()
                ? String.format("%d", (int) ticket.getPoints()) : String.valueOf(ticket.getPoints()));
        mDescription.setText(ticket.getDescription());
    }

    @Override
    public void onClick(View view) {
        notifyItemAction(CLICKED, mTitle);
    }
}
