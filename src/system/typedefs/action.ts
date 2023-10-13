// Typedefs
import { RecordJson } from "./record";

//
// Enums
//

/** The priority levels an action can have. */
export enum ActionRank {
    KernelMax = 0,
    Max = 1,
    Avg = 5,
    Min = 9,
}

/** The levels of operations for an action. */
export enum ActionRing {
    Startup = 0, // Action startup
    Prep = 1, // Logic prep
    Load = 2, // Load in any data dependencies
    Transform = 3, // Run logic
    Test = 4, // Validations
    Database = 5, // Database changes
    Post = 6, // Post-db changes
    Cascade = 7, // Cascade to other operations
    Callout = 8, // Network callouts
    Cleanup = 9, // Action cleanup
}


//
// Interfaces
//

/** ... */
export interface SignalFailure {
    code: number;
    message: string;
    record?: RecordJson;
}
