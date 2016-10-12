package us.crumptio.scrumptious.repositories;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.FirebaseDatabase;

/**
 * Created by josh on 12/10/2016.
 */
public class BaseRepository {

    protected FirebaseAuth mAuth = FirebaseAuth.getInstance();
    protected FirebaseDatabase mDatabase = FirebaseDatabase.getInstance();

}
