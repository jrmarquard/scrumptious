package us.crumptio.scrumptious.myprojects;

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
import us.crumptio.scrumptious.model.Project;
import us.crumptio.scrumptious.repositories.ProjectsRepository;
import us.crumptio.scrumptious.util.FirebaseUtil;
import us.crumptio.scrumptious.view.ProjectListItemView;

/**
 * Created by josh on 22/10/2016.
 */

public class MyProjectsFragment extends Fragment {

    private static final String TAG = MyProjectsFragment.class.getSimpleName();

    private RecyclerMultiAdapter mAdapter;
    private OnProjectSelectedCallback mCallback;

    @BindView(R.id.project_list)
    RecyclerView mProjectList;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.frag_my_projects, null);
        return v;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        ButterKnife.bind(this, view);

        mProjectList.setLayoutManager(new LinearLayoutManager(getContext()));
        mAdapter = SmartAdapter.empty()
                .map(Project.class, ProjectListItemView.class)
                .listener(new ViewEventListener<Project>() {
                    @Override
                    public void onViewEvent(int actionId, Project project, int position, View view) {
                        if (actionId == ProjectListItemView.CLICKED) {
                            if (mCallback != null) mCallback.onProjectSelected(project.getRefId());
                        }
                    }
                })
                .into(mProjectList);

        FirebaseUtil.projects.getProjects(new ProjectsRepository.OnProjectsRetrievedCallback() {
            @Override
            public void onProjectsRetrieved(List<Project> projects) {
                mAdapter.setItems(projects);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        ((AppCompatActivity) getActivity()).getSupportActionBar().setTitle("My Projects");
    }

    public void setOnProjectSelectedCallback(OnProjectSelectedCallback callback) {
        mCallback = callback;
    }

    public interface OnProjectSelectedCallback {
        void onProjectSelected(String projectId);
    }
}
