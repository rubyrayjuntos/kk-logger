# SharePoint SSO Integration Guide

## Current vs SharePoint Authentication Flow

### Current Flow (Mock Authentication)
```
1. App loads → Show login screen
2. User enters credentials → Validate locally  
3. Set user session → Route to dashboard
4. Manual logout → Clear session
```

### SharePoint Flow (Automatic SSO)
```
1. App loads → Get current SharePoint user automatically
2. Look up user role in HACCPUsers list → Determine permissions
3. Route directly to appropriate dashboard → No login needed
4. Logout handled by SharePoint → User stays logged into Office 365
```

## Code Changes Required

### 1. Updated HACCPApp.tsx Structure
```typescript
// Remove login state - user is always authenticated in SharePoint
const [currentUser, setCurrentUser] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Get current SharePoint user and their role
  initializeUser();
}, []);

const initializeUser = async () => {
  try {
    // Get SharePoint current user
    const spUser = await getCurrentSharePointUser();
    
    // Look up user details in HACCPUsers list
    const userDetails = await getUserFromHACCPList(spUser.email);
    
    if (userDetails) {
      setCurrentUser(userDetails);
    } else {
      // New user - needs to be added to system
      setShowNewUserFlow(true);
    }
  } catch (error) {
    console.error('Failed to initialize user:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 2. SharePoint User API Functions
```typescript
// Get current SharePoint user
export const getCurrentSharePointUser = async () => {
  const response = await fetch(
    `${window.location.origin}/_api/web/currentuser`,
    {
      headers: {
        'Accept': 'application/json;odata=verbose'
      }
    }
  );
  
  const data = await response.json();
  return {
    id: data.d.Id,
    email: data.d.Email,
    name: data.d.Title,
    loginName: data.d.LoginName
  };
};

// Look up user in HACCPUsers list
export const getUserFromHACCPList = async (email: string) => {
  const response = await fetch(
    `${window.location.origin}/_api/web/lists/getbytitle('HACCPUsers')/items?$filter=Email eq '${email}'&$expand=School`,
    {
      headers: {
        'Accept': 'application/json;odata=verbose'
      }
    }
  );
  
  const data = await response.json();
  if (data.d.results.length > 0) {
    const user = data.d.results[0];
    return {
      id: user.UserID,
      email: user.Email,
      name: user.Title,
      role: user.Role,
      school: user.School,
      status: user.Status
    };
  }
  return null;
};
```

## Benefits of SharePoint SSO

### ✅ **Advantages:**
- **No login screen needed** - Users go straight to their dashboard
- **Automatic user identification** - No need to manage user sessions
- **Enterprise security** - Leverages Sodexo's existing Azure AD policies
- **Password policies** - Managed centrally by IT
- **MFA support** - If Sodexo has MFA enabled, it works automatically
- **Audit trails** - User actions tied to their corporate identity

### ⚠️ **Considerations:**
- **New user onboarding** - Need process for users not yet in HACCPUsers list
- **Role assignment** - Someone needs to assign roles to new users
- **Testing** - Can only test in SharePoint environment, not localhost
- **Permissions** - Must set up SharePoint list permissions correctly

## Implementation Approach

### Phase 1: Prepare for SSO
1. **Modify HACCPApp.tsx** to remove login screen
2. **Create SharePoint API functions** for user lookup
3. **Add new user registration flow** for first-time users
4. **Update routing logic** to handle automatic authentication

### Phase 2: Deploy & Test
1. **Deploy to SharePoint** as SharePoint-hosted app
2. **Test with your account** to verify SSO works
3. **Add sample users** to HACCPUsers list
4. **Test role-based routing** with different user accounts

### Phase 3: Production Setup
1. **Configure list permissions** for different roles
2. **Set up new user approval workflow** (optional)
3. **Train administrators** on user management
4. **Monitor and adjust** as needed

## New User Flow

When someone accesses the app but isn't in HACCPUsers list:

```typescript
const NewUserRegistration = () => {
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  
  const handleAccessRequest = async () => {
    // Send notification to administrators
    // Could create item in "Access Requests" list
    // Or send email to IT team
    setRequestSubmitted(true);
  };

  return (
    <div className="new-user-container">
      <h2>Welcome to HACCP Compliance System</h2>
      <p>Your account needs to be set up by an administrator.</p>
      <button onClick={handleAccessRequest}>
        Request Access
      </button>
      {requestSubmitted && (
        <p>Access request submitted. You'll be contacted within 24 hours.</p>
      )}
    </div>
  );
};
```

## Next Steps

1. **Review this SSO approach** - Does this match your expectations?
2. **Plan user onboarding** - How should new users get added to the system?
3. **Test environment** - Do you have access to create a test SharePoint app?
4. **Move to Azure AD App Registration** - Set up the technical integration

Would you like me to proceed with step 2 (Azure AD App Registration) or modify this SSO approach?