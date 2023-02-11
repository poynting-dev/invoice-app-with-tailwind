const addInvoice = (invoice) => ({
  type: "ADD_INVOICE",
  invoice,
});

const updateInvoice = (id, updates) => ({
  type: "UPDATE_INVOICE",
  id,
  updates,
});

const deleteInvoice = (id) => ({
  type: "DELETE_INVOICE",
  id,
});

const setUserProfile = (profile) => ({
  type: "SET_USER_PROFILE",
  profile,
});

export const mapDispatchToProps = (dispatch) => ({
  addInvoice: (invoice) => dispatch(addInvoice(invoice)),
  updateInvoice: (id, updates) => dispatch(updateInvoice(id, updates)),
  deleteInvoice: (id) => dispatch(deleteInvoice(id)),
  setUserProfile: (profile) => dispatch(setUserProfile(profile)),
});
