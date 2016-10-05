package us.crumptio.scrumptious;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

/**
 * Created by josh on 2/10/2016.
 */
public class ScrumBoardAdapter extends FragmentPagerAdapter {

    private String mProjectId;

    public ScrumBoardAdapter(FragmentManager fm, String projectId) {
        super(fm);
        mProjectId = projectId;
    }

    @Override
    public Fragment getItem(int position) {
        if (position == 0) {
            return TicketsFragment.newInstance(mProjectId, TicketsFragment.Status.TO_DO);
        } else if (position == 1) {
            return TicketsFragment.newInstance(mProjectId, TicketsFragment.Status.IN_PROGRESS);
        } else if (position == 2) {
            return TicketsFragment.newInstance(mProjectId, TicketsFragment.Status.CODE_REVIEW);
        } else if (position == 3) {
            return TicketsFragment.newInstance(mProjectId, TicketsFragment.Status.DONE);
        }
        return null;
    }

    @Override
    public int getCount() {
        return 4;
    }
}
