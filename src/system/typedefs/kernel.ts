export interface KernelType {

}

export interface KernelSystemType {
    startup(): Promise<any>;
    cleanup(): Promise<any>;
}