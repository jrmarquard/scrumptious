package us.crumptio.scrumptious.model;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by josh on 2/10/2016.
 */
public class Ticket implements Parcelable {

    public enum Status {
        TO_DO,
        IN_PROGRESS,
        CODE_REVIEW,
        DONE;

        @Override
        public String toString() {
            return super.toString().toLowerCase();
        }
    }

    public enum Sprint {
        BACKLOG,
        CURRENT,
        NEXT,
        COMPLETED;


        @Override
        public String toString() {
            return super.toString().toLowerCase();
        }
    }

    private String mRefId;
    private String mTitle;
    private String mDescription;
    private String mAssignee;
    private float mPoints;
    private String mStatus;
    private String mSprint;

    public static final Parcelable.Creator<Ticket> CREATOR = new Parcelable.Creator<Ticket>() {
        public Ticket createFromParcel(Parcel in) {
            Ticket ticket = new Ticket();
            ticket.setRefId(in.readString());
            ticket.setTitle(in.readString());
            ticket.setDescription(in.readString());
            ticket.setAssignee(in.readString());
            ticket.setPoints(in.readFloat());
            ticket.setStatus(in.readString());
            ticket.setSprint(in.readString());
            return ticket;
        }

        public Ticket[] newArray(int size) {
            return new Ticket[size];
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
        parcel.writeString(mAssignee);
        parcel.writeFloat(mPoints);
        parcel.writeString(mStatus != null ? mStatus.toString() : null);
        parcel.writeString(mSprint != null ? mSprint.toString() : null);
    }

    public void update(Ticket ticket) {
        if (ticket.mRefId.equals(mRefId)) {
            mTitle = ticket.mTitle;
            mDescription = ticket.mDescription;
            mAssignee = ticket.mAssignee;
            mPoints = ticket.mPoints;
            mStatus = ticket.mStatus;
            mSprint = ticket.mSprint;
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

    public String getAssignee() {
        return mAssignee;
    }

    public void setAssignee(String mAssignee) {
        this.mAssignee = mAssignee;
    }

    public float getPoints() {
        return mPoints;
    }

    public void setPoints(float mPoints) {
        this.mPoints = mPoints;
    }

    public String getStatus() {
        return mStatus;
    }

    public void setStatus(String status) {
        mStatus = status.toLowerCase();
    }

    public String getSprint() {
        return mSprint;
    }

    public void setSprint(String mSprint) {
        this.mSprint = mSprint;
    }
}
