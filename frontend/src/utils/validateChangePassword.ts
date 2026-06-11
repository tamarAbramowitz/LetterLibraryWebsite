export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function validateChangePasswordForm(
  data: ChangePasswordFormData,
  messages: {
    currentRequired: string;
    newRequired: string;
    confirmRequired: string;
    newMin: string;
    mismatch: string;
    sameAsCurrent: string;
  }
): ChangePasswordFormErrors {
  const errors: ChangePasswordFormErrors = {};

  if (!data.currentPassword.trim()) {
    errors.currentPassword = messages.currentRequired;
  }

  if (!data.newPassword.trim()) {
    errors.newPassword = messages.newRequired;
  } else if (data.newPassword.trim().length < 4) {
    errors.newPassword = messages.newMin;
  } else if (data.newPassword.trim() === data.currentPassword.trim()) {
    errors.newPassword = messages.sameAsCurrent;
  }

  if (!data.confirmPassword.trim()) {
    errors.confirmPassword = messages.confirmRequired;
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = messages.mismatch;
  }

  return errors;
}

export function hasChangePasswordErrors(errors: ChangePasswordFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
