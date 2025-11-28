# SharePoint List Creation Guide
## Step-by-Step Instructions for Creating HACCP Lists

### Overview
We need to create 6 lists in your SodexoCustomApps SharePoint site. The best approach is to **start with "Blank List"** for each one, then add the custom columns.

## Step 1: Access Your SharePoint Site
1. Go to `https://sodexo.sharepoint.com/sites/SodexoCustomApps`
2. Click **"New"** → **"List"**
3. Choose **"Blank List"** (this gives us the most control)

---

## List 1: Schools
### Create the List
1. **New** → **List** → **Blank List**
2. **Name**: `Schools`
3. **Description**: `School information and configuration data`
4. Click **Create**

### Add Custom Columns (in this order)
After the list is created, click **"Add column"** for each:

1. **SchoolID**
   - Type: **Single line of text**
   - Required: **Yes**
   - Enforce unique values: **Yes**

2. **District** 
   - Type: **Single line of text**
   - Required: **Yes**

3. **Address**
   - Type: **Multiple lines of text**
   - Required: **No**

4. **Phone**
   - Type: **Single line of text**
   - Required: **No**

5. **Email**
   - Type: **Single line of text**
   - Required: **No**

6. **Status**
   - Type: **Choice**
   - Choices: `Active`, `Inactive`, `Suspended`
   - Default: `Active`
   - Required: **Yes**

7. **ComplianceLevel**
   - Type: **Choice** 
   - Choices: `Excellent`, `Good`, `Needs Improvement`, `Critical`
   - Default: `Good`
   - Required: **Yes**

8. **LastInspection**
   - Type: **Date and time**
   - Required: **No**

### Add Sample Data
Add one test school:
- **Title**: `Lincoln Elementary`
- **SchoolID**: `LINC-001`
- **District**: `Metro School District`
- **Status**: `Active`
- **ComplianceLevel**: `Good`

---

## List 2: HACCPUsers
### Create the List
1. **New** → **List** → **Blank List**
2. **Name**: `HACCPUsers`
3. **Description**: `User accounts and role information`
4. Click **Create**

### Add Custom Columns
1. **UserID**
   - Type: **Single line of text**
   - Required: **Yes**
   - Enforce unique values: **Yes**

2. **Email**
   - Type: **Single line of text**
   - Required: **Yes**
   - Enforce unique values: **Yes**

3. **Role**
   - Type: **Choice**
   - Choices: `Admin`, `Manager`, `Lead`, `Staff`
   - Required: **Yes**

4. **SchoolID**
   - Type: **Lookup**
   - Get information from: **Schools**
   - In this column: **SchoolID**
   - Required: **Yes**

5. **Status**
   - Type: **Choice**
   - Choices: `Active`, `Inactive`, `Training`
   - Default: `Active`
   - Required: **Yes**

6. **HireDate**
   - Type: **Date and time**
   - Required: **No**

7. **LastLogin**
   - Type: **Date and time**
   - Required: **No**

8. **TrainingStatus**
   - Type: **Choice**
   - Choices: `Complete`, `In Progress`, `Overdue`, `Not Started`
   - Default: `Not Started`
   - Required: **Yes**

9. **CertificationExpiry**
   - Type: **Date and time**
   - Required: **No**

10. **PhoneNumber**
    - Type: **Single line of text**
    - Required: **No**

### Add Sample Data
Add yourself as a test user:
- **Title**: `[Your Name]`
- **UserID**: `[your.username]`
- **Email**: `[your.email@sodexo.com]`
- **Role**: `Admin`
- **SchoolID**: `LINC-001` (select from dropdown)
- **Status**: `Active`

---

## List 3: HACCPLogs
### Create the List
1. **New** → **List** → **Blank List**
2. **Name**: `HACCPLogs`
3. **Description**: `Temperature and safety check logs`
4. Click **Create**

### Add Custom Columns
1. **LogID**
   - Type: **Single line of text**
   - Required: **Yes**
   - Enforce unique values: **Yes**

2. **SchoolID**
   - Type: **Lookup**
   - Get information from: **Schools**
   - In this column: **SchoolID**
   - Required: **Yes**

3. **UserID**
   - Type: **Lookup**
   - Get information from: **HACCPUsers**
   - In this column: **UserID**
   - Required: **Yes**

4. **LogType**
   - Type: **Choice**
   - Choices: `Temperature`, `Cleaning`, `Receiving`, `Storage`
   - Required: **Yes**

5. **Equipment**
   - Type: **Single line of text**
   - Required: **No**

6. **Temperature**
   - Type: **Number**
   - Min: **-20**
   - Max: **220**
   - Decimal places: **1**
   - Required: **No**

7. **TargetTempMin**
   - Type: **Number**
   - Required: **No**

8. **TargetTempMax**
   - Type: **Number**
   - Required: **No**

9. **Status**
   - Type: **Choice**
   - Choices: `Pass`, `Fail`, `Corrective Action Taken`
   - Required: **Yes**

10. **UrgencyLevel**
    - Type: **Choice**
    - Choices: `Green`, `Yellow`, `Orange`, `Red`
    - Required: **Yes**

11. **Notes**
    - Type: **Multiple lines of text**
    - Required: **No**

12. **CorrectiveAction**
    - Type: **Multiple lines of text**
    - Required: **No**

13. **Timestamp**
    - Type: **Date and time**
    - Required: **Yes**

