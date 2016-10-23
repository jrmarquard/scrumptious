package us.crumptio.scrumptious.sprint;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import us.crumptio.scrumptious.R;
import us.crumptio.scrumptious.ScrumBoardAdapter;
import us.crumptio.scrumptious.UiUtils;
import us.crumptio.scrumptious.createticket.CreateTicketActivity;
import us.crumptio.scrumptious.repositories.FirebaseProjectsRepository;
import us.crumptio.scrumptious.repositories.ProjectsRepository;

/**
 * Created by josh on 22/10/2016.
 */

public class SprintFragment extends Fragment {

    private static final String TAG = SprintFragment.class.getSimpleName();

    private ProjectsRepository mProjectsRepo = new FirebaseProjectsRepository();

    private String mProjectId;

    @BindView(R.id.view_pager)
    ViewPager mViewPager;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.frag_sprint, null);
        return v;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        ButterKnife.bind(this, view);

        int padding = (int) UiUtils.dpToPixels(32, getResources());
        mViewPager.setPadding(padding, 0, padding, 0);
        mViewPager.setClipToPadding(false);
    }

    @Override
    public void onResume() {
        super.onResume();
        mProjectsRepo.getDefaultProject(getContext(), new ProjectsRepository.OnProjectRetrievedCallback() {
            @Override
            public void onProjectRetrieved(String projectId) {
                mProjectId = projectId;
                mViewPager.setAdapter(new ScrumBoardAdapter(getChildFragmentManager(), projectId));
            }
        });
    }

    @OnClick(R.id.btn_new_ticket)
    protected void onNewTicketClicked() {
        CreateTicketActivity.openActivity(getActivity(), mProjectId);
    }
}
