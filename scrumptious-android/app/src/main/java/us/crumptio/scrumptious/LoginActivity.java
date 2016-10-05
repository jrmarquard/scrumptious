package us.crumptio.scrumptious;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * Created by josh on 5/10/2016.
 */
public class LoginActivity extends AppCompatActivity implements View.OnFocusChangeListener {

    @BindView(R.id.email)
    EditText mEmail;

    @BindView(R.id.password)
    EditText mPassword;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        ButterKnife.bind(this);


        mEmail.setOnFocusChangeListener(this);
        mPassword.setOnFocusChangeListener(this);
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
    }

    @OnClick(R.id.sign_up)
    protected void onSignUpClicked() {
        clearEditTextFocus();
        hideKeyboard(mEmail);

    }

}