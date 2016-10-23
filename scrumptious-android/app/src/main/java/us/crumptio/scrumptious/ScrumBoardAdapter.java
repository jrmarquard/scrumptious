package us.crumptio.scrumptious;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;

import java.util.List;

import us.crumptio.scrumptious.sprint.TicketsFragment;

/**
 * Created by josh on 2/10/2016.
 */
public class ScrumBoardAdapter extends FragmentStatePagerAdapter {

    private String mProjectId;
    private List<String> mStatuses;

    public ScrumBoardAdapter(FragmentManager fm, String projectId, List<String> statuses) {
        super(fm);
        mProjectId = projectId;
        mStatuses = statuses;
    }

    @Override
    public Fragment getItem(int position) {
        return TicketsFragment.newInstance(mProjectId, mStatuses.get(position));
    }

    @Override
    public int getCount() {
        return mStatuses.size();
    }
}
