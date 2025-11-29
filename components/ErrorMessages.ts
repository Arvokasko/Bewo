// errorMessages.ts



// declare all common error codes and display the with custom text
export function getAuthErrorMessage(error: any): string {
    if (!error?.code) return 'Unknown error';

    switch (error.code) {
        case 'auth/invalid-email':
            return 'invalid email';
        case 'auth/user-not-found':
            return 'user not found';
        case 'auth/wrong-password':
            return 'wrong password';
        case 'auth/email-already-in-use':
            return 'email already in use';
        default:
            return 'unexpected error';
    }
}
