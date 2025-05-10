

# Bintel Analytics ERP System - Project Management Overview

### 🛠️ How It currenlty works

* **Issues as Tasks**: Each task is tracked using a GitHub issue.
* **Metadata per Task**:

  * **Assignee**: Only **one** person should be assigned to each task.
  * **Labels**:

    * Used to categorize issues by **priority** and **status**.
    * Must include the following **status labels**:

      * `Not Started`
      * `In Progress`
      * `Completed` (optional — since closed issues also indicate completion)

    * Must include the following **priority labels**:

      * `High`
      * `Medium`
      * `Low`
  * **Title** and **Description**: Clearly define the task and its context.
  * **Repository**: Tasks are organized within relevant project repositories.

---

## 🧪 Getting Started

1. **Create a Project**
   Start by creating a **Team Planning** GitHub project. This provides a structured board for issue tracking.

2. **Configure Labels**
   Ensure that the following labels are available in your repository:

   * `Not Started`
   * `In Progress`
   * `Completed` (optional — closed issues are a better indicator)
   * `High`
   * `Medium`
   * `Low`

3.  **only one assignee**.

---


> ⚠️ **Note**

As I was preparing this README, I noticed a better way to improve this one.

Currently, the ERP system uses the **GitHub REST API** to retrieve issue data. However, for better experience and richer data access, i plan to use **GitHub GraphQL API**. I couldnt notice it at first because my first thought was to use REST API because thats what i am familiar with.:

I will update it once I return to work. In the meantime, this is the overview of the direction i took.

---

## Please give feedback
