export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  constructor(public context: SecurityRuleContext) {
    super(
      `Firestore Permission Denied: The following request was denied by Firestore Security Rules`
    );
    this.name = 'FirestorePermissionError';
  }

  toString() {
    return `${this.message}:\n${JSON.stringify(
      {
        context: this.context,
      },
      (key, value) => {
        // Firestore Timestamps can cause circular reference issues with JSON.stringify
        if (key === 'createdAt' && value && typeof value === 'object' && 'toDate' in value) {
          return value.toDate().toISOString();
        }
        return value;
      },
      2
    )}`;
  }
}
