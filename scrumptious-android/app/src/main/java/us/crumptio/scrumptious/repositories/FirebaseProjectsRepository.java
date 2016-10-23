package us.crumptio.scrumptious.repositories;

import android.content.Context;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

import us.crumptio.scrumptious.model.Project;
import us.crumptio.scrumptious.util.SharedPreferencesUtil;

/**
 * Created by josh on 12/10/2016.
 */
public class FirebaseProjectsRepository extends BaseRepository implements ProjectsRepository {

    @Override
    public void getProjects(final OnProjectsRetrievedCallback callback) {
        final List<Project> projects = new ArrayList<>();
        mDatabase.getReference("users").child(mAuth.getCurrentUser().getUid())
                .child("projects")
                .addChildEventListener(new ChildEventListener() {
                    @Override
                    public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                        UserProject project = dataSnapshot.getValue(UserProject.class);
                        getProjectDetails(projects, dataSnapshot.getKey(), project.role, callback);
                    }

                    @Override
                    public void onChildChanged(DataSnapshot dataSnapshot, String s) {

                    }

                    @Override
                    public void onChildRemoved(DataSnapshot dataSnapshot) {

                    }

                    @Override
                    public void onChildMoved(DataSnapshot dataSnapshot, String s) {

                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {

                    }
                });
    }

    private void getProjectDetails(final List<Project> projects, String projectId, final String role,
                                   final OnProjectsRetrievedCallback callback) {
        mDatabase.getReference("projects").child(projectId)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        Project project = dataSnapshot.getValue(Project.class);
                        project.setRefId(dataSnapshot.getKey());
                        project.setRole(role);
                        projects.add(project);
                        callback.onProjectsRetrieved(projects);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                    }
                });
    }

    @Override
    public void getDefaultProject(Context context, final OnProjectRetrievedCallback callback) {
        String projectId = SharedPreferencesUtil.getString(context, SharedPreferencesUtil.KEY_DEFAULT_PROJECT_ID);
        if (projectId != null) {
            callback.onProjectRetrieved(projectId);
            return;
        }

        // Get the default project (i.e. first project id under users/$uid/projects)
        Query query = mDatabase.getReference("users").child(mAuth.getCurrentUser().getUid()).child("projects").limitToFirst(1);
        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot i : dataSnapshot.getChildren()) {
                    callback.onProjectRetrieved(i.getKey());
                    break;
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onProjectRetrieved(null);
            }
        });
    }

    @Override
    public void createProject(String title, OnProjectRetrievedCallback callback) {
        throw new RuntimeException("Not implemented yet!");
    }

    @Override
    public void addUserToProject(String projectId, String userId) {
        throw new RuntimeException("Not implemented yet!");
    }

    private static class UserProject {
        public String role;
    }

}
