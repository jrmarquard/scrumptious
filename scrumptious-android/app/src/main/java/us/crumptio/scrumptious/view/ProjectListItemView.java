package us.crumptio.scrumptious.view;

import android.content.Context;
import android.graphics.Typeface;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.nlopez.smartadapters.views.BindableLinearLayout;
import us.crumptio.scrumptious.R;
import us.crumptio.scrumptious.model.Project;

/**
 * Created by josh on 22/10/2016.
 */

public class ProjectListItemView extends BindableLinearLayout<Project> implements View.OnClickListener {

    public static final int CLICKED = 1;

    @BindView(R.id.title)
    TextView mTitle;

    @BindView(R.id.role)
    TextView mRole;

    public ProjectListItemView(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.view_li_project;
    }

    @Override
    public int getOrientation() {
        return LinearLayout.VERTICAL;
    }

    @Override
    public void onViewInflated() {
        ButterKnife.bind(this);
        setOnClickListener(this);
    }

    @Override
    public void bind(Project project) {
        mTitle.setText(project.getTitle());
        mRole.setText(project.getRole());

        if (project.getRole().toLowerCase().equals("owner")) {
            mRole.setTypeface(mRole.getTypeface(), Typeface.BOLD);
        } else {
            mRole.setTypeface(mRole.getTypeface(), Typeface.NORMAL);
        }
    }

    @Override
    public void onClick(View view) {
        notifyItemAction(CLICKED);
    }
}
