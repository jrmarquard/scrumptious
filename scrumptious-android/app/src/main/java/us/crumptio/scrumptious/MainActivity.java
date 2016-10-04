package us.crumptio.scrumptious;

import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import butterknife.BindView;
import butterknife.ButterKnife;

public class MainActivity extends AppCompatActivity {

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
        mViewPager.setAdapter(new ScrumBoardAdapter(getSupportFragmentManager()));
    }
}
