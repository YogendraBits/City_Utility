**City Utility Microservice Project**

**Overview**

This project is a multi-service web application designed to manage city utilities efficiently. It leverages microservices architecture to handle various functionalities, including:

* **User Management:** Handles user registration, login, and role-based access control.
* **Location Tracking:** Uses geolocation to determine user location and pinpoint issue locations.
* **Announcement Posting:** Allows administrators to post and manage public announcements.
* **Email Notifications:** Sends automated email notifications for various events, such as report assignments and updates.
* **Utility Reporting:** Enables users to report utility issues and track their resolution status.

**Project Structure**

```
admin/
email-service/
frontend/
location-service/
public-info-service/
user-service/
utility-reporting-service/
history-service/
```

**Frontend**

* **Citizen:**
    * Registration
    * Login
    * Home:
        * Report an Issue
        * View Reported Issues
        * Check Announcements
* **Admin:**
    * Add/Delete Employees
    * Manage Reports
    * Create/Edit/Delete Announcements
    * View Archived Reports
* **Employee:**
    * View Assigned Reports
    * Update Report Status
    * View Announcements
* **Profile Update:** All users can update their profile information.
* **Account Deletion:** Only citizens can delete their accounts.

**Backend Services**

* **User Service:** Handles user registration, login, and role-based access control.
* **Location Service:** Uses geolocation to determine user location and address.
* **Public Info Service:** Manages public announcements.
* **Utility Reporting Service:** Manages utility reports and their status.
* **Email Service:** Sends email notifications for various events.
* **History Service:** Archives resolved reports for historical reference.

**Installation and Setup**

1. **Clone the Repository:**
   ```bash
   git clone <repo-url>
   cd <repo-directory>
   ```
2. **Environment Configuration:**
   - Configure environment variables in `.env` files for each service.
3. **Install Dependencies:**
   ```bash
   cd <service-directory>
   npm install
   ```
4. **Build and Run Docker Images:**
   Build and run Docker images for each service:
   ```bash
   docker build -t <service-name> .
   docker run -d -p <port>:<port> --name <service-name> <service-name>
   ```
   (Refer to the specific instructions in each service directory for port numbers and service names.)

**Usage**

Once all services are running, access the frontend application at:
```
http://localhost:3000/
```

**Additional Notes**

* **Security:** Passwords are stored in encrypted form.
* **Error Handling:** Implement robust error handling and logging mechanisms.
* **Testing:** Write unit and integration tests to ensure code quality and reliability.
* **Deployment:** Consider using container orchestration tools like Kubernetes for deployment and scaling.

By following these steps, you can deploy and run the City Utility microservice project locally.
