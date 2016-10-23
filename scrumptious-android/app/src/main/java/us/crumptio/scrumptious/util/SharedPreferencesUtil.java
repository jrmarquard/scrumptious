package us.crumptio.scrumptious.util;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by josh on 22/10/2016.
 */

public class SharedPreferencesUtil {

    private static final String PREFS_NAME = "scrumptious_prefs";
    public static final String KEY_DEFAULT_PROJECT_ID = "default_project_id";

    private static SharedPreferences getSharedPreferences(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public static void putString(Context context, String key, String value) {
        SharedPreferences.Editor editor = getSharedPreferences(context).edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static String getString(Context context, String key) {
        return getSharedPreferences(context).getString(key, null);
    }
}
