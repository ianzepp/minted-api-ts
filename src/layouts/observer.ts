// Layouts
import { RecordJson } from "@layouts/record";

//
// Enums
//

/** The priority levels an observer can have. */
export enum ObserverRank {
    SystemMax = 0,
    Max = 1,
    Avg = 5,
    Min = 9,
}

/** The levels of operations for an observer. */
export enum ObserverRing {
    Init = 0, // System init
    Prep = 1, // Logic prep
    Load = 2, // Load in any data dependencies
    Work = 3, // Run logic
    Test = 4, // Validations
    Knex = 5, // Database changes
    Post = 6, // Post-db changes
    Flow = 7, // Cascade down to more flow operations
    Http = 8, // External HTTP updates, non-blocking
    Done = 9, // System cleanup
}


//
// Interfaces
//

/** ... */
export interface ObserverFlowFailure {
    code: number;
    message: string;
    record?: RecordJson;
}
