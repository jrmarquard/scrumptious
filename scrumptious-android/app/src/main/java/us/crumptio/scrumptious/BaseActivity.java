package us.crumptio.scrumptious;

import android.support.v7.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.FirebaseDatabase;

/**
 * Created by josh on 5/10/2016.
 */
public class BaseActivity extends AppCompatActivity {

    protected FirebaseAuth mAuth = FirebaseAuth.getInstance();
    protected FirebaseDatabase mDatabase = FirebaseDatabase.getInstance();
}
