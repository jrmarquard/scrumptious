package us.crumptio.scrumptious.repositories;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

/**
 * Created by josh on 12/10/2016.
 */
public class FirebaseProjectsRepository extends BaseRepository implements ProjectsRepository {

    @Override
    public void getDefaultProject(final OnProjectRetrievedCallback callback) {
        // Get the default project (i.e. first project id under users/$uid/projects)
        Query query = mDatabase.getReference("users").child(mAuth.getCurrentUser().getUid()).child("projects").limitToFirst(1);
        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Object value = dataSnapshot.getValue();
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

}