14. **ShiftType**
    - Type: **Choice**
    - Choices: `Breakfast`, `Lunch`, `Dinner`, `Overnight`
    - Required: **Yes**

15. **IsExceptionTriggered**
    - Type: **Yes/No**
    - Default: **No**

---

## List 4: TrainingRecords
### Create the List
1. **New** → **List** → **Blank List**
2. **Name**: `TrainingRecords`
3. **Description**: `Training completion and progress tracking`
4. Click **Create**

### Add Custom Columns
1. **RecordID**
   - Type: **Single line of text**
   - Required: **Yes**
   - Enforce unique values: **Yes**

2. **UserID**
   - Type: **Lookup**
   - Get information from: **HACCPUsers**
   - In this column: **UserID**
   - Required: **Yes**

3. **SchoolID**
   - Type: **Lookup**
   - Get information from: **Schools**
   - In this column: **SchoolID**
   - Required: **Yes**

4. **TrainingType**
   - Type: **Choice**
   - Choices: `Onboarding`, `Exception`, `Recertification`, `Safety`
   - Required: **Yes**

5. **ModuleName**
   - Type: **Single line of text**
   - Required: **Yes**

6. **Status**
   - Type: **Choice**
   - Choices: `Not Started`, `In Progress`, `Completed`, `Failed`
   - Default: `Not Started`
   - Required: **Yes**

7. **StartDate**
   - Type: **Date and time**
   - Required: **No**

8. **CompletionDate**
   - Type: **Date and time**
   - Required: **No**

9. **Score**
   - Type: **Number**
   - Min: **0**
   - Max: **100**
   - Required: **No**

10. **PassingScore**
    - Type: **Number**
    - Min: **0**
    - Max: **100**
    - Required: **No**

11. **CertificationExpiry**
    - Type: **Date and time**
    - Required: **No**

12. **TriggerReason**
    - Type: **Single line of text**
    - Required: **No**

13. **Notes**
    - Type: **Multiple lines of text**
    - Required: **No**

---

## List 5: SystemSettings
### Create the List
1. **New** → **List** → **Blank List**
2. **Name**: `SystemSettings`
3. **Description**: `Application configuration and settings`
4. Click **Create**

### Add Custom Columns
1. **SettingKey**
   - Type: **Single line of text**
   - Required: **Yes**
   - Enforce unique values: **Yes**

2. **SettingValue**
   - Type: **Multiple lines of text**
   - Required: **Yes**

3. **Category**
   - Type: **Choice**
   - Choices: `App`, `Notifications`, `Thresholds`, `Integration`
   - Required: **Yes**

4. **Description**
   - Type: **Multiple lines of text**
   - Required: **No**

5. **IsActive**
   - Type: **Yes/No**
   - Default: **Yes**
   - Required: **Yes**

6. **LastModifiedBy**
   - Type: **Person or Group**
   - Required: **No**

---

## List 6: Notifications
### Create the List
1. **New** → **List** → **Blank List**
2. **Name**: `Notifications`
3. **Description**: `System notifications and alerts`
4. Click **Create**

### Add Custom Columns
1. **NotificationID**
   - Type: **Single line of text**
   - Required: **Yes**
   - Enforce unique values: **Yes**

2. **RecipientUserID**
   - Type: **Lookup**
   - Get information from: **HACCPUsers**
   - In this column: **UserID**
   - Required: **Yes**

3. **SchoolID**
   - Type: **Lookup**
   - Get information from: **Schools**
   - In this column: **SchoolID**
   - Required: **No**

4. **Type**
   - Type: **Choice**
   - Choices: `Alert`, `Warning`, `Info`, `Training`, `System`
   - Required: **Yes**

5. **Priority**
   - Type: **Choice**
   - Choices: `Low`, `Medium`, `High`, `Critical`
   - Required: **Yes**

6. **Message**
   - Type: **Multiple lines of text**
   - Required: **Yes**

7. **IsRead**
   - Type: **Yes/No**
   - Default: **No**

8. **ActionRequired**
   - Type: **Yes/No**
   - Default: **No**

9. **ActionUrl**
   - Type: **Single line of text**
   - Required: **No**

10. **ExpiryDate**
    - Type: **Date and time**
    - Required: **No**

---

## Quick Tips for Creating Lists

### ✅ **Best Practices:**
- Create lists in the order shown (Schools first, then HACCPUsers, etc.)
- Always use **"Blank List"** - gives you the most control
- Add columns one at a time to avoid errors
- Test each lookup relationship as you create it
- Add sample data to verify everything works

### ⚠️ **Common Issues:**
- **Lookup columns**: Must create the source list first (Schools before HACCPUsers)
- **Column names**: Use exact names from the guide - no spaces or special characters
- **Choice values**: Enter exactly as shown, case-sensitive
- **Required fields**: Mark appropriately or you'll get errors when testing

### 🔄 **After Creating All Lists:**
1. **Test the relationships** - Add sample data to verify lookups work
2. **Check permissions** - Make sure you can read/write to all lists
3. **Take screenshots** - Document your setup for reference

## Next Steps
Once you've created all 6 lists:
1. **Add sample data** to test the relationships
2. **Verify permissions** are working correctly
3. **Ready for step 2** - Azure AD App Registration
4. **Then step 3** - API integration code

**Estimated time**: 2-3 hours to create all lists with sample data

Let me know when you've created the lists and I'll help you with the next step!