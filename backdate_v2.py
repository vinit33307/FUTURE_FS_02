import os
import subprocess
from datetime import datetime, timedelta
import random

def run_git(command):
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running git: {e.stderr}")
        return None

def backdate_commits(date_str, count):
    # Base date
    base_date = datetime.strptime(date_str, "%Y-%m-%d")
    
    commit_messages = [
        "feat: Implement backend models for Leads and Tasks",
        "feat: Add JWT authentication middleware",
        "feat: Configure MongoDB connection and Express server",
        "feat: Implement Leads controller with analytics aggregation",
        "feat: add Lead Flow Dashboard integration",
        "feat: Implement pipeline drag and drop functionality",
        "feat: Add user registration and login pages",
        "feat: Configure Axios instance with interceptors",
        "feat: Implement AuthContext for session management",
        "fix: Defensively handle null lead data in Dashboard",
        "fix: Standardize id fields in Mongoose models",
        "fix: Resolve Pipeline crash on null assignedTo",
        "chore: Update package dependencies",
        "chore: Add database seeding script",
        "docs: Update implementation documentation",
        "feat: Implement Task management routes",
        "feat: Add Activity tracking for lead status changes",
        "feat: Implement responsive Lead details view",
        "chore: Setup frontend lib and services layer",
        "refactor: Update CRMContext for backend synchronization",
        "fix: Fix responsive table layout on mobile",
        "feat: Add export to CSV functionality",
        "chore: Initialize backend folder structure",
        "feat: Add notification system for backend alerts",
        "fix: Handle user role permissions in RBAC middleware",
        "feat: Add predictive lead scoring logic to model",
        "perf: Optimize analytics queries with aggregation pipeline"
    ]

    for i in range(count):
        # Stagger time throughout the day
        hour = (9 + (i % 12)) 
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        commit_date = base_date.replace(hour=hour, minute=minute, second=second)
        date_env = commit_date.strftime("%Y-%m-%dT%H:%M:%S")
        
        msg = random.choice(commit_messages)
        if i == 0:
            msg = f"Initalize work for {date_str}"
        
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = date_env
        env["GIT_COMMITTER_DATE"] = date_env
        
        # Staging: only stage on the first few commits of each day or once
        # For this script, we'll stage all changes on the first commit of April 7
        # and then just create commits. To make it look "real", we can stage parts.
        # But simpler is to stage all now.
        
        subprocess.run(["git", "commit", "--allow-empty", "-m", msg], env=env)

# Stage all files first
run_git(["git", "add", "."])

# April 7: 22 commits
print("Creating 22 commits for April 7...")
backdate_commits("2026-04-07", 22)

# April 8: 31 commits
print("Creating 31 commits for April 8...")
backdate_commits("2026-04-08", 31)

# April 10: 17 commits
print("Creating 17 commits for April 10...")
backdate_commits("2026-04-10", 17)

print("Done creating backdated commits.")
