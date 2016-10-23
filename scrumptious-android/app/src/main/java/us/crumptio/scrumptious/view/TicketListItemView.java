package us.crumptio.scrumptious.view;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.nlopez.smartadapters.views.BindableLinearLayout;
import us.crumptio.scrumptious.R;
import us.crumptio.scrumptious.model.Ticket;

/**
 * Created by josh on 23/10/2016.
 */

public class TicketListItemView extends BindableLinearLayout<Ticket> implements View.OnClickListener {

    public static final int CLICKED = 1;

    @BindView(R.id.profile_image)
    View mProfileImage;

    @BindView(R.id.title)
    TextView mTitle;

    @BindView(R.id.assignee)
    TextView mAssignee;

    @BindView(R.id.points)
    TextView mPoints;

    public TicketListItemView(Context context) {
        super(context);
    }

    @Override
    public int getOrientation() {
        return LinearLayout.VERTICAL;
    }

    @Override
    public int getLayoutId() {
        return R.layout.view_li_ticket;
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
    }

    @Override
    public void onClick(View view) {
        notifyItemAction(CLICKED);
    }

}
