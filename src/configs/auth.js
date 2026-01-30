export default {
  meEndpoint: '/v1/users/me',
  loginEndpoint: '/v1/auth/login',
  sendResetPasswordLinkEndpoint: '/v1/auth/forgot',
  resendVerificationLinkEndpoint: '/v1/auth/resend-verification',
  setPasswordLinkEndpoint: '/v1/auth/set-password',
  registerEndpoint: '/v1/auth/super-admin/signup',
  updateAccountEndpoint: '/users',
  statusEndpoint: '/users/status',
  clubEndpoint: '/users/club',
  pinEndpoint: '/users/pin',
  loginChangeOrganizationEndpoint: '/v1/auth/organization/login',
  storageTokenKeyName: 'token',

  //Contact API
  getContacts: '/users/contacts',
  createContact: '/contacts',
  deleteContact: '/contacts',
  getContactById: '/contacts/me',
  updateNotes: 'contacts/update-note',
  createNotes: 'contacts/new-note',
  deleteNotes: 'contacts/del-note',
  addCard: 'contacts/new-card',
  removeCard: 'contacts/delete-card'
}
