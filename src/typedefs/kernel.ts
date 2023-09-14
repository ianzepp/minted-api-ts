//
// Interfaces
//

/**
 * The `Service` interface defines the structure for system operations.
 * It includes methods for authentication, startup, and cleanup processes.
 */
export interface Service {    
    /**
     * The `startup` method is responsible for handling the startup process of the system.
     * This could include initializing resources, setting up connections, or any other setup tasks.
     * It returns a Promise that resolves when the startup process is complete.
     * If there's an error during startup, the Promise should reject with an error.
     * 
     * @returns {Promise<void>}
     */
    startup(): Promise<void>;

    /**
     * The `cleanup` method is responsible for handling the cleanup process when the system is shutting down.
     * This could include closing connections, releasing resources, or any other cleanup tasks.
     * It returns a Promise that resolves when the cleanup process is complete.
     * If there's an error during cleanup, the Promise should reject with an error.
     * 
     * @returns {Promise<void>}
     */
    cleanup(): Promise<void>;

    /**
     * The `refresh` method is responsible for refreshing the system.
     * This involves running the cleanup process and then the startup process.
     * This could include closing and re-establishing connections, releasing and re-initializing resources, or any other cleanup and setup tasks.
     * It returns a Promise that resolves when the refresh process is complete.
     * If there's an error during refresh, the Promise should reject with an error.
     * 
     * @returns {Promise<void>}
     */
    refresh?(): Promise<void>;

    /**
     * The `certify` method is responsible for handling the authentication process.
     * It returns a Promise that resolves when the authentication process is complete.
     * If the authentication fails, the Promise should reject with an error.
     * 
     * @returns {Promise<void>}
     */
    certify?(): Promise<void>;
}

