package us.crumptio.scrumptious;

import android.content.res.Resources;
import android.util.TypedValue;

/**
 * Created by josh on 2/10/2016.
 */
public class UiUtils {

    public static float dpToPixels(int dp, Resources r) {
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, r.getDisplayMetrics());
    }
}
