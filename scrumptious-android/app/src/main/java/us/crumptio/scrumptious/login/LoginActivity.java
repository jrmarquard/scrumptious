package us.crumptio.scrumptious.login;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import us.crumptio.scrumptious.BaseActivity;
import us.crumptio.scrumptious.MainActivity;
import us.crumptio.scrumptious.R;

/**
 * Created by josh on 5/10/2016.
 */
public class LoginActivity extends BaseActivity implements View.OnFocusChangeListener {

    public static void openActivity(AppCompatActivity activity) {
        Intent intent = new Intent(activity, LoginActivity.class);
        activity.startActivity(intent);
    }

    private static final String TAG = LoginActivity.class.getSimpleName();

    @BindView(R.id.email)
    EditText mEmail;

    @BindView(R.id.password)
    EditText mPassword;

    private FirebaseAuth.AuthStateListener mAuthListener;
    private boolean mOpenedMainActivity = false;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        ButterKnife.bind(this);


        mEmail.setOnFocusChangeListener(this);
        mPassword.setOnFocusChangeListener(this);

        mAuthListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = firebaseAuth.getCurrentUser();
                if (user != null) {
                    // User is signed in
                    Log.d(TAG, "onAuthStateChanged:signed_in:" + user.getUid());
                    mAuth.removeAuthStateListener(mAuthListener);
                    if (!mOpenedMainActivity) {
                        MainActivity.openActivity(LoginActivity.this);
                        finish();
                        mOpenedMainActivity = true;
                    }
                } else {
                    // User is signed out
                    Log.d(TAG, "onAuthStateChanged:signed_out");
                }
            }
        };

        mPassword.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int actionId, KeyEvent keyEvent) {
                if (actionId == EditorInfo.IME_ACTION_GO) {
                    onLogInClicked();
                    return true;
                }
                return false;
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        mAuth.addAuthStateListener(mAuthListener);
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (mAuthListener != null) {
            mAuth.removeAuthStateListener(mAuthListener);
        }
    }

    @Override
    public void onFocusChange(final View view, boolean hasFocus) {
        if (!hasFocus) {
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    hideKeyboard(view);
                }
            }, 5);

        }
    }

    private void clearEditTextFocus() {
        mEmail.clearFocus();
        mPassword.clearFocus();
    }
    private void hideKeyboard(View view) {
        if (!mEmail.hasFocus() && !mPassword.hasFocus()) {
            InputMethodManager imm = (InputMethodManager) view.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

    @OnClick(R.id.log_in)
    protected void onLogInClicked() {
        clearEditTextFocus();
        hideKeyboard(mEmail);
        mAuth.signInWithEmailAndPassword(mEmail.getText().toString(), mPassword.getText().toString())
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        Log.d(TAG, "createUserWithEmail:onComplete:" + task.isSuccessful());

                        // If sign in fails, display a message to the user. If sign in succeeds
                        // the auth state listener will be notified and logic to handle the
                        // signed in user can be handled in the listener.
                        if (!task.isSuccessful()) {
                            Toast.makeText(LoginActivity.this, "Login failed",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }

    @OnClick(R.id.sign_up)
    protected void onSignUpClicked() {
        clearEditTextFocus();
        hideKeyboard(mEmail);

    }

}