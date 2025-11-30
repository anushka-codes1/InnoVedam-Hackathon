// List of authorized admin users
export const AUTHORIZED_ADMINS = [
  {
    name: 'Eklavya Panwar',
    email: 'eklavya@campusswap.com',
    id: 'admin-001'
  },
  {
    name: 'Anushka Mukherjee',
    email: 'anushka@campusswap.com',
    id: 'admin-002'
  },
  {
    name: 'Md. Hayat Mallick',
    email: 'hayat@campusswap.com',
    id: 'admin-003'
  },
  {
    name: 'Aaryaa Newaskar',
    email: 'aaryaa@campusswap.com',
    id: 'admin-004'
  },
  {
    name: 'Manya Agrawal',
    email: 'manya@campusswap.com',
    id: 'admin-005'
  }
];

// Check if user is an authorized admin
export const isAuthorizedAdmin = (name: string, email: string): boolean => {
  return AUTHORIZED_ADMINS.some(
    admin => 
      admin.name.toLowerCase() === name.toLowerCase() && 
      admin.email.toLowerCase() === email.toLowerCase()
  );
};

// Get admin by credentials
export const getAdminByCredentials = (name: string, email: string) => {
  return AUTHORIZED_ADMINS.find(
    admin => 
      admin.name.toLowerCase() === name.toLowerCase() && 
      admin.email.toLowerCase() === email.toLowerCase()
  );
};
