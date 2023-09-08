
//
// Enums
//

/** The system verbs associated with system operations. */
export enum SystemVerb {
    Create = 'create',
    Delete = 'delete',
    Expire = 'expire',
    Select = 'select',
    Update = 'update',
    Upsert = 'upsert',
}


//
// Interfaces
//

/** ... */
export interface SystemUser {
    // The UUID of the running user, or the System.RootId if the running user is root
    id: string;

    // The Namespace of the running user. Used when creating new records and for visibility
    ns: string;

    // Any extra namespace visibility scopes to apply. Defaults to null
    scopes: string[] | null;
}
