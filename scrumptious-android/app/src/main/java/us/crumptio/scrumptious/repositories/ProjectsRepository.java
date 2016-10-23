package us.crumptio.scrumptious.repositories;

import android.content.Context;

import java.util.List;

import us.crumptio.scrumptious.model.Project;

/**
 * Created by josh on 12/10/2016.
 */
public interface ProjectsRepository {

    void getProjects(OnProjectsRetrievedCallback callback);
    void getDefaultProject(Context context, OnProjectRetrievedCallback callback);
    void createProject(String title, OnProjectRetrievedCallback callback);
    void addUserToProject(String projectId, String userId);

    interface OnProjectRetrievedCallback {
        void onProjectRetrieved(String projectId);
    }

    interface OnProjectsRetrievedCallback {
        void onProjectsRetrieved(List<Project> projects);
    }

}
