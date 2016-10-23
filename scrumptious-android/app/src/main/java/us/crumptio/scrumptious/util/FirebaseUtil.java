package us.crumptio.scrumptious.util;

import us.crumptio.scrumptious.repositories.FirebaseProjectsRepository;
import us.crumptio.scrumptious.repositories.FirebaseTicketsRepository;
import us.crumptio.scrumptious.repositories.ProjectsRepository;
import us.crumptio.scrumptious.repositories.TicketsRepository;

/**
 * Created by josh on 23/10/2016.
 */

public class FirebaseUtil {

    public static final ProjectsRepository projects = new FirebaseProjectsRepository();
    public static final TicketsRepository tickets = new FirebaseTicketsRepository();

}
