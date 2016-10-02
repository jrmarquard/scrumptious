package us.crumptio.scrumptious.model;

/**
 * Created by josh on 2/10/2016.
 */
public class Ticket {

    private String mTitle;
    private String mDescription;
    private String mAssignee;
    private int mPoints;

    public static Ticket newInstance() {
        Ticket ticket = new Ticket();
        ticket.setTitle("Design UI for Android App");
        ticket.setAssignee("Aaron Darling");
        ticket.setDescription("Make some wireframes and mockups for all the screens in the Android App.");
        ticket.setPoints(3);
        return ticket;
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

    public int getPoints() {
        return mPoints;
    }

    public void setPoints(int mPoints) {
        this.mPoints = mPoints;
    }
}
