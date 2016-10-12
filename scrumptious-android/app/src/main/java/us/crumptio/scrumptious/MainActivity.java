package us.crumptio.scrumptious;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.afollestad.materialdialogs.DialogAction;
import com.afollestad.materialdialogs.MaterialDialog;

import butterknife.BindView;
import butterknife.ButterKnife;
import us.crumptio.scrumptious.login.LoginActivity;
import us.crumptio.scrumptious.repositories.FirebaseProjectsRepository;
import us.crumptio.scrumptious.repositories.ProjectsRepository;

public class MainActivity extends BaseActivity {

    public static void openActivity(AppCompatActivity activity) {
        Intent intent = new Intent(activity, MainActivity.class);
        activity.startActivity(intent);
    }

    private static final String TAG = MainActivity.class.getSimpleName();

    private ProjectsRepository mProjectsRepo = new FirebaseProjectsRepository();

    @BindView(R.id.view_pager)
    ViewPager mViewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);

        int padding = (int) UiUtils.dpToPixels(32, getResources());
        mViewPager.setPadding(padding, 0, padding, 0);
        mViewPager.setClipToPadding(false);

        Log.d(TAG, mAuth.getCurrentUser().getUid());
        mProjectsRepo.getDefaultProject(new ProjectsRepository.OnProjectRetrievedCallback() {
            @Override
            public void onProjectRetrieved(String projectId) {
                mViewPager.setAdapter(new ScrumBoardAdapter(getSupportFragmentManager(), projectId));
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.sign_out:
                signOut();
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void signOut() {
        new MaterialDialog.Builder(this)
                .title("Sign Out")
                .content("Are you sure you want to sign out?")
                .positiveText("Sign Out")
                .negativeText("Cancel")
                .onPositive(new MaterialDialog.SingleButtonCallback() {
                    @Override
                    public void onClick(@NonNull MaterialDialog dialog, @NonNull DialogAction which) {
                        mAuth.signOut();
                        LoginActivity.openActivity(MainActivity.this);
                        finish();
                    }
                })
                .show();
    }
}
