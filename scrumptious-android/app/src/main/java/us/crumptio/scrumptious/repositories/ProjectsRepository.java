package us.crumptio.scrumptious.repositories;

/**
 * Created by josh on 12/10/2016.
 */
public interface ProjectsRepository {

    void getDefaultProject(OnProjectRetrievedCallback callback);
    void createProject(String title, OnProjectRetrievedCallback callback);
    void addUserToProject(String projectId, String userId);

    interface OnProjectRetrievedCallback {
        void onProjectRetrieved(String projectId);
    }

}
