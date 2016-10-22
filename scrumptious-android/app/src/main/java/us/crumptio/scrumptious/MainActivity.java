package us.crumptio.scrumptious;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;

import com.afollestad.materialdialogs.DialogAction;
import com.afollestad.materialdialogs.MaterialDialog;

import butterknife.BindView;
import butterknife.ButterKnife;
import us.crumptio.scrumptious.login.LoginActivity;
import us.crumptio.scrumptious.sprint.SprintFragment;

public class MainActivity extends BaseActivity {

    public static void openActivity(AppCompatActivity activity) {
        Intent intent = new Intent(activity, MainActivity.class);
        activity.startActivity(intent);
    }

    private static final String TAG = MainActivity.class.getSimpleName();

    @BindView(R.id.drawer_layout)
    DrawerLayout mDrawer;

    @BindView(R.id.toolbar)
    Toolbar mToolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);

        setSupportActionBar(mToolbar);

        showFragment(new SprintFragment(), "sprint", false);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, mDrawer, mToolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        mDrawer.addDrawerListener(toggle);
        toggle.syncState();
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

    private void showFragment(Fragment fragment, String tag, boolean addToBackStack) {
        FragmentManager fm = getSupportFragmentManager();
        FragmentTransaction trans = fm.beginTransaction();
        trans.replace(R.id.content, fragment, tag);
        if (addToBackStack) trans.addToBackStack(tag);
        trans.commit();
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
