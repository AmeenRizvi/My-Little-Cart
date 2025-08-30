# Parent-Child Account Linking Implementation

## Overview
This implementation allows children to save their parent's email and creates a bidirectional link between parent and child accounts in the kids e-commerce platform.

## Changes Made

### 1. Child Model Updates (`backend/src/model/child.model.js`)
- **Added `parentEmail` field**: Stores the parent's email address as a string
- **Made `parent` field required**: Ensures every child is linked to a parent account
- **Enhanced schema validation**: Both `parentEmail` and `parent` ObjectId are now required

```javascript
parentEmail: {
    type: String,
    required: true,
},
parent:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true,
},
```

### 2. Child Registration Controller Updates (`backend/src/controller/auth.route.child.js`)
- **Enhanced registration logic**: Now properly links child to parent during registration
- **Bidirectional linking**: Updates both child's parent reference and parent's children array
- **Improved validation**: Better error messages and validation flow
- **Added profile retrieval**: New function to get child profile with parent information

#### Key Features:
- Validates parent exists before creating child account
- Sets both `parentEmail` and `parent` ObjectId in child document
- Adds child's ObjectId to parent's children array
- Returns both child and parent IDs upon successful registration

### 3. Parent Controller Updates (`backend/src/controller/auth.route.parent.js`)
- **Added profile retrieval**: New function to get parent profile with children information
- **Population support**: Uses Mongoose populate to include child details

### 4. Route Updates (`backend/src/routes/auth.route.js`)
- **New endpoints added**:
  - `GET /api/auth/child/profile/:childId` - Get child profile with parent info
  - `GET /api/auth/parent/profile/:parentId` - Get parent profile with children info

## API Endpoints

### Child Registration
```
POST /api/auth/register/child
```
**Request Body:**
```json
{
    "name": "Child Name",
    "email": "child@example.com",
    "parentEmail": "parent@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "Child account created successfully and linked to parent",
    "childId": "child_object_id",
    "parentId": "parent_object_id"
}
```

### Get Child Profile
```
GET /api/auth/child/profile/:childId
```
**Response:**
```json
{
    "message": "Child profile retrieved successfully",
    "child": {
        "id": "child_id",
        "name": "Child Name",
        "email": "child@example.com",
        "parentEmail": "parent@example.com",
        "avatar": "avatar_url",
        "parent": {
            "name": "Parent Name",
            "email": "parent@example.com"
        }
    }
}
```

### Get Parent Profile
```
GET /api/auth/parent/profile/:parentId
```
**Response:**
```json
{
    "message": "Parent profile retrieved successfully",
    "parent": {
        "id": "parent_id",
        "name": "Parent Name",
        "email": "parent@example.com",
        "children": [
            {
                "name": "Child Name",
                "email": "child@example.com",
                "avatar": "avatar_url"
            }
        ]
    }
}
```

## Data Relationships

### Child Document Structure
```javascript
{
    _id: ObjectId,
    name: String,
    email: String,
    password: String,
    parentEmail: String,        // NEW: Parent's email address
    parent: ObjectId,           // Reference to Parent document
    avatar: String
}
```

### Parent Document Structure
```javascript
{
    _id: ObjectId,
    name: String,
    email: String,
    password: String,
    children: [ObjectId]        // Array of Child document references
}
```

## Validation & Error Handling

1. **Parent Existence Check**: Child registration fails if parent email doesn't exist
2. **Unique Email Validation**: Child email must be unique across all child accounts
3. **Required Field Validation**: All required fields must be provided
4. **Bidirectional Consistency**: Both parent and child documents are updated atomically

## Testing

A test script (`backend/test_parent_child_link.js`) is provided to verify:
- Parent registration
- Child registration with parent linking
- Profile retrieval for both parent and child
- Error cases (non-existent parent, duplicate emails)

To run tests:
1. Start the backend server
2. Install axios: `npm install axios`
3. Run: `node test_parent_child_link.js`

## Benefits

1. **Data Integrity**: Ensures every child has a valid parent account
2. **Bidirectional Access**: Parents can see all their children, children can see their parent
3. **Email Storage**: Parent's email is stored for easy access and communication
4. **Scalable Design**: Supports multiple children per parent account
5. **Referential Integrity**: Uses MongoDB ObjectId references for efficient queries

## Future Enhancements

1. **Authentication Middleware**: Add JWT tokens for secure access
2. **Permission System**: Implement parent approval for child actions
3. **Family Dashboard**: Create UI components for family management
4. **Notification System**: Email notifications for account linking
5. **Bulk Operations**: Allow parents to manage multiple children efficiently
