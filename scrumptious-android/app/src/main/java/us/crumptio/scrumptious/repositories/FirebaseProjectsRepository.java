package us.crumptio.scrumptious.repositories;

import android.content.Context;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import us.crumptio.scrumptious.model.Project;
import us.crumptio.scrumptious.model.Ticket;
import us.crumptio.scrumptious.util.FirebaseUtil;
import us.crumptio.scrumptious.util.SharedPreferencesUtil;

/**
 * Created by josh on 12/10/2016.
 */
public class FirebaseProjectsRepository extends BaseRepository implements ProjectsRepository {

    private Map<String, Project> mProjects = new HashMap<>();

    @Override
    public void getProjects(final OnProjectsRetrievedCallback callback) {
        if (!mProjects.values().isEmpty()) {
            if (callback != null) callback.onProjectsRetrieved(new ArrayList<>(mProjects.values()));
        }

        mDatabase.getReference("users").child(mAuth.getCurrentUser().getUid())
                .child("projects")
                .addChildEventListener(new ChildEventListener() {
                    @Override
                    public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                        UserProject project = dataSnapshot.getValue(UserProject.class);
                        getProjectDetails(dataSnapshot.getKey(), project.role, new OnProjectRetrievedCallback() {
                            @Override
                            public void onProjectRetrieved(Project project) {
                                mProjects.put(project.getRefId(), project);
                                if (callback != null)
                                    callback.onProjectsRetrieved(new ArrayList<>(mProjects.values()));
                            }
                        });
                    }

                    @Override
                    public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                        UserProject project = dataSnapshot.getValue(UserProject.class);
                        getProjectDetails(dataSnapshot.getKey(), project.role, new OnProjectRetrievedCallback() {
                            @Override
                            public void onProjectRetrieved(Project project) {
                                mProjects.put(project.getRefId(), project);
                                if (callback != null)
                                    callback.onProjectsRetrieved(new ArrayList<>(mProjects.values()));
                            }
                        });
                    }

                    @Override
                    public void onChildRemoved(DataSnapshot dataSnapshot) {
                        mProjects.remove(dataSnapshot.getKey());
                        if (callback != null)
                            callback.onProjectsRetrieved(new ArrayList<>(mProjects.values()));
                    }

                    @Override
                    public void onChildMoved(DataSnapshot dataSnapshot, String s) {

                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {

                    }
                });
    }

    private void getProjectDetails(String projectId, final String role, final OnProjectRetrievedCallback callback) {
        mDatabase.getReference("projects").child(projectId)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        Project project = dataSnapshot.getValue(Project.class);
                        project.setRefId(dataSnapshot.getKey());
                        project.setRole(role);
                        if (callback != null) callback.onProjectRetrieved(project);

                        // Prefetch backlog and sprint tickets
                        FirebaseUtil.tickets.getTickets(project.getRefId(), Ticket.Sprint.BACKLOG, null);
                        FirebaseUtil.tickets.getTickets(project.getRefId(), Ticket.Sprint.CURRENT, null);
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
            getProjectDetails(projectId, null, callback);
            return;
        }

        // Get the default project (i.e. first project id under users/$uid/projects)
        Query query = mDatabase.getReference("users").child(mAuth.getCurrentUser().getUid()).child("projects").limitToFirst(1);
        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot i : dataSnapshot.getChildren()) {
                    getProjectDetails(i.getKey(), null, callback);
                    break;
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                if (callback != null) callback.onProjectRetrieved(null);
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
