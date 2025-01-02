# Mentoring Admin Dashboard

The Mentoring Admin Dashboard is a comprehensive web application designed for managing users, organizations, dynamic entities, forms, and notification templates efficiently. It features a user-friendly interface for administrators to oversee and customize their mentoring ecosystem.

## Table of Contents

1. [Features Overview](#features-overview)
2. [Details of Each Page](#details-of-each-page)
   - [Home Page](#home-page)
   - [User List](#user-list)
   - [Organizations](#organizations)
   - [Entity Types](#entity-types)
   - [Forms Management](#forms-management)
   - [Notification Templates](#notification-templates)
3. [Getting Started](#getting-started)
4. [Technical Details](#technical-details)

---

## Features Overview

The Mentoring Admin Dashboard includes the following high-level features:

- **Home Page**: Provides quick insights via cards for the total number of users and organizations, as well as a button to refresh database materialized views.
- **Sidebar Navigation**: Accessible links for Home, My Profile, All Users, Entity Types, Forms, and Notification Templates.
- **Dynamic Management**: Manage entities, forms, and notifications dynamically for different organizations.
- **Organization-Specific Actions**: Perform actions on behalf of specific organizations using the "Act as Org Admin" feature.

---

## Details of Each Page

### Home Page

The home page provides a snapshot of the system's current state:

- **Cards**:
  - Total number of users.
  - Total number of organizations.
  - Button to refresh database materialized views.
- **Sidebar Navigation**: Links to other core pages of the application.

---

### User List

Accessible from both the home page card and the sidebar, the User List allows administrators to:

- View user details including **name**, **email**, **organization**, and **role**.
- Perform actions:
  - **Assign as Org Admin**: Grants the user admin rights for their organization.
  - **Delete User**: Removes the user from the system.
- **Search and Navigation**:
  - Search users by name or email ID.
  - Navigate through pages using next and previous buttons.

---

### Organizations

In the Organizations section:

- **View Details**:
  - Opens a pop-up listing all organizations.
  - Perform actions:
    - **Deactivate Organization**: Temporarily disable an organization.
    - **Act as Org Admin**: Perform actions on behalf of the organization.
- **Add New Organization**: Create new organizations by filling in necessary details.

---

### Entity Types

The Entity Types page is designed for dynamic field management, offering flexibility and customization for user data:

- **Purpose**:

  - Enable organizations to define additional fields in user details dynamically. For example, an organization can add a new column such as 'gender' and populate it with specific options like 'male,' 'female,' or 'others.'

- **Entity Types**:

  - Acts as a mechanism for creating and managing custom fields.
  - Administrators can add, edit, or delete entity types.
  - **Inherit Entity Type**: Allows other organizations to adopt default entity types while adding custom entities as needed.

- **Entities**:

  - View entities belonging to a specific entity type in a pop-up.
  - Create new entities and search existing ones.
  - Edit or delete individual entities.

---

### Forms Management

The Forms Management page enables dynamic updates to frontend forms:

- **Form List**: Displayed on the left panel.
- **Form Details**: Clicking on a form shows its details in two tabs:
  - **Basic Details**: View general information about the form.
  - **Modify Form**: Update the form structure to include newly added fields, such as the ‘gender’ column from entity types.

---

### Notification Templates

The Notification Templates page provides:

- A list of active notification templates.
- Options to create, edit, or delete templates.
- Organization-level customizations via the "Act as Org Admin" feature from the Organizations page.

---

## Getting Started

This repository contains only the frontend code for the Mentoring Admin Dashboard, built using React with Vite and Shadcn UI components. Follow these steps to set up the application:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure the environment variables in a `.env` file.
4. Start the development server with `npm run dev`.
5. Access the application at `http://localhost:3000`.

Ensure the backend service and database are configured and running, as they are necessary for full functionality.

---

## Technical Details

- **Frontend**: React.js with Tailwind CSS for styling.

- **Dynamic Features**: Entity Types and Forms enable customizable user fields and dynamic form structures.

- **Organization-Specific Actions**: Administrators can manage features at the organization level using the "Act as Org Admin" functionality.

---

The Mentoring Admin Dashboard is built to provide flexibility and efficiency for administrators managing large-scale mentoring networks. For more details or contributions, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file or contact the repository owner.

