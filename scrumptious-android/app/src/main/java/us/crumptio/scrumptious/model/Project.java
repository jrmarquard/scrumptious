package us.crumptio.scrumptious.model;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.firebase.database.Exclude;

/**
 * Created by josh on 22/10/2016.
 */

public class Project implements Parcelable {

    private String mRefId;
    private String mTitle;
    private String mDescription;
    @Exclude
    private String mRole;

    public static final Parcelable.Creator<Project> CREATOR = new Parcelable.Creator<Project>() {
        public Project createFromParcel(Parcel in) {
            Project project = new Project();
            project.setRefId(in.readString());
            project.setTitle(in.readString());
            project.setDescription(in.readString());
            project.setRole(in.readString());
            return project;
        }

        public Project[] newArray(int size) {
            return new Project[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(mRefId);
        parcel.writeString(mTitle);
        parcel.writeString(mDescription);
        parcel.writeString(mRole);
    }

    public void update(Project project) {
        if (project.mRefId.equals(mRefId)) {
            mTitle = project.mTitle;
            mDescription = project.mDescription;
            mRole = project.mRole;
        }
    }

    public String getRefId() {
        return mRefId;
    }

    public void setRefId(String mRefId) {
        this.mRefId = mRefId;
    }

    public String getTitle() {
        return mTitle;
    }

    public void setTitle(String mTitle) {
        this.mTitle = mTitle;
    }

    public String getDescription() {
        return mDescription;
    }

    public void setDescription(String mDescription) {
        this.mDescription = mDescription;
    }

    @Exclude
    public String getRole() {
        return mRole;
    }

    @Exclude
    public void setRole(String mRole) {
        this.mRole = mRole;
    }
}
