# SharePoint Integration Plan for HACCP Compliance System

## 1. SharePoint List Structure

### 1.1 Schools List
**Purpose**: Store school information and configuration
**List Name**: `Schools`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single Line Text | Yes | School name (auto-created) |
| SchoolID | Single Line Text | Yes | Unique identifier |
| District | Single Line Text | Yes | School district |
| Address | Multiple Lines Text | No | Physical address |
| Phone | Single Line Text | No | Contact phone |
| Email | Single Line Text | No | Main contact email |
| Status | Choice | Yes | Active, Inactive, Suspended |
| ComplianceLevel | Choice | Yes | Excellent, Good, Needs Improvement, Critical |
| LastInspection | Date | No | Last health inspection date |
| Created | Date/Time | Auto | Creation timestamp |
| Modified | Date/Time | Auto | Last modified timestamp |

### 1.2 Users List  
**Purpose**: Store user accounts and role information
**List Name**: `HACCPUsers`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single Line Text | Yes | Full name (auto-created) |
| UserID | Single Line Text | Yes | Unique user identifier |
| Email | Single Line Text | Yes | Login email |
| Role | Choice | Yes | Admin, Manager, Lead, Staff |
| SchoolID | Lookup | Yes | Link to Schools list |
| Status | Choice | Yes | Active, Inactive, Training |
| HireDate | Date | No | Employment start date |
| LastLogin | Date/Time | No | Last system access |
| TrainingStatus | Choice | Yes | Complete, In Progress, Overdue, Not Started |
| CertificationExpiry | Date | No | Training certification expiration |
| PhoneNumber | Single Line Text | No | Contact phone |
| Created | Date/Time | Auto | Creation timestamp |
| Modified | Date/Time | Auto | Last modified timestamp |

### 1.3 HACCP Logs List
**Purpose**: Store temperature and safety check logs
**List Name**: `HACCPLogs`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single Line Text | Yes | Auto-generated title |
| LogID | Single Line Text | Yes | Unique log identifier |
| SchoolID | Lookup | Yes | Link to Schools list |
| UserID | Lookup | Yes | Link to HACCPUsers list |
| LogType | Choice | Yes | Temperature, Cleaning, Receiving, Storage |
| Equipment | Single Line Text | No | Equipment/area being logged |
| Temperature | Number | No | Temperature reading (if applicable) |
| TargetTempMin | Number | No | Minimum acceptable temperature |
| TargetTempMax | Number | No | Maximum acceptable temperature |
| Status | Choice | Yes | Pass, Fail, Corrective Action Taken |
| UrgencyLevel | Choice | Yes | Green, Yellow, Orange, Red |
| Notes | Multiple Lines Text | No | Additional comments |
| CorrectiveAction | Multiple Lines Text | No | Actions taken if failure |
| Timestamp | Date/Time | Yes | When log was created |
| ShiftType | Choice | Yes | Breakfast, Lunch, Dinner, Overnight |
| IsExceptionTriggered | Yes/No | No | Whether training was triggered |
| Created | Date/Time | Auto | Creation timestamp |
| Modified | Date/Time | Auto | Last modified timestamp |

### 1.4 Training Records List
**Purpose**: Track training completion and progress
**List Name**: `TrainingRecords`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single Line Text | Yes | Auto-generated title |
| RecordID | Single Line Text | Yes | Unique record identifier |
| UserID | Lookup | Yes | Link to HACCPUsers list |
| SchoolID | Lookup | Yes | Link to Schools list |
| TrainingType | Choice | Yes | Onboarding, Exception, Recertification, Safety |
| ModuleName | Single Line Text | Yes | Training module completed |
| Status | Choice | Yes | Not Started, In Progress, Completed, Failed |
| StartDate | Date/Time | No | When training began |
| CompletionDate | Date/Time | No | When training was completed |
| Score | Number | No | Training score (0-100) |
| PassingScore | Number | No | Minimum score required |
| CertificationExpiry | Date | No | When certification expires |
| TriggerReason | Single Line Text | No | What caused the training requirement |
| Notes | Multiple Lines Text | No | Additional notes |
| Created | Date/Time | Auto | Creation timestamp |
| Modified | Date/Time | Auto | Last modified timestamp |

### 1.5 System Settings List
**Purpose**: Store application configuration and settings
**List Name**: `SystemSettings`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single Line Text | Yes | Setting name (auto-created) |
| SettingKey | Single Line Text | Yes | Unique setting identifier |
| SettingValue | Multiple Lines Text | Yes | Configuration value (JSON) |
| Category | Choice | Yes | App, Notifications, Thresholds, Integration |
| Description | Multiple Lines Text | No | What this setting controls |
| IsActive | Yes/No | Yes | Whether setting is enabled |
| LastModifiedBy | Person/Group | No | Who last changed this setting |
| Created | Date/Time | Auto | Creation timestamp |
| Modified | Date/Time | Auto | Last modified timestamp |

### 1.6 Notifications List
**Purpose**: Store system notifications and alerts
**List Name**: `Notifications`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single Line Text | Yes | Notification title (auto-created) |
| NotificationID | Single Line Text | Yes | Unique notification identifier |
| RecipientUserID | Lookup | Yes | Link to HACCPUsers list |
| SchoolID | Lookup | No | Link to Schools list (if school-specific) |
| Type | Choice | Yes | Alert, Warning, Info, Training, System |
| Priority | Choice | Yes | Low, Medium, High, Critical |
| Message | Multiple Lines Text | Yes | Notification content |
| IsRead | Yes/No | No | Whether notification was read |
| ActionRequired | Yes/No | No | Whether action is needed |
| ActionUrl | Single Line Text | No | Link to relevant page |
| ExpiryDate | Date/Time | No | When notification expires |
| Created | Date/Time | Auto | Creation timestamp |
| Modified | Date/Time | Auto | Last modified timestamp |

## 1.2 List Relationships

```
Schools (1) ←→ (Many) HACCPUsers
Schools (1) ←→ (Many) HACCPLogs  
Schools (1) ←→ (Many) TrainingRecords
Schools (1) ←→ (Many) Notifications

HACCPUsers (1) ←→ (Many) HACCPLogs
HACCPUsers (1) ←→ (Many) TrainingRecords
HACCPUsers (1) ←→ (Many) Notifications
```

## 1.3 Permissions Strategy

### Site Level Permissions
- **Site Owners**: IT Administrators, System Administrators
- **Site Members**: District Managers, School Principals  
- **Site Visitors**: All HACCP Users (with list-specific permissions)

### List Level Permissions
- **Schools**: Read for all users, Edit for Admins/Managers
- **HACCPUsers**: Read own profile, Edit for Admins, View team for Managers
- **HACCPLogs**: Full access for own school, Read for managers across district
- **TrainingRecords**: Read own records, Full access for Admins/Managers
- **SystemSettings**: Admin only
- **Notifications**: Read own notifications, Create for system

## 1.4 Implementation Steps

### Phase 1: Basic Lists (Week 1)
1. Create Schools list with sample data
2. Create HACCPUsers list with sample users
3. Create HACCPLogs list with basic structure
4. Test basic CRUD operations

### Phase 2: Advanced Features (Week 2)  
1. Add TrainingRecords list
2. Implement Notifications list
3. Create SystemSettings list
4. Set up list relationships and lookups

### Phase 3: Permissions & Security (Week 3)
1. Configure list-level permissions
2. Set up user group mappings
3. Test role-based access
4. Implement row-level security

### Phase 4: Integration Testing (Week 4)
1. Connect frontend to SharePoint REST API
2. Test all CRUD operations
3. Validate data synchronization
4. Performance optimization

## 1.5 Sample Data Structure

### Schools Sample Data
```json
[
  {
    "Title": "Lincoln Elementary",
    "SchoolID": "LINC-001", 
    "District": "Metro School District",
    "Status": "Active",
    "ComplianceLevel": "Good"
  }
]
```

### HACCPUsers Sample Data  
```json
[
  {
    "Title": "Sarah Johnson",
    "UserID": "sarah.johnson",
    "Email": "sarah.johnson@metroschools.edu",
    "Role": "Manager", 
    "SchoolID": "LINC-001",
    "Status": "Active"
  }
]
```

## Next Steps
1. Review this structure with your SharePoint administrator
2. Create the lists in your SodexoCustomApps site
3. Populate with sample data for testing
4. Begin API integration development

Would you like me to proceed to step 2 (Azure AD App Registration) or would you like to modify any of these list structures first?